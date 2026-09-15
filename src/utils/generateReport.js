export function generateReport(lastResult, showToast) {
  const reportWindow = window.open("", "_blank");

  if (!reportWindow) {
    showToast("Please allow pop-ups to generate the report.");
    return;
  }

  const productName = lastResult.productName || "Not detected";
  const status = lastResult.status || "Needs Review";
  const score =
    typeof lastResult.score === "number"
      ? `${lastResult.score}%`
      : "Not available";

  reportWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>LegiLabel Inspection Report</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 40px;
            color: #1e293b;
            line-height: 1.5;
          }

          h1 {
            margin-bottom: 5px;
          }

          h2 {
            margin-top: 30px;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 8px;
          }

          .header {
            border-bottom: 3px solid #334155;
            padding-bottom: 15px;
          }

          .summary {
            display: flex;
            gap: 30px;
            margin-top: 20px;
          }

          .card {
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            padding: 15px;
            flex: 1;
          }

          .label {
            font-size: 12px;
            color: #64748b;
            text-transform: uppercase;
          }

          .value {
            font-size: 20px;
            font-weight: bold;
            margin-top: 5px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
          }

          th,
          td {
            border: 1px solid #cbd5e1;
            padding: 9px;
            text-align: left;
            vertical-align: top;
          }

          th {
            background: #f1f5f9;
          }

          .pass {
            color: #047857;
            font-weight: bold;
          }

          .fail {
            color: #dc2626;
            font-weight: bold;
          }

          .review {
            color: #b45309;
            font-weight: bold;
          }

          .footer {
            margin-top: 40px;
            padding-top: 15px;
            border-top: 1px solid #cbd5e1;
            font-size: 12px;
            color: #64748b;
          }

          @media print {
            body {
              margin: 20px;
            }
          }
        </style>
      </head>

      <body>
        <div class="header">
          <h1>LegiLabel</h1>
          <p>Packaged Commodity Compliance Inspection Report</p>
        </div>

        <div class="summary">
          <div class="card">
            <div class="label">Product</div>
            <div class="value">${productName}</div>
          </div>

          <div class="card">
            <div class="label">Assessment Score</div>
            <div class="value">${score}</div>
          </div>

          <div class="card">
            <div class="label">Overall Status</div>
            <div class="value">${status}</div>
          </div>
        </div>

        <h2>Extracted Label Information</h2>

        <table>
          <thead>
            <tr>
              <th>Field</th>
              <th>Detected Information</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Product Name</td>
              <td>${lastResult.productName || "Not detected"}</td>
            </tr>

            <tr>
              <td>Manufacturer</td>
              <td>${lastResult.manufacturer || "Not detected"}</td>
            </tr>

            <tr>
              <td>Packed By</td>
              <td>${lastResult.packedBy || "Not detected"}</td>
            </tr>

            <tr>
              <td>Marketed By</td>
              <td>${lastResult.marketedBy || "Not detected"}</td>
            </tr>

            <tr>
              <td>Net Quantity</td>
              <td>${lastResult.netQuantity || "Not detected"}</td>
            </tr>

            <tr>
              <td>MRP</td>
              <td>${lastResult.mrp || "Not detected"}</td>
            </tr>

            <tr>
              <td>Manufacturing Date</td>
              <td>${lastResult.date || "Not detected"}</td>
            </tr>

            <tr>
              <td>Best Before / Use By</td>
              <td>${lastResult.bestBefore || "Not detected"}</td>
            </tr>

            <tr>
              <td>Batch Number</td>
              <td>${lastResult.batchNumber || "Not detected"}</td>
            </tr>

            <tr>
              <td>Consumer Care</td>
              <td>${lastResult.consumerCare || "Not detected"}</td>
            </tr>

            <tr>
              <td>Country of Origin</td>
              <td>${lastResult.countryOfOrigin || "Not detected"}</td>
            </tr>

            <tr>
              <td>Importer</td>
              <td>${lastResult.importer || "Not detected"}</td>
            </tr>
          </tbody>
        </table>

        <h2>Compliance Checks</h2>

        <table>
          <thead>
            <tr>
              <th>Rule</th>
              <th>Requirement</th>
              <th>Status</th>
              <th>Detected Value</th>
              <th>Legal Reference</th>
            </tr>
          </thead>

          <tbody>
            ${
              lastResult.checks
                ? lastResult.checks
                    .map(
                      (check) => `
                        <tr>
                          <td>${check.id}</td>
                          <td>${check.label}</td>
                          <td class="${check.status}">
                            ${check.status.toUpperCase()}
                          </td>
                          <td>${check.value || "Not detected"}</td>
                          <td>${check.ruleReference || "Not specified"}</td>
                        </tr>
                      `
                    )
                    .join("")
                : ""
            }
          </tbody>
        </table>

        <h2>Decision Source</h2>

        <p>
          Compliance decisions in this report are generated by the
          <strong>Deterministic Legal Rule Engine</strong>.
        </p>

        <p>
          AI-assisted extraction is used only to identify information and
          visual evidence from the uploaded label. It does not create,
          modify, override, or decide the legal rules.
        </p>

        <div class="footer">
          <p>
            LegiLabel — Packaged Commodity Compliance Inspection System
          </p>

          <p>
            Demo assessment only. Final legal compliance should be verified
            against applicable regulations.
          </p>
        </div>
      </body>
    </html>
  `);

  reportWindow.document.close();

  reportWindow.onload = () => {
    reportWindow.print();
  };
}