const packagedCommodityRules = [

  // =========================================================
  // CORE DECLARATIONS — RULE 6
  // =========================================================

  {
    id: "LM-001",
    ruleReference: "Rule 6(1)(a), Rule 10",
    label: "Manufacturer / Packer / Importer Details",

    category: ["all"],

    conditions: {
      packageType: ["retail"],
      origin: ["india", "imported"]
    },

    field: "manufacturer",
    checkType: "presence",

    description:
      "The package should declare the applicable manufacturer, packer or importer name and address.",

    passCondition: "Required manufacturer/packer/importer details are detected.",
    failCondition: "Required manufacturer/packer/importer details are missing.",
    reviewCondition: "Some details are detected but their completeness cannot be confidently determined.",

    priority: "high"
  },


  {
    id: "LM-002",
    ruleReference: "Rule 6(1)(b)",
    label: "Common / Generic Product Name",

    category: ["all"],

    conditions: {
      packageType: ["retail"]
    },

    field: "productName",
    checkType: "presence",

    description:
      "The package should declare the common or generic name of the commodity.",

    passCondition: "A recognizable common/generic product name is detected.",
    failCondition: "No recognizable product name is detected.",
    reviewCondition: "Text is detected but product identity is uncertain.",

    priority: "high"
  },


  {
    id: "LM-003",
    ruleReference: "Rule 6(1)(c), Rules 12–13",
    label: "Net Quantity",

    category: ["all"],

    conditions: {
      packageType: ["retail"]
    },

    field: "netQuantity",
    checkType: "quantity",

    description:
      "The package should declare the net quantity using the appropriate unit and quantity format.",

    passCondition: "Net quantity and an appropriate unit are detected.",
    failCondition: "Net quantity is missing.",
    reviewCondition: "Quantity is detected but the unit or applicable quantity format is uncertain.",

    priority: "high"
  },


  {
    id: "LM-004",
    ruleReference: "Rule 6(1)(d)",
    label: "Month / Year of Manufacture, Packing or Import",

    category: ["all"],

    conditions: {
      packageType: ["retail"]
    },

    field: "date",
    checkType: "presence",

    description:
      "The applicable month and year declaration should be present on the package.",

    passCondition: "A valid applicable month/year declaration is detected.",
    failCondition: "No applicable month/year declaration is detected.",
    reviewCondition: "A date is detected but its meaning or format is uncertain.",

    priority: "high"
  },


  {
    id: "LM-005",
    ruleReference: "Rule 6(1)(e)",
    label: "Maximum Retail Price",

    category: ["all"],

    conditions: {
      packageType: ["retail"]
    },

    field: "mrp",
    checkType: "price",

    description:
      "The retail package should declare the applicable retail sale price.",

    passCondition: "MRP/retail sale price is detected.",
    failCondition: "MRP/retail sale price is missing.",
    reviewCondition: "A price is detected but it cannot confidently be identified as the applicable MRP.",

    priority: "high"
  },


  {
    id: "LM-006",
    ruleReference: "Rule 6(2)",
    label: "Consumer Care Details",

    category: ["all"],

    conditions: {
      packageType: ["retail"]
    },

    field: "consumerCare",
    checkType: "presence",

    description:
      "The package should provide the required consumer complaint/contact details.",

    passCondition: "Consumer care/contact information is detected.",
    failCondition: "Consumer care/contact information is not detected.",
    reviewCondition: "Possible contact information is detected but its purpose cannot be confirmed.",

    priority: "medium"
  },


  // =========================================================
  // COUNTRY OF ORIGIN
  // =========================================================

  {
    id: "LM-007",
    ruleReference: "Applicable imported-package declaration",
    label: "Country of Origin",

    category: ["all"],

    conditions: {
      origin: ["imported"],
      packageType: ["retail"]
    },

    field: "countryOfOrigin",
    checkType: "presence",

    description:
      "Imported retail packages should declare the country of origin.",

    passCondition: "Country of origin is detected.",
    failCondition: "Country of origin is missing.",
    reviewCondition: "A possible origin declaration is detected but cannot be confidently interpreted.",

    priority: "high"
  },


  // =========================================================
  // UNIT SALE PRICE
  // =========================================================

  {
    id: "LM-008",
    ruleReference: "Rule 6(11)",
    label: "Unit Sale Price",

    category: ["all"],

    conditions: {
      packageType: ["retail"]
    },

    field: "unitSalePrice",
    checkType: "unitPrice",

    description:
      "Where applicable, the package should declare the unit sale price using the prescribed unit based on the commodity's quantity.",

    passCondition: "Applicable unit sale price is detected with a compatible unit.",
    failCondition: "Applicable unit sale price is missing.",
    reviewCondition: "A unit price appears present but its unit or applicability cannot be confidently determined.",

    priority: "high"
  },


  // =========================================================
  // QUANTITY FORMAT
  // =========================================================

  {
    id: "LM-009",
    ruleReference: "Rules 11–13",
    label: "Quantity Unit Format",

    category: ["all"],

    conditions: {
      packageType: ["retail"]
    },

    field: "netQuantity",
    checkType: "unitFormat",

    description:
      "The quantity declaration should use the appropriate permitted unit and represent the quantity supplied to the consumer.",

    passCondition: "Detected quantity uses an appropriate unit.",
    failCondition: "Detected quantity uses an inappropriate or unsupported unit.",
    reviewCondition: "The quantity unit cannot be confidently interpreted.",

    priority: "medium"
  },


  // =========================================================
  // PRINCIPAL DISPLAY PANEL
  // =========================================================

  {
    id: "LM-010",
    ruleReference: "Rules 7–9",
    label: "Principal Display Panel",

    category: ["all"],

    conditions: {
      packageType: ["retail"]
    },

    field: "image",
    checkType: "visual",

    description:
      "Required declarations should be displayed in the prescribed manner on the principal display panel.",

    passCondition: "Required declarations appear to be appropriately positioned and displayed.",
    failCondition: "A required declaration is clearly absent from the applicable display area.",
    reviewCondition: "The image is insufficient to reliably assess principal display panel requirements.",

    priority: "medium"
  },


  {
    id: "LM-011",
    ruleReference: "Rules 7–9",
    label: "Declaration Legibility",

    category: ["all"],

    conditions: {
      packageType: ["retail"]
    },

    field: "image",
    checkType: "visual",

    description:
      "Required declarations should be legible and sufficiently prominent.",

    passCondition: "Declarations appear legible and prominent.",
    failCondition: "Required declaration is visibly illegible.",
    reviewCondition: "Image quality or resolution prevents reliable assessment.",

    priority: "medium"
  },


  // =========================================================
  // SPECIAL CATEGORY — GARMENTS / HOSIERY
  // =========================================================

  {
    id: "LM-012",
    ruleReference: "Rule 26(f)",
    label: "Garment / Hosiery Special Declarations",

    category: ["textile", "garment"],

    conditions: {
      packageType: ["loose", "open", "retail"]
    },

    field: "garmentDetails",
    checkType: "conditional",

    description:
      "Certain garments and hosiery articles have additional declaration requirements.",

    passCondition: "Applicable garment-specific declarations are detected.",
    failCondition: "A required applicable garment declaration is missing.",
    reviewCondition: "The product is identified as a garment but applicability or required details cannot be confidently established.",

    priority: "high"
  },


  // =========================================================
  // ELECTRONIC PRODUCTS — QR INFORMATION
  // =========================================================

  {
    id: "LM-013",
    ruleReference: "Electronic-product QR provisions",
    label: "Electronic Product QR Information",

    category: ["electronic"],

    conditions: {
      packageType: ["retail"]
    },

    field: "qrCode",
    checkType: "conditional",

    description:
      "Where the applicable electronic-product provisions permit information to be provided through a QR code, the system should identify the QR code and treat the associated information appropriately.",

    passCondition: "Applicable QR-based information is available or appropriately declared.",
    failCondition: "A required applicable declaration is absent.",
    reviewCondition: "QR presence or the information available through it cannot be reliably assessed from the scan.",

    priority: "medium"
  },


  // =========================================================
  // WHOLESALE PACKAGES
  // =========================================================

  {
    id: "LM-014",
    ruleReference: "Rule 24",
    label: "Wholesale Package Declarations",

    category: ["all"],

    conditions: {
      packageType: ["wholesale"]
    },

    field: "wholesaleDetails",
    checkType: "conditional",

    description:
      "Wholesale packages have their own applicable declaration requirements.",

    passCondition: "Applicable wholesale declarations are detected.",
    failCondition: "A required wholesale declaration is missing.",
    reviewCondition: "The package type or required wholesale information cannot be confidently determined.",

    priority: "high"
  },


  // =========================================================
  // EXPORT PACKAGES
  // =========================================================

  {
    id: "LM-015",
    ruleReference: "Rule 25",
    label: "Export Package",

    category: ["all"],

    conditions: {
      packageType: ["export"]
    },

    field: "exportDetails",
    checkType: "conditional",

    description:
      "Export packages have specific treatment under the rules, particularly if subsequently sold in India.",

    passCondition: "Applicable export-package conditions are satisfied.",
    failCondition: "The package is identified as non-compliant for the intended Indian sale.",
    reviewCondition: "The package's intended market or repacking/relabeling status cannot be established from the image.",

    priority: "medium"
  },


  // =========================================================
  // SCOPE / EXEMPTION
  // =========================================================

  {
    id: "LM-016",
    ruleReference: "Rule 3, Rule 26",
    label: "Applicability / Exemption Check",

    category: ["all"],

    conditions: {
      packageType: ["unknown", "retail", "wholesale", "export", "loose", "open"]
    },

    field: "scope",
    checkType: "scope",

    description:
      "The system should determine whether the Packaged Commodities Rules apply before evaluating all declarations.",

    passCondition: "Package is within the scope of the applicable rules.",
    failCondition: "Package is clearly outside the applicable scope.",
    reviewCondition: "Scope or exemption cannot be determined from available information.",

    priority: "critical"
  }

];

module.exports = packagedCommodityRules;