"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function Viewer() {
  const params = useSearchParams();
  const url = params.get("url");

  if (!url) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500 text-lg">
        لا يوجد ملف لعرضه
      </div>
    );
  }

  const proxyUrl = `/api/file-proxy?url=${encodeURIComponent(url)}`;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-gray-100 p-3 flex items-center justify-between border-b">
        <span className="text-sm text-gray-600">عرض الملف</span>
        <a
          href={proxyUrl}
          download
          className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 transition"
        >
          تحميل الملف
        </a>
      </div>
      <embed
        src={proxyUrl}
        type="application/pdf"
        className="flex-1 w-full"
        style={{ minHeight: "calc(100vh - 56px)" }}
      />
    </div>
  );
}

export default function ViewFilePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen text-gray-500">
          جاري التحميل...
        </div>
      }
    >
      <Viewer />
    </Suspense>
  );
}
