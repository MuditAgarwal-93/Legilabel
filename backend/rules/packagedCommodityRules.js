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

    passCondition:
      "Required manufacturer/packer/importer details are detected.",

    failCondition:
      "Required manufacturer/packer/importer details are missing.",

    reviewCondition:
      "Some details are detected but their completeness cannot be confidently determined.",

    priority: "high",

    fixGuidance: {
      issue:
        "Required manufacturer, packer or importer details are missing or incomplete.",
      action:
        "Provide the applicable name and address declaration for the manufacturer, packer or importer.",
      reference:
        "Rule 6(1)(a), Rule 10"
    }
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

    passCondition:
      "A recognizable common/generic product name is detected.",

    failCondition:
      "No recognizable product name is detected.",

    reviewCondition:
      "Text is detected but product identity is uncertain.",

    priority: "high",

    fixGuidance: {
      issue:
        "Common / Generic Product Name is missing or could not be identified.",
      action:
        "Add the common or generic name of the commodity clearly on the package.",
      reference:
        "Rule 6(1)(b)"
    }
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

    passCondition:
      "Net quantity and an appropriate unit are detected.",

    failCondition:
      "Net quantity is missing.",

    reviewCondition:
      "Quantity is detected but the unit or applicable quantity format is uncertain.",

    priority: "high",

    fixGuidance: {
      issue:
        "Net quantity is missing or could not be reliably verified.",
      action:
        "Declare the net quantity of the commodity using the applicable quantity unit and format.",
      reference:
        "Rule 6(1)(c), Rules 12–13"
    }
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

    passCondition:
      "A valid applicable month/year declaration is detected.",

    failCondition:
      "No applicable month/year declaration is detected.",

    reviewCondition:
      "A date is detected but its meaning or format is uncertain.",

    priority: "high",

    fixGuidance: {
      issue:
        "The applicable month / year declaration is missing or could not be identified.",
      action:
        "Provide the applicable month and year declaration on the package.",
      reference:
        "Rule 6(1)(d)"
    }
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

    passCondition:
      "MRP/retail sale price is detected.",

    failCondition:
      "MRP/retail sale price is missing.",

    reviewCondition:
      "A price is detected but it cannot confidently be identified as the applicable MRP.",

    priority: "high",

    fixGuidance: {
      issue:
        "The applicable Maximum Retail Price could not be identified.",
      action:
        "Declare the applicable retail sale price / MRP clearly on the package.",
      reference:
        "Rule 6(1)(e)"
    }
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

    passCondition:
      "Consumer care/contact information is detected.",

    failCondition:
      "Consumer care/contact information is not detected.",

    reviewCondition:
      "Possible contact information is detected but its purpose cannot be confirmed.",

    priority: "medium",

    fixGuidance: {
      issue:
        "Required consumer care / contact information is missing or could not be identified.",
      action:
        "Provide the applicable consumer complaint or contact details required for the package.",
      reference:
        "Rule 6(2)"
    }
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

    passCondition:
      "Country of origin is detected.",

    failCondition:
      "Country of origin is missing.",

    reviewCondition:
      "A possible origin declaration is detected but cannot be confidently interpreted.",

    priority: "high",

    fixGuidance: {
      issue:
        "Country of origin is missing or could not be identified for the imported package.",
      action:
        "Declare the country of origin clearly on the imported package.",
      reference:
        "Applicable imported-package declaration"
    }
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

    passCondition:
      "Applicable unit sale price is detected with a compatible unit.",

    failCondition:
      "Applicable unit sale price is missing.",

    reviewCondition:
      "A unit price appears present but its unit or applicability cannot be confidently determined.",

    priority: "high",

    fixGuidance: {
      issue:
        "Applicable unit sale price is missing or could not be reliably verified.",
      action:
        "Provide the applicable unit sale price using the prescribed quantity basis.",
      reference:
        "Rule 6(11)"
    }
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

    passCondition:
      "Detected quantity uses an appropriate unit.",

    failCondition:
      "Detected quantity uses an inappropriate or unsupported unit.",

    reviewCondition:
      "The quantity unit cannot be confidently interpreted.",

    priority: "medium",

    fixGuidance: {
      issue:
        "The quantity unit could not be confidently verified.",
      action:
        "Use the applicable permitted unit and an appropriate quantity format for the declared quantity.",
      reference:
        "Rules 11–13"
    }
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

    passCondition:
      "Required declarations appear to be appropriately positioned and displayed.",

    failCondition:
      "A required declaration is clearly absent from the applicable display area.",

    reviewCondition:
      "The image is insufficient to reliably assess principal display panel requirements.",

    priority: "medium",

    fixGuidance: {
      issue:
        "Principal Display Panel requirements could not be reliably verified.",
      action:
        "Ensure the applicable required declarations are displayed in the prescribed manner on the principal display panel.",
      reference:
        "Rules 7–9"
    }
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

    passCondition:
      "Declarations appear legible and prominent.",

    failCondition:
      "Required declaration is visibly illegible.",

    reviewCondition:
      "Image quality or resolution prevents reliable assessment.",

    priority: "medium",

    fixGuidance: {
      issue:
        "Required declaration legibility could not be reliably verified.",
      action:
        "Ensure required declarations are clearly legible and sufficiently prominent on the package.",
      reference:
        "Rules 7–9"
    }
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

    passCondition:
      "Applicable garment-specific declarations are detected.",

    failCondition:
      "A required applicable garment declaration is missing.",

    reviewCondition:
      "The product is identified as a garment but applicability or required details cannot be confidently established.",

    priority: "high",

    fixGuidance: {
      issue:
        "Applicable garment / hosiery declarations could not be established.",
      action:
        "Verify and provide the applicable garment-specific declarations required for the product.",
      reference:
        "Rule 26(f)"
    }
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

    passCondition:
      "Applicable QR-based information is available or appropriately declared.",

    failCondition:
      "A required applicable declaration is absent.",

    reviewCondition:
      "QR presence or the information available through it cannot be reliably assessed from the scan.",

    priority: "medium",

    fixGuidance: {
      issue:
        "Applicable electronic-product QR information could not be reliably verified.",
      action:
        "Verify that the applicable QR-based information is available or appropriately declared.",
      reference:
        "Electronic-product QR provisions"
    }
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

    passCondition:
      "Applicable wholesale declarations are detected.",

    failCondition:
      "A required wholesale declaration is missing.",

    reviewCondition:
      "The package type or required wholesale information cannot be confidently determined.",

    priority: "high",

    fixGuidance: {
      issue:
        "Applicable wholesale package declarations could not be established.",
      action:
        "Verify and provide the applicable declarations required for the wholesale package.",
      reference:
        "Rule 24"
    }
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

    passCondition:
      "Applicable export-package conditions are satisfied.",

    failCondition:
      "The package is identified as non-compliant for the intended Indian sale.",

    reviewCondition:
      "The package's intended market or repacking/relabeling status cannot be established from the image.",

    priority: "medium",

    fixGuidance: {
      issue:
        "The export package conditions could not be established from the available information.",
      action:
        "Verify the intended market and applicable export-package conditions before sale in India.",
      reference:
        "Rule 25"
    }
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

    passCondition:
      "Package is within the scope of the applicable rules.",

    failCondition:
      "Package is clearly outside the applicable scope.",

    reviewCondition:
      "Scope or exemption cannot be determined from available information.",

    priority: "critical",

    fixGuidance: {
      issue:
        "The applicability or exemption status of the package could not be determined.",
      action:
        "Verify the package type, intended use and applicable exemption conditions before making a final compliance determination.",
      reference:
        "Rule 3, Rule 26"
    }
  }

];

module.exports = packagedCommodityRules;