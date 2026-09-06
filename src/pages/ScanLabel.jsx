import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UploadBox from "../components/UploadBox";
import { useApp } from "../context/AppContext";
import { demoResult } from "../data/demoData";

export default function ScanLabel() {
  const navigate = useNavigate();
  const { uploadedFile, setUploadedFile, setLastResult, showToast } = useApp();

  const [previewUrl, setPreviewUrl] = useState("");
const [loading, setLoading] = useState(false);

const [productCategory, setProductCategory] = useState("");
const [productOrigin, setProductOrigin] = useState("");
  useEffect(() => {
    if (!uploadedFile || uploadedFile.type === "application/pdf") {
      setPreviewUrl("");
      return undefined;
    }
    const url = URL.createObjectURL(uploadedFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [uploadedFile]);


  async function analyze() {
  if (!uploadedFile) {
    showToast("Select an image or PDF first.");
    return;
  }

  setLoading(true);

  try {
    const formData = new FormData();
    formData.append("file", uploadedFile);

    const response = await fetch("http://localhost:5000/api/analyze", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Analysis failed");
    }

    setLastResult(data.result);
    navigate("/result");
  } catch (error) {
    console.error("Analysis error:", error);
    showToast("Could not analyze the file. Make sure the backend is running.");
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <UploadBox
  file={uploadedFile}
  previewUrl={previewUrl}
  onFileSelect={setUploadedFile}
/>


<div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
  <h2 className="text-base font-semibold text-slate-900">
    Product Information
  </h2>

  <p className="mt-1 text-sm text-muted">
    Select the information that helps determine which Legal Metrology
    requirements apply to this package.
  </p>

  <div className="mt-5 grid gap-5 md:grid-cols-2">
    {/* Product Category */}
    <div>
      <label
        htmlFor="product-category"
        className="text-sm font-medium text-slate-800"
      >
        Product Category
      </label>

      <select
        id="product-category"
        value={productCategory}
        onChange={(e) => setProductCategory(e.target.value)}
        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand"
      >
        <option value="">Select category</option>
        <option value="food">Food / Edible</option>
        <option value="cosmetic">Cosmetic / Personal Care</option>
        <option value="household">Household Product</option>
        <option value="electrical">Electrical / Battery</option>
        <option value="other">Other Packaged Commodity</option>
        <option value="unknown">Not Sure</option>
      </select>
    </div>

    {/* Product Origin */}
    <div>
      <label
        htmlFor="product-origin"
        className="text-sm font-medium text-slate-800"
      >
        Product Origin
      </label>

      <select
        id="product-origin"
        value={productOrigin}
        onChange={(e) => setProductOrigin(e.target.value)}
        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand"
      >
        <option value="">Select origin</option>
        <option value="india">Made / Packed in India</option>
        <option value="imported">Imported</option>
        <option value="unknown">Not Sure</option>
      </select>
    </div>
  </div>
</div>

<div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-muted">
  Analyze the uploaded package to extract label information and check
  applicable Legal Metrology requirements.
</p>
        <button
          type="button"
          onClick={analyze}
          disabled={loading}
          className="mt-4 rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-70"
        >
          {loading ? "Analyzing label..." : "Analyze Label"}
        </button>
        {loading ? (
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-2/3 animate-pulse rounded-full bg-brand" />
          </div>
        ) : null}
      </div>
    </div>
  );
}
