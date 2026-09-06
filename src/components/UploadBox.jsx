import { useRef } from "react";
import { Camera, FileText, ImageUp, Upload } from "lucide-react";

export default function UploadBox({ file, previewUrl, onFileSelect }) {
  const imageInput = useRef(null);
  const pdfInput = useRef(null);
  const cameraInput = useRef(null);

  function handleChange(event) {
  const selected = event.target.files?.[0];

 if (selected) {
  alert(`Photo selected: ${selected.name}`);
  onFileSelect(selected);
}
}

  return (
    <div className="rounded-2xl border border-dashed border-brand/40 bg-gradient-to-b from-white to-brand-soft/60 p-6 shadow-sm sm:p-8">
      <div className="mx-auto flex max-w-xl flex-col items-center text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-white">
          <Upload size={24} />
        </div>
        <h2 className="text-xl font-semibold text-ink">Scan or Upload Product Label</h2>
        <p className="mt-2 text-sm text-muted">
          Upload a pack photo or PDF artwork. Analysis is mocked for this frontend demo.
        </p>

        {previewUrl ? (
          <div className="mt-6 w-full overflow-hidden rounded-xl border border-slate-200 bg-white">
            {file?.type === "application/pdf" ? (
              <div className="flex items-center gap-3 p-4 text-left">
                <FileText className="text-brand" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-xs text-muted">PDF selected — preview is demo-only</p>
                </div>
              </div>
            ) : (
              <img src={previewUrl} alt="Label preview" className="max-h-72 w-full object-contain bg-slate-50" />
            )}
          </div>
        ) : null}

        <div className="mt-6 grid w-full gap-3 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => imageInput.current?.click()}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium hover:border-brand"
          >
            <ImageUp size={16} />
            Upload Image
          </button>
          <button
            type="button"
            onClick={() => pdfInput.current?.click()}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium hover:border-brand"
          >
            <FileText size={16} />
            Upload PDF
          </button>
          <button
            type="button"
            onClick={() => cameraInput.current?.click()}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium hover:border-brand"
          >
            <Camera size={16} />
            Use Camera
          </button>
        </div>

        <input ref={imageInput} type="file" accept="image/*" className="hidden" onChange={handleChange} />
        <input ref={pdfInput} type="file" accept="application/pdf" className="hidden" onChange={handleChange} />
<input
  ref={cameraInput}
  type="file"
  accept="image/*"
  capture="environment"
  className="hidden"
  onChange={handleChange}
/>      </div>
    </div>
  );
}
