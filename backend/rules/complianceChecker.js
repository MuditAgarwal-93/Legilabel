const packagedCommodityRules = require("./packagedCommodityRules");

function checkCompliance(productInfo) {
  const checks = packagedCommodityRules.map((rule) => {
    const value = productInfo[rule.field];

    const detected =
      value &&
      value.trim() !== "" &&
      value.toLowerCase() !== "not detected";

    let status = "pass";
    let detail = `${rule.label} was detected.`;

    if (!detected) {
      if (rule.required) {
        status = "fail";
        detail = `${rule.label} was not detected on the uploaded label.`;
      } else {
        status = "review";
        detail = `${rule.label} was not detected. Applicability should be verified.`;
      }
    }

    return {
      id: rule.id,
      label: rule.label,
      status,
      detail,
      value: detected ? value : "Not detected",
    };
  });

  const failedChecks = checks.filter((check) => check.status === "fail");
  const reviewChecks = checks.filter((check) => check.status === "review");

  let overallStatus = "Compliant";

  if (failedChecks.length > 0) {
    overallStatus = "Non-Compliant";
  } else if (reviewChecks.length > 0) {
    overallStatus = "Needs Review";
  }

  return {
    overallStatus,
    checks,
  };
}

module.exports = checkCompliance;