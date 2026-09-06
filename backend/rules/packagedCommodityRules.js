const packagedCommodityRules = [
  // ---------------------------------------------------------
  // CORE PACKAGE DECLARATIONS
  // Legal Metrology (Packaged Commodities) Rules, 2011
  // ---------------------------------------------------------

  {
    id: "commodity-name",
    label: "Common / generic name of commodity",
    field: "productName",
    ruleReference: "Rule 6",
    type: "declaration",
    applicability: "general",
    description:
      "The common or generic name of the commodity should be declared."
  },

  {
    id: "manufacturer-packer-importer",
    label: "Manufacturer / packer / importer details",
    field: "manufacturer",
    ruleReference: "Rule 6",
    type: "declaration",
    applicability: "general",
    description:
      "Applicable manufacturer, packer or importer name and address details should be declared."
  },

  {
    id: "country-of-origin",
    label: "Country of origin",
    field: "countryOfOrigin",
    ruleReference: "Rule 6",
    type: "conditional",
    applicability: "imported",
    description:
      "Country of origin should be declared for imported packages where applicable."
  },

  {
    id: "net-quantity",
    label: "Net quantity",
    field: "netQuantity",
    ruleReference: "Rule 6",
    type: "declaration",
    applicability: "general",
    description:
      "Net quantity should be declared in the applicable unit of weight, measure or number."
  },

  {
    id: "manufacturing-packing-date",
    label: "Month / year of manufacture or packing",
    field: "date",
    ruleReference: "Rule 6",
    type: "declaration",
    applicability: "general",
    description:
      "Applicable manufacturing, packing or related date information should be declared."
  },

  {
    id: "best-before-use-by",
    label: "Best before / use by",
    field: "bestBefore",
    ruleReference: "Rule 6",
    type: "conditional",
    applicability: "where-applicable",
    description:
      "Best-before or use-by information should be declared where applicable under the Rules."
  },

  {
    id: "mrp",
    label: "Maximum Retail Price (MRP)",
    field: "mrp",
    ruleReference: "Rule 6",
    type: "declaration",
    applicability: "general",
    description:
      "The retail sale price / MRP should be declared in the applicable form."
  },

  {
    id: "consumer-care",
    label: "Consumer care details",
    field: "consumerCare",
    ruleReference: "Rule 6",
    type: "declaration",
    applicability: "general",
    description:
      "Consumer care / complaint contact information should be declared."
  },

  // ---------------------------------------------------------
  // CONDITIONAL DECLARATIONS
  // ---------------------------------------------------------

  {
    id: "unit-sale-price",
    label: "Unit sale price",
    field: "unitSalePrice",
    ruleReference: "Rule 6",
    type: "conditional",
    applicability: "where-applicable",
    description:
      "Unit sale price should be declared where required by the applicable provisions."
  },

  {
    id: "dimensions",
    label: "Dimensions",
    field: "dimensions",
    ruleReference: "Rule 6",
    type: "conditional",
    applicability: "where-applicable",
    description:
      "Dimensions should be declared where the Rules require them for the commodity/package."
  },

  // ---------------------------------------------------------
  // PACKAGE / CLASSIFICATION INFORMATION
  // These are inputs needed to determine which provisions apply.
  // ---------------------------------------------------------

  {
    id: "package-type",
    label: "Package type / classification",
    field: "packageType",
    ruleReference: "Rules 3-6 and applicable provisions",
    type: "classification",
    applicability: "general",
    description:
      "The package should be classified so that the applicable provisions can be determined."
  },

  {
    id: "standard-pack-size",
    label: "Standard pack size",
    field: "standardPackSize",
    ruleReference: "Rule 5 / Second Schedule",
    type: "conditional",
    applicability: "scheduled-commodity",
    description:
      "Where the commodity is covered by prescribed standard quantities, the package quantity should be checked against the applicable standard."
  },

  // ---------------------------------------------------------
  // PRESENTATION / DECLARATION FORMAT
  // ---------------------------------------------------------

  {
    id: "principal-display-panel",
    label: "Principal display panel",
    field: "principalDisplayPanel",
    ruleReference: "Rules 6-8",
    type: "visual",
    applicability: "where-applicable",
    description:
      "Required declarations should appear in the manner and location required by the Rules."
  },

  {
    id: "declaration-legibility",
    label: "Legibility of declarations",
    field: "declarationLegibility",
    ruleReference: "Rule 7",
    type: "visual",
    applicability: "general",
    description:
      "Required declarations should satisfy the applicable requirements concerning visibility and legibility."
  },

  {
    id: "declaration-size",
    label: "Minimum size of letters / numerals",
    field: "declarationSize",
    ruleReference: "Rule 7",
    type: "visual",
    applicability: "where-applicable",
    description:
      "Letters and numerals used for applicable declarations should satisfy the prescribed size requirements."
  },

  // ---------------------------------------------------------
  // SPECIAL PACKAGE CATEGORIES
  // ---------------------------------------------------------

  {
    id: "retail-package",
    label: "Retail package requirements",
    field: "isRetailPackage",
    ruleReference: "Rules 2 and 6",
    type: "classification",
    applicability: "retail-package",
    description:
      "Retail packages should be evaluated against the provisions applicable to retail packages."
  },

  {
    id: "wholesale-package",
    label: "Wholesale package requirements",
    field: "isWholesalePackage",
    ruleReference: "Rule 2 / applicable provisions",
    type: "conditional",
    applicability: "wholesale-package",
    description:
      "Wholesale packages should be evaluated against the provisions applicable to wholesale packages."
  },

  {
    id: "combination-package",
    label: "Combination / group package requirements",
    field: "isCombinationPackage",
    ruleReference: "Applicable package provisions",
    type: "conditional",
    applicability: "combination-package",
    description:
      "Combination or group packages should be evaluated against their applicable provisions."
  },

  // ---------------------------------------------------------
  // IMPORTED PACKAGES
  // ---------------------------------------------------------

  {
    id: "importer-details",
    label: "Importer details",
    field: "importer",
    ruleReference: "Rule 6",
    type: "conditional",
    applicability: "imported",
    description:
      "Applicable importer name and address details should be declared for imported packages."
  },

  // ---------------------------------------------------------
  // REVIEW / EXEMPTION HANDLING
  // ---------------------------------------------------------

  {
    id: "exemption-check",
    label: "Rule / exemption applicability",
    field: "exemption",
    ruleReference: "Rule 26 and applicable provisions",
    type: "review",
    applicability: "case-specific",
    description:
      "Applicable exemptions and special provisions must be considered before declaring a package compliant."
  }
];

module.exports = packagedCommodityRules;