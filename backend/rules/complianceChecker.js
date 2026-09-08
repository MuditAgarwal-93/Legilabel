const packagedCommodityRules = require("./packagedCommodityRules");

// =========================================================
// BASIC HELPERS
// =========================================================

function isDetected(value) {
  if (value === null || value === undefined) {
    return false;
  }

  const text = String(value).trim().toLowerCase();

  return (
    text !== "" &&
    text !== "not detected" &&
    text !== "unknown" &&
    text !== "needs review"
  );
}

function normalize(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim().toLowerCase();
}

function getProductText(productInfo) {
  return [
    productInfo.productName,
    productInfo.extractedText,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

// =========================================================
// PRODUCT CATEGORY DETECTION
// =========================================================

function isFoodProduct(productInfo) {
  const text = getProductText(productInfo);

  const foodKeywords = [
    "food",
    "edible",
    "biscuit",
    "cookie",
    "chips",
    "snack",
    "juice",
    "drink",
    "beverage",
    "honey",
    "milk",
    "bread",
    "rice",
    "flour",
    "atta",
    "salt",
    "sugar",
    "tea",
    "coffee",
    "oil",
    "ghee",
    "butter",
    "chocolate",
    "candy",
    "sweet",
    "sauce",
    "pickle",
  ];

  return (
    normalize(productInfo.productCategory) === "food" ||
    foodKeywords.some((keyword) => text.includes(keyword))
  );
}

function isTextileProduct(productInfo) {
  const text = getProductText(productInfo);

  const textileKeywords = [
    "bed sheet",
    "bedsheet",
    "dhoti",
    "saree",
    "sari",
    "napkin",
    "pillow cover",
    "pillow-cover",
    "towel",
    "table cloth",
    "tablecloth",
    "fabric",
    "cloth",
    "textile",
    "garment",
    "hosiery",
    "shirt",
    "trouser",
    "pant",
    "sock",
    "socks",
  ];

  return (
    ["textile", "garment"].includes(
      normalize(productInfo.productCategory)
    ) ||
    textileKeywords.some((keyword) => text.includes(keyword))
  );
}

function isElectronicProduct(productInfo) {
  const text = getProductText(productInfo);

  const electronicKeywords = [
    "mobile",
    "smartphone",
    "phone",
    "charger",
    "adapter",
    "television",
    "tv",
    "laptop",
    "computer",
    "keyboard",
    "mouse",
    "earphone",
    "headphone",
    "speaker",
    "electronic",
    "electronics",
    "battery",
    "power bank",
  ];

  return (
    normalize(productInfo.productCategory) === "electronic" ||
    electronicKeywords.some((keyword) => text.includes(keyword))
  );
}

// =========================================================
// PACKAGE TYPE
// =========================================================

function getPackageType(productInfo) {
  const explicitType = normalize(productInfo.packageType);

  if (
    [
      "retail",
      "wholesale",
      "export",
      "loose",
      "open",
      "unknown",
    ].includes(explicitType)
  ) {
    return explicitType;
  }

  if (productInfo.isWholesalePackage === true) {
    return "wholesale";
  }

  if (productInfo.isCombinationPackage === true) {
    return "retail";
  }

  // Current LegiLabel flow mainly deals with packaged retail
  // commodities unless the user explicitly specifies another type.
  return "retail";
}

// =========================================================
// ORIGIN
// =========================================================

function getOrigin(productInfo) {
  const origin = normalize(productInfo.productOrigin);

  if (origin === "india" || origin === "indian") {
    return "india";
  }

  if (
    origin === "imported" ||
    origin === "import" ||
    origin === "foreign"
  ) {
    return "imported";
  }

  return "unknown";
}

// =========================================================
// RULE CONDITION MATCHING
// =========================================================

function matchesCondition(rule, productInfo) {
  const conditions = rule.conditions || {};

  const packageType = getPackageType(productInfo);
  const origin = getOrigin(productInfo);

  // -------------------------
  // Package type
  // -------------------------

  if (conditions.packageType) {
    if (!conditions.packageType.includes(packageType)) {
      return false;
    }
  }

  // -------------------------
  // Origin
  // -------------------------

  if (conditions.origin) {
    if (!conditions.origin.includes(origin)) {
      return false;
    }
  }

  // -------------------------
  // Category
  // -------------------------

  if (rule.category && !rule.category.includes("all")) {
    let detectedCategory = normalize(productInfo.productCategory);

    if (!detectedCategory) {
      if (isFoodProduct(productInfo)) {
        detectedCategory = "food";
      } else if (isTextileProduct(productInfo)) {
        detectedCategory = "textile";
      } else if (isElectronicProduct(productInfo)) {
        detectedCategory = "electronic";
      }
    }

    const categoryMatches = rule.category.some(
      (category) => normalize(category) === detectedCategory
    );

    if (!categoryMatches) {
      return false;
    }
  }

  return true;
}

// =========================================================
// CHECK RESULT BUILDERS
// =========================================================

function makePass(rule, value, detail) {
  return {
    id: rule.id,
    label: rule.label,
    status: "pass",
    detail:
      detail ||
      rule.passCondition ||
      `${rule.label} was successfully detected.`,
    value,
    ruleReference: rule.ruleReference,
    priority: rule.priority || "medium",
    checkType: rule.checkType,
  };
}

function makeFail(rule, detail) {
  return {
    id: rule.id,
    label: rule.label,
    status: "fail",
    detail:
      detail ||
      rule.failCondition ||
      `${rule.label} was not detected.`,
    value: "Not detected",
    ruleReference: rule.ruleReference,
    priority: rule.priority || "medium",
    checkType: rule.checkType,
  };
}

function makeReview(rule, detail) {
  return {
    id: rule.id,
    label: rule.label,
    status: "review",
    detail:
      detail ||
      rule.reviewCondition ||
      `${rule.label} could not be fully verified automatically.`,
    value: "Needs review",
    ruleReference: rule.ruleReference,
    priority: rule.priority || "medium",
    checkType: rule.checkType,
  };
}

// =========================================================
// VALUE-SPECIFIC CHECKS
// =========================================================

function checkPresence(rule, value, productInfo) {
  // LM-001: Manufacturer / Packer / Importer Details
  // A valid packer or importer declaration can satisfy this check
  // when a manufacturer name is not separately detected.
  if (rule.id === "LM-001") {
    const manufacturer = productInfo.manufacturer;
    const packedBy = productInfo.packedBy;
    const importer = productInfo.importer;

    if (isDetected(manufacturer)) {
      return makePass(
        rule,
        manufacturer,
        "Manufacturer details are detected."
      );
    }

    if (isDetected(packedBy)) {
      return makePass(
        rule,
        packedBy,
        "Packer details are detected."
      );
    }

    if (isDetected(importer)) {
      return makePass(
        rule,
        importer,
        "Importer details are detected."
      );
    }

    return makeFail(rule);
  }

  if (isDetected(value)) {
    return makePass(rule, value);
  }

  return makeFail(rule);
}

function checkQuantity(rule, value, productInfo) {
  // Prefer the structured quantity extracted by Gemini.
  const quantityValue = productInfo.quantityValue;
  const quantityUnit = productInfo.quantityUnit;

  if (
    isDetected(quantityValue) &&
    isDetected(quantityUnit)
  ) {
    return makePass(
      rule,
      `${quantityValue} ${quantityUnit}`,
      "Net quantity and an appropriate unit are detected."
    );
  }

  // Fallback to the complete netQuantity field.
  if (!isDetected(value)) {
    return makeFail(rule);
  }

  const text = normalize(value);

  const quantityPattern =
    /\b\d+(?:\.\d+)?\s*(kg|g|gm|mg|l|lt|ltr|ml|m|cm|mm|nos|no|pcs|piece|pieces)\b/i;

  if (!quantityPattern.test(text)) {
    return makeReview(
      rule,
      "A quantity was detected, but the applicable unit could not be confidently verified."
    );
  }

  return makePass(
    rule,
    value,
    "Net quantity and an appropriate unit are detected."
  );
}

function checkUnitFormat(rule, value, productInfo) {
  // Prefer the unit separately extracted by Gemini.
  const quantityUnit = productInfo.quantityUnit;

  if (isDetected(quantityUnit)) {
    const unit = normalize(quantityUnit).replace(/\s/g, "");

    const validUnits = [
      "kg",
      "g",
      "gm",
      "mg",
      "l",
      "lt",
      "ltr",
      "ml",
      "m",
      "cm",
      "mm",
      "nos",
      "no",
      "pcs",
      "piece",
      "pieces",
    ];

    if (validUnits.includes(unit)) {
      return makePass(
        rule,
        quantityUnit,
        "Detected quantity uses an appropriate unit."
      );
    }

    return makeReview(
      rule,
      "The quantity unit cannot be confidently interpreted."
    );
  }

  // Fallback to netQuantity if quantityUnit wasn't extracted.
  if (!isDetected(value)) {
    return makeFail(rule);
  }

  const text = normalize(value);

  const quantityPattern =
    /\b\d+(?:\.\d+)?\s*(kg|g|gm|mg|l|lt|ltr|ml|m|cm|mm|nos|no|pcs|piece|pieces)\b/i;

  if (!quantityPattern.test(text)) {
    return makeReview(
      rule,
      "Quantity was detected, but the unit format requires manual verification."
    );
  }

  return makePass(
    rule,
    value,
    "Detected quantity uses an appropriate unit."
  );
}

function checkPrice(rule, value) {
  if (!isDetected(value)) {
    return makeFail(rule);
  }

  const text = String(value);

  // Look for a currency symbol or a numeric price.
  const hasPricePattern =
    /₹|\b(?:rs|inr)\.?\s*\d+|\d+(?:\.\d{1,2})?/i.test(text);

  if (!hasPricePattern) {
    return makeReview(
      rule,
      "A possible price value was detected, but it could not be confidently identified as the applicable MRP."
    );
  }

  return makePass(rule, value);
}

function checkUnitPrice(rule, value, productInfo) {
  // Unit sale price is required for applicable pre-packaged retail
  // commodities. Determine the expected unit from the net quantity.

  const quantityValue = parseFloat(productInfo.quantityValue);
  const quantityUnit = normalize(productInfo.quantityUnit);

  if (!Number.isFinite(quantityValue) || !quantityUnit) {
    return makeReview(
      rule,
      "Unit sale price applicability could not be determined because the net quantity or unit was not confidently extracted."
    );
  }

  let expectedUnit = null;

  // Weight
  if (["g", "gm", "gram", "grams"].includes(quantityUnit)) {
    expectedUnit = quantityValue < 1000 ? "g" : "kg";
  } else if (quantityUnit === "kg") {
    expectedUnit = quantityValue < 1 ? "g" : "kg";
  }

  // Volume
  else if (["ml", "millilitre", "milliliter"].includes(quantityUnit)) {
    expectedUnit = quantityValue < 1000 ? "ml" : "l";
  } else if (
    ["l", "lt", "ltr", "litre", "liter"].includes(quantityUnit)
  ) {
    expectedUnit = quantityValue < 1 ? "ml" : "l";
  }

  // Length
  else if (["cm"].includes(quantityUnit)) {
    expectedUnit = quantityValue < 100 ? "cm" : "m";
  } else if (quantityUnit === "m") {
    expectedUnit = quantityValue < 1 ? "cm" : "m";
  }

  // Items sold by number
  else if (
    ["no", "nos", "pcs", "piece", "pieces", "number"].includes(quantityUnit)
  ) {
    expectedUnit = "number";
  }

  if (!expectedUnit) {
    return makeReview(
      rule,
      `The quantity unit "${productInfo.quantityUnit}" could not be mapped to a unit sale price basis. Manual verification is recommended.`
    );
  }

  // If Gemini detected a unit sale price, verify that it contains
  // a recognizable price and the expected unit.
  if (isDetected(value)) {
    const text = normalize(value);

    const hasPrice =
      /₹|\brs\.?\b|\binr\b|\d+(?:\.\d{1,2})?/i.test(text);

    const normalizedText = text.replace(/\s+/g, " ");

    let hasExpectedUnit = false;

    if (expectedUnit === "number") {
      hasExpectedUnit =
        /\b(number|no\.?|nos\.?|piece|pieces|unit)\b/i.test(
          normalizedText
        );
    } else {
      hasExpectedUnit = new RegExp(
        `\\b${expectedUnit}\\b`,
        "i"
      ).test(normalizedText);
    }

    if (hasPrice && hasExpectedUnit) {
      return makePass(
        rule,
        value,
        `Unit sale price is declared on the expected basis of per ${expectedUnit}.`
      );
    }

    return makeReview(
      rule,
      `A unit sale price was detected, but its format could not be confidently verified against the expected basis of per ${expectedUnit}.`
    );
  }

  return makeReview(
    rule,
    `For a net quantity of ${productInfo.quantityValue} ${productInfo.quantityUnit}, the expected unit sale price basis is per ${expectedUnit}. No unit sale price was detected, so manual verification is recommended.`
  );
}

function checkVisual(rule, productInfo) {
  // In fallback mode, visual checks are not performed because
  // fallback analysis is based on OCR/text extraction only.
  if (productInfo.analysisMode === "fallback") {
    return makeReview(
      rule,
      `${rule.label} was not assessed in Basic Analysis Mode. AI-powered visual analysis is required for this check.`
    );
  }

  // AI mode: use the normal visual verification message.
  return makeReview(
    rule,
    rule.reviewCondition ||
      `${rule.label} requires visual verification of the package image and cannot be reliably determined from OCR alone.`
  );
}

function checkConditional(rule, value) {
  if (isDetected(value)) {
    return makePass(rule, value);
  }

  return makeReview(
    rule,
    rule.reviewCondition ||
      `${rule.label} may apply, but the available scan does not provide enough information for a definitive decision.`
  );
}

function checkScope(rule, productInfo) {
  const packageType = getPackageType(productInfo);
  const origin = getOrigin(productInfo);

  if (packageType === "retail") {
    return makePass(
      rule,
      "Within retail-package scope",
      "The uploaded item is being evaluated as a retail packaged commodity."
    );
  }

  if (packageType === "wholesale") {
    return makeReview(
      rule,
      "The package appears to be a wholesale package. Wholesale-specific applicability should be confirmed."
    );
  }

  if (packageType === "export") {
    return makeReview(
      rule,
      "The package appears to be intended for export. Its applicability to sale in India requires confirmation."
    );
  }

  if (packageType === "loose" || packageType === "open") {
    return makeReview(
      rule,
      "The package appears to be loose/open. Applicability of the Packaged Commodities Rules should be manually confirmed."
    );
  }

  if (origin === "unknown") {
    return makeReview(
      rule,
      "Product origin could not be confidently established from the available information."
    );
  }

  return makeReview(rule);
}

// =========================================================
// INDIVIDUAL RULE EVALUATION
// =========================================================

function evaluateRule(rule, productInfo) {
  const value = productInfo[rule.field];

  switch (rule.checkType) {
    case "presence":
      return checkPresence(rule, value, productInfo);

    case "quantity":
      return checkQuantity(rule, value, productInfo);

    case "unitFormat":
      return checkUnitFormat(rule, value, productInfo);

    case "price":
      return checkPrice(rule, value);

    case "unitPrice":
      return checkUnitPrice(rule, value, productInfo);

    case "visual":
      return checkVisual(rule, productInfo);

    case "conditional":
      return checkConditional(rule, value);

    case "scope":
      return checkScope(rule, productInfo);

    default:
      return makeReview(
        rule,
        `The rule "${rule.label}" requires manual verification because its check type is not yet automated.`
      );
  }
}
// =========================================================
// SCORE
// =========================================================

function calculateScore(checks) {
  if (checks.length === 0) {
    return 0;
  }

  const weights = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1,
  };

  let totalWeight = 0;
  let earnedWeight = 0;

  for (const check of checks) {
    const weight = weights[check.priority] || 1;

    totalWeight += weight;

    if (check.status === "pass") {
      earnedWeight += weight;
    } else if (check.status === "review") {
      // Review receives half credit because the system
      // cannot establish either compliance or non-compliance.
      earnedWeight += weight * 0.5;
    }
  }

  if (totalWeight === 0) {
    return 0;
  }

  return Math.round((earnedWeight / totalWeight) * 100);
}

// =========================================================
// MAIN COMPLIANCE FUNCTION
// =========================================================

function checkCompliance(productInfo) {
  console.log("\n======================================");
  console.log("LEGILABEL COMPLIANCE ENGINE");
  console.log("======================================");

  console.log("Product:", productInfo.productName);
  console.log("Analysis Mode:", productInfo.analysisMode);
  console.log("Category:", productInfo.productCategory);
  console.log("Origin:", getOrigin(productInfo));
  console.log("Package Type:", getPackageType(productInfo));
  console.log("Rules Loaded:", packagedCommodityRules.length);

  // -------------------------------------------------------
  // Determine which rules apply
  // -------------------------------------------------------

  const applicableRules = packagedCommodityRules.filter((rule) =>
    matchesCondition(rule, productInfo)
  );

  console.log(
    "Applicable Rules:",
    applicableRules.map((rule) => rule.id)
  );

  // -------------------------------------------------------
  // Evaluate applicable rules
  // -------------------------------------------------------

  const checks = applicableRules.map((rule) =>
    evaluateRule(rule, productInfo)
  );

  // -------------------------------------------------------
  // Count results
  // -------------------------------------------------------

  const passedChecks = checks.filter(
    (check) => check.status === "pass"
  );

  const failedChecks = checks.filter(
    (check) => check.status === "fail"
  );

  const reviewChecks = checks.filter(
    (check) => check.status === "review"
  );

  // -------------------------------------------------------
  // Overall status
  // -------------------------------------------------------

  let overallStatus = "Compliant";

  if (failedChecks.length > 0) {
    overallStatus = "Non-Compliant";
  } else if (reviewChecks.length > 0) {
    overallStatus = "Needs Review";
  }

  // -------------------------------------------------------
  // Score
  // -------------------------------------------------------

  const score = calculateScore(checks);

  console.log("Passed:", passedChecks.length);
  console.log("Failed:", failedChecks.length);
  console.log("Review:", reviewChecks.length);
  console.log("Score:", score);
  console.log("Overall:", overallStatus);

  console.log("======================================\n");

  return {
    overallStatus,
    score,

    summary: {
      total: checks.length,
      passed: passedChecks.length,
      failed: failedChecks.length,
      review: reviewChecks.length,
    },

    checks,
  };
}

module.exports = checkCompliance;