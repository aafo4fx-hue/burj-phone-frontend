"use client";
import { memo, useMemo } from "react";
import { imageFields, withCacheBust } from "../constants";
import type { CompanyData } from "../types";

interface CompanyImagesProps {
  data: CompanyData;
  onImageChange: (key: string, file: File) => void;
  onImageDelete: (key: string) => void;
}

// Single image slot — memoised so it only re-renders when its own url changes,
// not when an unrelated image field is updated.
const ImageField = memo(function ImageField({
  fieldKey,
  label,
  url,
  onImageChange,
  onImageDelete,
}: {
  fieldKey: string;
  label: string;
  url: string;
  onImageChange: (key: string, file: File) => void;
  onImageDelete: (key: string) => void;
}) {
  // Stable per-url bust — recalculated only when the url itself changes,
  // not on every parent render. Prevents the browser re-fetching the image
  // every time any state in the parent updates.
  const bustedUrl = useMemo(() => withCacheBust(url), [url]);

  return (
    <div>
      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">{label}</label>
      {url && (
        <div className="relative inline-block mb-2">
          <img src={bustedUrl} alt={label} className="h-14 object-contain rounded border" />
          <button
            type="button"
            onClick={() => onImageDelete(fieldKey)}
            className="absolute -top-2 -left-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs leading-none"
            title="حذف الصورة"
          >
            ×
          </button>
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && onImageChange(fieldKey, e.target.files[0])}
        className="w-full text-xs sm:text-sm text-gray-500 file:mr-2 file:py-1 file:px-2 sm:file:py-1.5 sm:file:px-3 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700"
      />
    </div>
  );
});

// Memoised: only re-renders when data or callback references change.
const CompanyImages = memo(function CompanyImages({
  data,
  onImageChange,
  onImageDelete,
}: CompanyImagesProps) {
  return (
    <div>
      <div className="flex items-start gap-1.5 text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 text-sm w-full mb-3">
        <span className="shrink-0">⚠️</span>
        <span>رفع الصورة قد يستغرق بضع ثوانٍ حسب حجمها وسرعة الإنترنت — لا تنسَ الضغط على حفظ بعد الانتهاء</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5">
        {imageFields.map(({ key, label }) => (
          <ImageField
            key={key}
            fieldKey={key}
            label={label}
            url={data[key] || ""}
            onImageChange={onImageChange}
            onImageDelete={onImageDelete}
          />
        ))}
      </div>
    </div>
  );
});

export default CompanyImages;
