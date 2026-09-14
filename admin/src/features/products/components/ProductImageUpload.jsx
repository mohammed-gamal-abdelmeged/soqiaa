// src/features/products/components/ProductImageUpload.jsx

import { ImagePlus, Upload } from "lucide-react";

export default function ProductImageUpload({
  image,
  onChange,
  error,
}) {
  const handleChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      onChange({
        file: null,
        preview: "",
        error: "من فضلك اختر صورة صحيحة",
      });

      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      onChange({
        file,
        preview: reader.result,
        error: "",
      });
    };

    reader.readAsDataURL(file);
  };

  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-slate-700">
        صورة المنتج
      </p>

      <label
        className={[
          "flex min-h-[230px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-5 text-center transition hover:bg-slate-50",
          error
            ? "border-red-300"
            : "border-slate-200",
        ].join(" ")}
      >
        {image ? (
          <>
            <img
              src={image}
              alt="معاينة المنتج"
              className="h-40 w-40 rounded-2xl border border-slate-200 object-cover"
            />

            <p className="mt-4 text-sm font-semibold text-emerald-700">
              تغيير الصورة
            </p>
          </>
        ) : (
          <>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <Upload size={25} />
            </div>

            <p className="mt-4 text-sm font-semibold text-slate-700">
              اختر صورة المنتج
            </p>

            <p className="mt-1 text-xs text-slate-400">
              PNG أو JPG أو WEBP
            </p>
          </>
        )}

        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleChange}
          className="hidden"
        />
      </label>

      {error && (
        <p className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}