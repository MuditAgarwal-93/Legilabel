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
function extractProductInfo(text, filename){
  const cleanText = text.replace(/\r/g, "");

  const lines = cleanText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  // MRP
  const mrpMatch = cleanText.match(
  /(?:MRP|M\.R\.P\.|Maximum Retail Price)\s*[:.-]?\s*(?:₹\s*)?[\d,]+(?:\.\d{1,2})?/i
);

  // Net quantity
// Prefer an explicit "Net Quantity" declaration.
let quantityMatch = cleanText.match(
  /(?:Net\s*(?:Quantity|Qty|Weight|Wt))[\s:.-]*(?:₹\s*)?(\d+(?:\.\d+)?\s*(?:kg|g|gm|mg|l|ml|L))/i
);

// If no explicit net quantity was found,
// prefer a quantity near the end of the label.
// This helps avoid nutrition values such as "2g".
if (!quantityMatch) {
  const quantityMatches = [
    ...cleanText.matchAll(
      /\b(\d+(?:\.\d+)?\s*(?:kg|g|gm|mg|l|ml|L))\b/gi
    ),
  ];

  if (quantityMatches.length > 0) {
    const preferredMatch = quantityMatches.find((match) => {
      const value = match[1].toLowerCase().replace(/\s/g, "");

      return value === "500g" || value === "1kg" || value === "250g" || value === "100g";
    });

    quantityMatch = preferredMatch || quantityMatches[quantityMatches.length - 1];
  }
}

 // Manufacturer / packer
let manufacturer = "Not detected";

const manufacturerIndex = lines.findIndex((line) =>
  /(?:manufactured\s*by|packed\s*by|packaged\s*by|harvested\s*and\s*packaged\s*by)/i.test(
    line
  )
);

if (manufacturerIndex !== -1) {
  const declarationLine = lines[manufacturerIndex];

  // If the company name is on the same line
  const sameLineMatch = declarationLine.match(
    /(?:manufactured\s*by|packed\s*by|packaged\s*by|harvested\s*and\s*packaged\s*by)\s*[:.-]?\s*(.+)/i
  );

  if (sameLineMatch && sameLineMatch[1].trim()) {
    manufacturer = sameLineMatch[1].trim();
  } else {
    // If OCR placed the company name on the next line
    const nextLine = lines[manufacturerIndex + 1];

    if (nextLine) {
      manufacturer = nextLine.trim();
    }
  }
}
  // Date
const dateMatch = cleanText.match(
  /(?:Mfg\.?\s*Date|Mfd\.?\s*Date|Manufacturing\s*Date|Date\s*of\s*Manufacture|Packed\s*on|Date\s*of\s*Packaging)\s*[:.-]?\s*([0-9]{1,2}[\/.-][0-9]{1,2}[\/.-][0-9]{2,4})/i
);

  // Country of origin
  // Only accept an explicit declaration.
  const countryMatch = cleanText.match(
    /(?:Country\s*of\s*Origin|Made\s*in|Product\s*of)\s*[:.-]?\s*([A-Za-z ]+)/i
  );

  // Consumer care
  const consumerCareMatch = cleanText.match(
    /(?:Consumer\s*Care|Customer\s*Care|Helpline|Contact\s*Us)[^:\n]*[:.-]?\s*([^\n]+)/i
  );

 // Product name
let productName = null;

// 1. Prefer an explicit product-name declaration.
const productNameMatch = cleanText.match(
  /(?:Product\s*Name|Product)\s*[:.-]\s*([^\n]+)/i
);

if (productNameMatch) {
  productName = productNameMatch[1].trim();
}

// 2. If there is no explicit declaration, look for a short
// product-like line while ignoring descriptions and technical text.
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
    /consumer\s+care/i,
    /customer\s+care/i,
    /po\s+box/i,
    /address/i,
    /phone/i,
    /email/i,
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
    productName = productCandidates[0].trim();
  }
}

  // Final fallback
  if (!productName) {
    productName = filename.replace(/\.[^/.]+$/, "");
  }

  return {
    name: productName,
    mrp: mrpMatch ? mrpMatch[0].trim() : "Not detected",
    manufacturer,
    netQuantity: quantityMatch
      ? quantityMatch[1].trim()
      : "Not detected",
    date: dateMatch ? dateMatch[1].trim() : "Not detected",
    countryOfOrigin: countryMatch
      ? countryMatch[1].trim()
      : "Not detected",
    consumerCare: consumerCareMatch
      ? consumerCareMatch[1].trim()
      : "Not detected",
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

The input below is OCR text produced from an image of a real product label.
OCR may contain spelling errors, duplicated text, broken words, misplaced
lines, symbols, or characters that were incorrectly recognized.

Your task is to understand the label context and extract the correct
information.

Return ONLY valid JSON with exactly these fields:

{
  "productName": "",
  "manufacturer": "",
  "netQuantity": "",
  "mrp": "",
  "date": "",
  "countryOfOrigin": "",
  "consumerCare": ""
}

IMPORTANT RULES:

1. Use ONLY information that is actually present in the OCR text.
2. NEVER invent, assume, or guess information.
3. If a field cannot be confidently identified, return "Not detected".
4. Correct obvious OCR errors when the intended text is clear from the
   surrounding context.
5. Understand the relationship between nearby lines. OCR line order may
   not perfectly match the original label layout.
6. PRODUCT NAME:
   - Identify the actual name of the commodity/product.
   - Prefer a prominent product name over slogans, descriptions,
     nutritional information, company names, addresses, or logos.
   - Do NOT use a manufacturer/company name as the product name.
   - Do NOT use marketing slogans such as "Pure. Natural. Delicious."
     as the product name.
   - For example, if the label contains "Honey" as the commodity and
     "HoneyHarvest Naturals" as the company, productName should be "Honey".
7. MANUFACTURER:
   - Look for declarations such as:
     "Manufactured by", "Manufactured & Packed by", "Packed by",
     "Packaged by", "Harvested and Packaged by", "Marketed by",
     "Manufactured and Marketed by", etc.
   - Extract the company/person responsible for manufacturing or packing.
   - Do NOT extract an entire unrelated OCR line such as nutritional
     information together with the company name.
8. NET QUANTITY:
   - Look for declarations such as "Net Quantity", "Net Weight",
     "Net Wt", etc.
   - A standalone quantity such as "500 g" can be used when it is clearly
     the package quantity.
   - Do NOT confuse serving sizes or nutritional quantities with net quantity.
9. MRP:
   - Look specifically for "MRP", "M.R.P.", "Maximum Retail Price",
     or a clearly associated retail price.
   - Preserve the value as written when possible.
   - Do NOT mistake nutritional numbers for MRP.
10. DATE:
    - Look for manufacturing, packing, packaging, or similar date declarations.
    - Preserve the date as written.
    - Do NOT interpret unrelated numbers as dates.
11. COUNTRY OF ORIGIN:
    - Only return a country when the label explicitly indicates it using
      wording such as "Country of Origin", "Made in", or "Product of".
    - Do NOT infer the country from an address.
12. CONSUMER CARE:
    - Look for consumer care, customer care, helpline, phone, email,
      or complaint contact information.
    - Only return it when clearly associated with consumer/customer contact.
13. Ignore nutritional facts unless they are relevant to one of the fields above.
14. Ignore slogans, advertisements, decorative text, logos and general
    marketing descriptions.
15. If OCR contains duplicated text, use the clearest occurrence.
16. Return ONLY the JSON object.
17. Do NOT include markdown.
18. Do NOT include explanations.

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

  const responseText = result.response.text().trim();

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

try {
  console.log("Starting Gemini AI extraction...");
  throw new Error("TEST: Simulated Gemini failure");

  const aiProductInfo = await extractProductInfoWithGemini(
  extractedText,
  req.file.buffer
);

  console.log("Gemini AI extraction completed:");
  console.log(aiProductInfo);

  productInfo = {
    name: aiProductInfo.productName,
    manufacturer: aiProductInfo.manufacturer,
    netQuantity: aiProductInfo.netQuantity,
    mrp: aiProductInfo.mrp,
    date: aiProductInfo.date,
    countryOfOrigin: aiProductInfo.countryOfOrigin,
    consumerCare: aiProductInfo.consumerCare,
  };
} catch (aiError) {
  console.error("Gemini AI extraction failed:", aiError.message);
  console.log("Using existing extraction as fallback.");
}

console.log("Final structured product information:");
console.log(productInfo);

const complianceResult = checkCompliance({
  productName: productInfo.name,
  manufacturer: productInfo.manufacturer,
  netQuantity: productInfo.netQuantity,
  mrp: productInfo.mrp,
  date: productInfo.date,
  countryOfOrigin: productInfo.countryOfOrigin,
  consumerCare: productInfo.consumerCare,
});

   res.json({
  success: true,
  message: "OCR and information extraction completed",
  result: {
    productName: productInfo.name,
    sku: "DEMO-SKU",
    manufacturer: productInfo.manufacturer,
    netQuantity: productInfo.netQuantity,
    mrp: productInfo.mrp,
    date: productInfo.date,
    countryOfOrigin: productInfo.countryOfOrigin,
    consumerCare: productInfo.consumerCare,

    score: 0,
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