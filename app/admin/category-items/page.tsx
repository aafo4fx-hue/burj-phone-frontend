"use client";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { apiFetch } from "../../lib/api";

type SubCat = { name: string; category: string; count: number };
type Settings = { category: string; subCategory: string; showInHome: boolean; order: number };

export default function CategoryItemsPage() {
  const [items, setItems] = useState<SubCat[]>([]);
  const [settings, setSettings] = useState<Settings[]>([]);
  const [max, setMax] = useState(4);
  // FIX #5: store as string so the input can be empty while the user is typing
  const [maxInput, setMaxInput] = useState<string>("4");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  // FIX #7: separate error state so the user sees a message instead of eternal spinner
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    // FIX #1: AbortController — cancels in-flight requests on unmount
    const controller = new AbortController();
    const signal = controller.signal;

    setLoading(true);
    setFetchError(false);

    Promise.all([
      apiFetch("/api/admin/sub-categories", { credentials: "include", signal }).then((r) => r.json()),
      apiFetch("/api/admin/sub-categories/settings", { credentials: "include", signal }).then((r) => r.json()),
      apiFetch("/api/admin/sub-categories/settings/max", { credentials: "include", signal }).then((r) => r.json()),
    ])
      .then(([subs, sets, maxData]) => {
        if (signal.aborted) return; // component unmounted — skip stale setState
        setItems(Array.isArray(subs) ? subs : []);
        setSettings(Array.isArray(sets) ? sets : []);
        const m = maxData?.max ?? 4;
        setMax(m);
        setMaxInput(String(m));
        setLoading(false);
      })
      // FIX #2: catch fetch errors — prevent eternal loading spinner
      .catch((err) => {
        if (signal.aborted) return; // intentional unmount-cancel, not a real error
        console.error("[category-items] fetch error:", err);
        setLoading(false);
        setFetchError(true);
        toast.error("فشل تحميل البيانات، يرجى إعادة تحميل الصفحة");
      });

    // FIX #1 cont'd: cancel on unmount
    return () => controller.abort();
  }, []);

  async function handleSaveMax() {
    // FIX #6: guard against NaN / empty field before firing PATCH
    const parsed = parseInt(maxInput, 10);
    if (isNaN(parsed) || parsed < 1) return toast.error("الحد الأدنى 1");
    setSaving(true);
    try {
      const res = await apiFetch("/api/admin/sub-categories/settings/max", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ max: parsed }),
      });
      if (!res.ok) {
        toast.error("حدث خطأ أثناء الحفظ");
      } else {
        setMax(parsed);
        toast.success(`تم تحديث الحد إلى ${parsed} ✅`);
      }
    } catch {
      toast.error("تعذّر الاتصال بالخادم");
    } finally {
      setSaving(false);
    }
  }

  // FIX #4: build an O(1) lookup Map instead of O(n×m) .find() inside .map()
  const itemsMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of items) {
      map.set(`${item.category}||${item.name}`, item.count);
    }
    return map;
  }, [items]);

  // FIX #3: memoize the derived "visible" list — only recomputes when settings/items/max change
  const visible = useMemo(() => {
    return settings
      .filter((s) => s.showInHome && s.category !== "__config__")
      .sort((a, b) => a.order - b.order)
      // FIX #4 cont'd: O(1) Map lookup replaces O(n) .find()
      .map((s) => ({ ...s, count: itemsMap.get(`${s.category}||${s.subCategory}`) ?? 0 }));
  }, [settings, itemsMap]);

  // Derived — no extra state needed
  const parsedMaxInput = parseInt(maxInput, 10);
  const maxInputValid = !isNaN(parsedMaxInput) && parsedMaxInput >= 1;

  return (
    <div>
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">التصنيفات في الرئيسية</h1>
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            visible.length >= max ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-700"
          }`}
        >
          {visible.length}/{max}
        </span>
      </div>

      {/* Max control */}
      <div className="bg-white rounded-xl shadow p-4 mb-4 flex items-center gap-3 flex-wrap">
        <span className="text-sm text-gray-600 font-medium">الحد الأقصى للتصنيفات في الرئيسية:</span>
        <input
          type="number"
          min={1}
          max={20}
          value={maxInput}
          // FIX #5: keep raw string value — don't snap to 1 on empty/partial input
          onChange={(e) => setMaxInput(e.target.value)}
          className="w-20 border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSaveMax}
          disabled={saving || !maxInputValid || parsedMaxInput === max}
          className="bg-blue-600 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? "جاري الحفظ..." : "حفظ"}
        </button>
        {maxInputValid && visible.length > parsedMaxInput && (
          <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded px-2 py-1">
            ⚠️ يوجد {visible.length} تصنيف مختار، سيظهر أول {parsedMaxInput} فقط
          </span>
        )}
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right min-w-[500px]">
            <thead className="bg-gray-50 text-gray-600 font-semibold text-xs sm:text-sm">
              <tr>
                <th className="px-4 py-3">الترتيب</th>
                <th className="px-4 py-3">الاسم</th>
                <th className="px-4 py-3">النوع</th>
                <th className="px-4 py-3">عدد المنتجات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {/* FIX #7: show error row instead of eternal spinner */}
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-400 text-sm">
                    جاري التحميل...
                  </td>
                </tr>
              ) : fetchError ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-sm">
                    <span className="text-red-500 font-medium">⚠️ فشل تحميل البيانات</span>
                    <button
                      onClick={() => window.location.reload()}
                      className="mr-3 text-blue-600 underline text-xs"
                    >
                      إعادة المحاولة
                    </button>
                  </td>
                </tr>
              ) : visible.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-400 text-sm">
                    لا توجد تصنيفات معروضة في الرئيسية
                  </td>
                </tr>
              ) : (
                visible.map((s, i) => (
                  <tr
                    key={`${s.category}-${s.subCategory}`}
                    className={`hover:bg-gray-50 ${i >= max ? "opacity-40" : ""}`}
                  >
                    <td className="px-4 py-3 text-gray-400 font-medium text-xs sm:text-sm">
                      {i + 1}
                      {i >= max && <span className="mr-1 text-xs text-red-400">(مخفي)</span>}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800 text-xs sm:text-sm">{s.category}</td>
                    <td className="px-4 py-3 font-medium text-gray-800 text-xs sm:text-sm">{s.subCategory}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                          s.count > 0 ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {s.count} منتج
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
