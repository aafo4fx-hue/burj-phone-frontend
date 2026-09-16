"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useCompanyStore } from "../../../store/companyStore";
import { API, defaultData, toFullUrl, withCacheBust } from "../constants";
import type { CompanyData } from "../types";

// Image keys that need URL normalisation on load.
const IMAGE_KEYS = new Set(["logo", "header", "footer", "stamp", "cancelStamp"]);

export function useCompany() {
  const { setLogo } = useCompanyStore();
  const [data, setData] = useState<CompanyData>(defaultData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Track the last-saved snapshot so handleSave only sends changed fields.
  const savedRef = useRef<CompanyData>(defaultData);

  // Mirror of data state kept in a ref so handleSave can read the current
  // value without being listed as a dependency (avoids recreating it on every keystroke).
  const dataRef = useRef<CompanyData>(defaultData);

  useEffect(() => {
    fetch(`/api/admin/company`, { credentials: "include" })
      .then((r) => r.json())
      .then((res) => {
        const merged: CompanyData = { ...defaultData };
        for (const k of Object.keys(defaultData)) {
          if (res[k] !== undefined && res[k] !== "") {
            merged[k] = IMAGE_KEYS.has(k) ? toFullUrl(res[k]) : res[k];
          }
        }
        setData(merged);
        dataRef.current = merged;
        savedRef.current = merged;
      })
      .catch(() => toast.error("فشل تحميل بيانات الشركة"))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = useCallback((key: string, value: string) => {
    setData((prev) => {
      const next = { ...prev, [key]: value };
      dataRef.current = next;
      return next;
    });
  }, []);

  const handleImageChange = useCallback(async (key: string, file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch(`/api/admin/company/upload/${key}`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) { toast.error(json.error || "فشل رفع الصورة"); return; }
      const fullUrl = json.url.startsWith("http") ? json.url : `${API}${json.url}`;
      setData((prev) => {
        const next = { ...prev, [key]: fullUrl };
        dataRef.current = next;
        return next;
      });
      // Keep savedRef in sync so the image URL isn't treated as a dirty field.
      savedRef.current = { ...savedRef.current, [key]: fullUrl };
      if (key === "logo") { setLogo(withCacheBust(fullUrl)); }
      toast.success("تم رفع الصورة");
    } catch (e) {
      console.error(e);
      toast.error("فشل رفع الصورة");
    }
  }, [setLogo]);

  const handleImageDelete = useCallback(async (key: string) => {
    try {
      const res = await fetch(`/api/admin/company/image/${key}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) { toast.error("فشل حذف الصورة"); return; }
      setData((prev) => {
        const next = { ...prev, [key]: "" };
        dataRef.current = next;
        return next;
      });
      savedRef.current = { ...savedRef.current, [key]: "" };
      if (key === "logo") setLogo("");
      toast.success("تم حذف الصورة");
    } catch {
      toast.error("فشل حذف الصورة");
    }
  }, [setLogo]);

  const handleSave = useCallback(async () => {
    // Read the latest data from the ref (stable, no stale closure).
    const current = dataRef.current;
    const saved = savedRef.current;
    const diff: Partial<CompanyData> = {};
    for (const k of Object.keys(current)) {
      if (current[k] !== saved[k]) diff[k] = current[k];
    }

    if (Object.keys(diff).length === 0) {
      toast("لا توجد تغييرات للحفظ", { icon: "ℹ️" });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/company`, {
        method: "PUT",
        credentials: "include",          // ✅ was missing — auth cookie must be forwarded
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(diff),       // ✅ only changed fields, not the whole object
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "فشل الحفظ");
      }
      // Update snapshot so future saves diff against the new state.
      savedRef.current = { ...saved, ...diff } as CompanyData;
      toast.success("تم حفظ بيانات الشركة");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "فشل الحفظ");
    } finally {
      setSaving(false);
    }
  }, []);

  return { data, loading, saving, handleChange, handleImageChange, handleImageDelete, handleSave };
}
