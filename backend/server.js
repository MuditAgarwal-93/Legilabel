require("dotenv").config();


const express = require("express");
const cors = require("cors");
const multer = require("multer");
const Tesseract = require("tesseract.js");
const sharp = require("sharp");
const OpenAI = require("openai");

const checkCompliance = require("./rules/complianceChecker");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// File upload setup
const upload = multer({
  storage: multer.memoryStorage(),
});

// Test endpoint
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "LegiLabel backend is working",
  });
});

// Clean and normalize OCR text
function cleanOcrText(text) {
  return text
    .replace(/\r/g, "")
    .replace(/[^\S\n]+/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// Extract structured information from OCR text
function extractProductInfo(text, filename) {
  const cleanText = text.replace(/\r/g, "");

  const lines = cleanText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  // =========================================================
  // MRP
  // =========================================================

  const mrpMatch = cleanText.match(
    /(?:MRP|M\.R\.P\.|Maximum Retail Price)\s*[:.-]?\s*(?:₹\s*)?[\d,]+(?:\.\d{1,2})?/i
  );

  // =========================================================
  // NET QUANTITY
  // =========================================================

  let quantityMatch = cleanText.match(
    /(?:Net\s*(?:Quantity|Qty|Weight|Wt))[\s:.-]*(?:₹\s*)?(\d+(?:\.\d+)?\s*(?:kg|g|gm|mg|l|lt|ltr|ml|L|m|cm|mm|nos|no|pcs|piece|pieces))/i
  );

  // If no explicit net quantity was found,
  // look for a likely quantity elsewhere on the label.
  if (!quantityMatch) {
    const quantityMatches = [
      ...cleanText.matchAll(
        /\b(\d+(?:\.\d+)?\s*(?:kg|g|gm|mg|l|lt|ltr|ml|L|m|cm|mm|nos|no|pcs|piece|pieces))\b/gi
      ),
    ];

    if (quantityMatches.length > 0) {
      const preferredMatch = quantityMatches.find((match) => {
        const value = match[1].toLowerCase().replace(/\s/g, "");

        return [
          "500g",
          "1kg",
          "250g",
          "100g",
        ].includes(value);
      });

      quantityMatch =
        preferredMatch || quantityMatches[quantityMatches.length - 1];
    }
  }

  const netQuantity = quantityMatch
    ? quantityMatch[1].trim()
    : "Not detected";

  // Extract quantity value + unit separately
  let quantityValue = "Not detected";
  let quantityUnit = "Not detected";

  if (quantityMatch) {
    const structuredQuantityMatch = netQuantity.match(
      /^(\d+(?:\.\d+)?)\s*(kg|g|gm|mg|l|lt|ltr|ml|L|m|cm|mm|nos|no|pcs|piece|pieces)$/i
    );

    if (structuredQuantityMatch) {
      quantityValue = structuredQuantityMatch[1];
      quantityUnit = structuredQuantityMatch[2];
    }
  }

  // =========================================================
  // PACKER / MANUFACTURER
  // =========================================================

  let manufacturer = "Not detected";
  let packedBy = "Not detected";

  const manufacturerIndex = lines.findIndex((line) =>
    /(?:manufactured\s*by|packed\s*by|packaged\s*by|harvested\s*and\s*packaged\s*by)/i.test(
      line
    )
  );

  if (manufacturerIndex !== -1) {
    const declarationLine = lines[manufacturerIndex];

    const sameLineMatch = declarationLine.match(
      /(?:manufactured\s*by|packed\s*by|packaged\s*by|harvested\s*and\s*packaged\s*by)\s*[:.-]?\s*(.+)/i
    );

    if (sameLineMatch && sameLineMatch[1].trim()) {
  const sameLineValue = sameLineMatch[1].trim();

  // Ignore obvious OCR noise such as "*", "-", ".", etc.
  if (/^[^A-Za-z0-9]+$/.test(sameLineValue)) {
    const nextLine = lines[manufacturerIndex + 1];

    if (nextLine) {
      packedBy = nextLine.trim();
    }
  } else {
    packedBy = sameLineValue;
  }
} else {
  const nextLine = lines[manufacturerIndex + 1];

  if (nextLine) {
    packedBy = nextLine.trim();
  }
}

    // Keep manufacturer compatibility with the old fallback.
    // If the declaration explicitly says "Manufactured By",
    // treat it as manufacturer information.
    if (/manufactured\s*by/i.test(declarationLine)) {
      manufacturer = packedBy;
    }
  }

  // =========================================================
  // MARKETED BY
  // =========================================================

  let marketedBy = "Not detected";

  const marketedByMatch = cleanText.match(
    /(?:Marketed\s*By|Marketed\s*&\s*Distributed\s*By|Distributed\s*By)\s*[:.-]?\s*([^\n]+)/i
  );

  if (marketedByMatch) {
  const sameLineValue = marketedByMatch[1].trim();

  // OCR sometimes captures garbage such as "Eg"
  // before the actual company name on the next line.
  if (
    sameLineValue.length < 3 ||
    /^[^A-Za-z]+$/.test(sameLineValue) ||
    /^(eg|et|by|a)$/i.test(sameLineValue)
  ) {
    const marketedLineIndex = lines.findIndex((line) =>
      /marketed\s*by|distributed\s*by/i.test(line)
    );

    const nextLine = lines[marketedLineIndex + 1];

    if (nextLine) {
      marketedBy = nextLine.trim();
    }
  } else {
    marketedBy = sameLineValue;
  }
}
  // =========================================================
  // DATE / PACKED ON / MANUFACTURED ON
  // =========================================================

  const dateMatch = cleanText.match(
  /(?:Mfg\.?\s*Date|Mfd\.?\s*Date|Manufacturing\s*Date|Date\s*of\s*Manufacture|Packed\s*on|Packed\s*Date|Date\s*of\s*Packaging)\s*[:.>\-]?\s*([0-9]{1,2}[\/.-][0-9]{1,2}[\/.-][0-9]{2,4})/i
);

  const date = dateMatch
    ? dateMatch[1].trim()
    : "Not detected";

  // =========================================================
  // BEST BEFORE
  // =========================================================

  const bestBeforeMatch = cleanText.match(
    /(?:Best\s*Before|Use\s*Before|Expiry\s*Date|Exp\.?\s*Date)\s*[:.-]?\s*([^\n]+)/i
  );

  const bestBefore = bestBeforeMatch
    ? bestBeforeMatch[1].trim()
    : "Not detected";

  // =========================================================
  // BATCH NUMBER
  // =========================================================

  const batchMatch = cleanText.match(
    /(?:Batch(?:\s*No\.?)?|Batch\s*Number|Lot(?:\s*No\.?)?|Lot\s*Number)\s*[:.-]?\s*([A-Za-z0-9\/_-]+)/i
  );

  const batchNumber = batchMatch
    ? batchMatch[1].trim()
    : "Not detected";

  // =========================================================
  // COUNTRY OF ORIGIN
  // =========================================================

  const countryMatch = cleanText.match(
    /(?:Country\s*of\s*Origin|Made\s*in|Product\s*of)\s*[:.-]?\s*([A-Za-z ]+)/i
  );

  const countryOfOrigin = countryMatch
    ? countryMatch[1].trim()
    : "Not detected";

  // =========================================================
  // CONSUMER CARE
  // =========================================================

  const consumerCareMatch = cleanText.match(
    /(?:Consumer\s*Care|Customer\s*Care|Helpline|Contact\s*Us|Reach\s*Us)[^:\n]*[:.-]?\s*([^\n]+)/i
  );

  const consumerCare = consumerCareMatch
    ? consumerCareMatch[1].trim()
    : "Not detected";

  // =========================================================
  // IMPORTER
  // =========================================================

  const importerMatch = cleanText.match(
    /(?:Imported\s*By|Importer|Importer\s*Details)\s*[:.-]?\s*([^\n]+)/i
  );

  const importer = importerMatch
    ? importerMatch[1].trim()
    : "Not detected";

  // =========================================================
  // UNIT SALE PRICE
  // =========================================================

  const unitSalePriceMatch = cleanText.match(
    /(?:Unit\s*Sale\s*Price|Unit\s*Price|Sale\s*Price\s*per)\s*[:.-]?\s*([^\n]+)/i
  );

  const unitSalePrice = unitSalePriceMatch
    ? unitSalePriceMatch[1].trim()
    : "Not detected";

  // =========================================================
  // PRODUCT NAME
  // =========================================================

  let productName = null;

  // 1. Prefer explicit product-name declaration.
  const productNameMatch = cleanText.match(
    /(?:Product\s*Name|Product)\s*[:.-]\s*([^\n]+)/i
  );

  if (productNameMatch) {
    productName = productNameMatch[1].trim();
  }

  // 2. Look for a short product-like line.
  if (!productName) {
    const ignoredPatterns = [
      /nutrition/i,
      /serving/i,
      /calories/i,
      /total\s+fat/i,
      /saturated\s+fat/i,
      /trans\s+fat/i,
      /cholesterol/i,
      /sodium/i,
      /carbohydrate/i,
      /dietary\s+fiber/i,
      /sugars/i,
      /protein/i,
      /daily\s+values/i,
      /company\s+details/i,
      /manufactured/i,
      /manufacture/i,
      /packed\s+by/i,
      /packaged\s+by/i,
      /harvested\s+and\s+packaged/i,
      /marketed\s+by/i,
      /consumer\s+care/i,
      /customer\s+care/i,
      /po\s+box/i,
      /address/i,
      /phone/i,
      /email/i,
      /batch/i,
      /best\s+before/i,
      /mrp/i,
    ];

    const productCandidates = lines.filter((line) => {
      const words = line.split(/\s+/);

      return (
        words.length >= 1 &&
        words.length <= 5 &&
        line.length >= 3 &&
        line.length <= 50 &&
        !ignoredPatterns.some((pattern) => pattern.test(line)) &&
        !/\d{3,}/.test(line) &&
        !/[.!?].*[.!?]/.test(line)
      );
    });

    if (productCandidates.length > 0) {
  const candidate = productCandidates[0].trim();

  // Reject obvious OCR noise.
  if (
    candidate.length >= 3 &&
    /[A-Za-z]{2,}/.test(candidate) &&
    !/^[^A-Za-z0-9]*$/.test(candidate)
  ) {
    productName = candidate;
  }
}
  }

  // Final fallback
  if (!productName) {
    productName = filename.replace(/\.[^/.]+$/, "");
  }

  // =========================================================
  // FALLBACK-ONLY FIELDS
  // =========================================================

  // Regex/OCR fallback cannot reliably perform image-level
  // visual analysis. These fields are deliberately marked
  // as unavailable rather than pretending they were detected.

  const qrCode = "Not assessed in fallback mode";

  const garmentDetails =
    "Not assessed in fallback mode";

  const wholesaleDetails =
    "Not assessed in fallback mode";

  const exportDetails =
    "Not assessed in fallback mode";

  const scope = "Needs review";

  // =========================================================
  // FINAL STRUCTURED RESULT
  // Same schema as Gemini
  // =========================================================

  return {
    productName,

    manufacturer,
    packedBy,
    marketedBy,

    netQuantity,
    quantityValue,
    quantityUnit,

    mrp: mrpMatch
      ? mrpMatch[0].trim()
      : "Not detected",

    unitSalePrice,

    date,
    bestBefore,
    batchNumber,

    countryOfOrigin,
    consumerCare,
    importer,

    packageType: "retail",

    qrCode,

    garmentDetails,
    wholesaleDetails,
    exportDetails,

    scope,
  };
}

// AI extraction from OCR text
async function extractProductInfoWithAI(text) {
  const response = await openai.chat.completions.create({
    model: "gpt-5.4-mini",

    messages: [
      {
        role: "system",
        content: `
You are an expert product-label information extraction system.

Your job is to extract information from OCR text taken from a packaged product label.

Return ONLY valid JSON with these fields:
- productName
- manufacturer
- netQuantity
- mrp
- date
- countryOfOrigin
- consumerCare

Rules:
1. Use ONLY information present in the OCR text.
2. NEVER invent or guess missing information.
3. If a field cannot be confidently identified, return "Not detected".
4. Do not treat an address as the country of origin.
5. Do not treat a company name as the product name unless the context clearly indicates it.
6. Marketing text, slogans and descriptions are not the product name.
7. "Manufactured by", "Packed by", "Packaged by", "Marketed by", and similar declarations can help identify the relevant company.
8. Preserve values such as MRP, quantity and dates as they appear in the OCR.
9. Return only the JSON object. Do not include explanations or markdown.
        `,
      },
      {
        role: "user",
        content: `OCR TEXT:

${text}`,
      },
    ],

    response_format: {
      type: "json_schema",
      json_schema: {
        name: "product_label_information",
        strict: true,
        schema: {
          type: "object",
          properties: {
            productName: { type: "string" },
            manufacturer: { type: "string" },
            netQuantity: { type: "string" },
            mrp: { type: "string" },
            date: { type: "string" },
            countryOfOrigin: { type: "string" },
            consumerCare: { type: "string" },
          },
          required: [
            "productName",
            "manufacturer",
            "netQuantity",
            "mrp",
            "date",
            "countryOfOrigin",
            "consumerCare",
          ],
          additionalProperties: false,
        },
      },
    },
  });

  return JSON.parse(response.choices[0].message.content);
}


// AI extraction using Gemini
async function extractProductInfoWithGemini(text, imageBuffer) {
  const { GoogleGenerativeAI } = require("@google/generative-ai");

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  const model = genAI.getGenerativeModel({
    model: "gemini-3.6-flash",
  });

  const prompt = `
You are an expert system for extracting structured information from
packaged product labels.

The input is OCR text from a real product label plus the original product
image.

OCR may contain spelling errors, duplicated text, broken words, misplaced
lines, or incorrectly recognized characters.

Your job is to identify information that is actually present on the label.

Return ONLY valid JSON.

IMPORTANT RULES:

1. Use ONLY information actually present in the OCR text or visible in the image.
2. NEVER invent, assume, or guess information.
3. If a field cannot be confidently identified, return "Not detected".
4. Correct obvious OCR errors only when the intended text is clear.
5. Do not confuse nutritional values with package declarations.
6. Do not confuse addresses with product information.
7. Do not infer country of origin from an Indian address.
8. Preserve quantities, prices and dates as they appear where possible.

PRODUCT NAME:
- Identify the actual common/generic product name.
- Prefer a prominent product name.
- Do not use slogans, descriptions, nutrition information or company names.

MANUFACTURER / PACKER:
- Look for "Manufactured by", "Packed by", "Packaged by",
  "Manufactured & Packed by", "Harvested and Packaged by", etc.
- Extract the responsible company/person.
- Do not include unrelated nutritional information.

MARKETED BY:
- Look for "Marketed by" or similar wording.
- Extract the company/person if present.

NET QUANTITY:
- Look for "Net Quantity", "Net Weight", "Net Wt", etc.
- Return the complete quantity such as "250 Gm".
- Do not confuse serving size or nutritional quantities with net quantity.

QUANTITY VALUE:
- Extract only the numerical quantity value from the package quantity.
- Example: "250 Gm" → "250".

QUANTITY UNIT:
- Extract the unit from the package quantity.
- Example: "250 Gm" → "Gm".

MRP:
- Look for MRP, M.R.P., Maximum Retail Price or clearly associated retail price.
- Do not confuse nutrition numbers with MRP.

UNIT SALE PRICE:
- Extract it only if a unit sale price is explicitly present.
- Do not calculate it yourself.
- If not present, return "Not detected".

PACKED ON / MANUFACTURING DATE:
- Look for Packed On, Packed Date, Manufacturing Date, Mfg Date,
  Date of Packaging, etc.
- Extract the relevant date.
- Do not treat batch numbers as dates unless explicitly declared as a date.

BEST BEFORE / USE BY:
- Look specifically for Best Before, Use By, Expiry, etc.
- Extract the declaration exactly or as clearly interpreted.
- Do not invent missing information.

BATCH NUMBER:
- Look for Batch, Batch No, Lot, Lot No, etc.
- Extract the value.

COUNTRY OF ORIGIN:
- Only return a country when explicitly declared using wording such as
  Country of Origin, Made in, Product of, etc.
- Do not infer it from an address.

CONSUMER CARE:
- Extract phone, email, helpline or customer-care contact information
  when clearly associated with consumer/customer contact.

IMPORTER:
- Look for "Imported by", "Importer", etc.
- Extract the responsible company/person if present.

PACKAGE TYPE:
- Determine package type ONLY when the label/image provides evidence.
- Possible values:
  "retail", "wholesale", "export", "loose", "open", "unknown"
- Do not assume wholesale/export/loose without evidence.
- If this is a normal consumer retail package, "retail" may be returned
  when the package presentation clearly supports that conclusion.

QR CODE:
- Return "Detected" only if a QR code is visibly present on the image.
- Otherwise return "Not detected".

GARMENT DETAILS:
- Only relevant to textile/garment products.
- Extract applicable garment-specific declarations if present.
- Otherwise return "Not detected".

WHOLESALE DETAILS:
- Extract wholesale-package declarations if clearly present.
- Otherwise return "Not detected".

EXPORT DETAILS:
- Extract export-package information if clearly present.
- Otherwise return "Not detected".

SCOPE:
- Do not make a legal exemption determination from OCR alone.
- Return "Within scope" only when the label clearly represents a packaged
  commodity being evaluated.
- Otherwise return "Review".

Return exactly these fields:

{
  "productName": "",
  "manufacturer": "",
  "packedBy": "",
  "marketedBy": "",
  "netQuantity": "",
  "quantityValue": "",
  "quantityUnit": "",
  "mrp": "",
  "unitSalePrice": "",
  "date": "",
  "bestBefore": "",
  "batchNumber": "",
  "countryOfOrigin": "",
  "consumerCare": "",
  "importer": "",
  "packageType": "",
  "qrCode": "",
  "garmentDetails": "",
  "wholesaleDetails": "",
  "exportDetails": "",
  "scope": ""
}

OCR TEXT:
${text}
`;

  const result = await model.generateContent([
    {
      text: prompt,
    },
    {
      inlineData: {
        data: imageBuffer.toString("base64"),
        mimeType: "image/jpeg",
      },
    },
  ]);

 let responseText = result.response.text().trim();

// Gemini may sometimes wrap JSON in Markdown code fences
if (responseText.startsWith("```")) {
  responseText = responseText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

return JSON.parse(responseText);
}

// Analyze endpoint with OCR
app.post("/api/analyze", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file was uploaded",
    });
  }

  const productCategory = req.body.productCategory;
  const productOrigin = req.body.productOrigin;

  try {
    console.log("File received:", req.file.originalname);
    console.log("Starting OCR...");

    const { data } = await Tesseract.recognize(
    await sharp(req.file.buffer)
  .resize({
    width: 3000,
    withoutEnlargement: false,
  })
  .grayscale()
  .normalize()
  .png({
    density: 300,
  })
  .toBuffer(),
      "eng",
      {
        logger: (info) => {
          if (info.status === "recognizing text") {
            console.log(
              `OCR progress: ${Math.round(info.progress * 100)}%`
            );
          }
        },
      }
    );

    const extractedText = cleanOcrText(data.text);

    console.log("OCR completed.");
    console.log("Extracted text:");
    console.log(extractedText);

    // Convert OCR text into structured product information
    let productInfo = extractProductInfo(
  extractedText,
  req.file.originalname
);

let analysisMode = "fallback";

// Tell the compliance engine which analysis pipeline is being used
productInfo.analysisMode = analysisMode;

console.log("SET ANALYSIS MODE:", productInfo.analysisMode);


try {
  console.log("Starting Gemini AI extraction...");
  throw new Error("TEST: Simulated Gemini failure");

  const aiProductInfo = await extractProductInfoWithGemini(
  extractedText,
  req.file.buffer
);

  console.log("Gemini AI extraction completed:");
  console.log(aiProductInfo);
  analysisMode = "ai";

  productInfo = {
  analysisMode: analysisMode,
  productName: aiProductInfo.productName,
  manufacturer: aiProductInfo.manufacturer,
  packedBy: aiProductInfo.packedBy,
  marketedBy: aiProductInfo.marketedBy,

  netQuantity: aiProductInfo.netQuantity,
  quantityValue: aiProductInfo.quantityValue,
  quantityUnit: aiProductInfo.quantityUnit,

  mrp: aiProductInfo.mrp,
  unitSalePrice: aiProductInfo.unitSalePrice,

  date: aiProductInfo.date,
  bestBefore: aiProductInfo.bestBefore,
  batchNumber: aiProductInfo.batchNumber,

  countryOfOrigin: aiProductInfo.countryOfOrigin,
  consumerCare: aiProductInfo.consumerCare,
  importer: aiProductInfo.importer,

  packageType: aiProductInfo.packageType,
  qrCode: aiProductInfo.qrCode,

  garmentDetails: aiProductInfo.garmentDetails,
  wholesaleDetails: aiProductInfo.wholesaleDetails,
  exportDetails: aiProductInfo.exportDetails,
  scope: aiProductInfo.scope,
};


} catch (aiError) {
  console.error("Gemini AI extraction failed:", aiError.message);
  console.log("Using existing extraction as fallback.");
}

console.log("Final structured product information:");
console.log(productInfo);

const complianceResult = checkCompliance({
  analysisMode: productInfo.analysisMode,

  productName: productInfo.productName,

  manufacturer: productInfo.manufacturer,
  packedBy: productInfo.packedBy,
  marketedBy: productInfo.marketedBy,

  netQuantity: productInfo.netQuantity,
  quantityValue: productInfo.quantityValue,
  quantityUnit: productInfo.quantityUnit,

  mrp: productInfo.mrp,
  unitSalePrice: productInfo.unitSalePrice,

  date: productInfo.date,
  bestBefore: productInfo.bestBefore,
  batchNumber: productInfo.batchNumber,

  countryOfOrigin: productInfo.countryOfOrigin,
  consumerCare: productInfo.consumerCare,
  importer: productInfo.importer,

  packageType: productInfo.packageType,
  qrCode: productInfo.qrCode,

  garmentDetails: productInfo.garmentDetails,
  wholesaleDetails: productInfo.wholesaleDetails,
  exportDetails: productInfo.exportDetails,
  scope: productInfo.scope,

  productCategory,
  productOrigin,
});


//console.log("COMPLIANCE CHECKS:");
//console.log(complianceResult.checks);

   res.json({
  success: true,
  message: "OCR and information extraction completed",

  result: {
    analysisMode: analysisMode,
    productName: productInfo.productName,
    sku: "DEMO-SKU",
    manufacturer: productInfo.manufacturer,
    netQuantity: productInfo.netQuantity,
    mrp: productInfo.mrp,
    date: productInfo.date,
    countryOfOrigin: productInfo.countryOfOrigin,
    consumerCare: productInfo.consumerCare,

    packedBy: productInfo.packedBy,
    marketedBy: productInfo.marketedBy,

    quantityValue: productInfo.quantityValue,
    quantityUnit: productInfo.quantityUnit,

    unitSalePrice: productInfo.unitSalePrice,
    bestBefore: productInfo.bestBefore,
    batchNumber: productInfo.batchNumber,

    importer: productInfo.importer,
    packageType: productInfo.packageType,
    qrCode: productInfo.qrCode,

    score: complianceResult.score,
    status: complianceResult.overallStatus,

    // Keep raw OCR text for debugging
    extractedText: extractedText,

    checks: complianceResult.checks,
  },
});

  } catch (error) {
    console.error("OCR error:", error);

    res.status(500).json({
      success: false,
      message: "OCR processing failed",
    });
  }
});

app.listen(PORT, () => {
  console.log(`LegiLabel backend running on http://localhost:${PORT}`);
});