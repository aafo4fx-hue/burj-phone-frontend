"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import type { Category } from "../types";

const BASE = "/api/admin/main-categories";

export function useMainCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [editCat, setEditCat] = useState<Category | null>(null);
  const [editName, setEditName] = useState("");
  const [editError, setEditError] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // ✅ FIX #2: track mounted state via ref so async callbacks never update
  // state after the component has been unmounted.
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // ── Fetch (with AbortController) ────────────────────────────────────────
  // ✅ FIX #2: AbortController cancels the in-flight request on unmount
  const fetchCategories = useCallback((signal?: AbortSignal) => {
    return fetch(`${BASE}/extra`, { credentials: "include", signal })
      .then(async (res) => {
        const data: Category[] = res.ok ? await res.json() : [];
        if (mountedRef.current) setCategories(data);
      })
      .catch((err) => {
        // Ignore AbortError — expected on unmount
        if (err instanceof Error && err.name === "AbortError") return;
        console.error("[main-categories] fetch error:", err);
      });
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchCategories(controller.signal);
    return () => controller.abort();
  }, [fetchCategories]);

  // ── Add ─────────────────────────────────────────────────────────────────
  // ✅ FIX #5: useCallback so the function reference is stable across renders
  const handleAdd = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }

      setShowModal(false);
      setName("");
      toast.success(`تم إضافة "${data.name}" بنجاح 🎉`);

      // ✅ FIX #6: optimistic update — append the new category immediately
      // without waiting for a full round-trip. Count starts at 0 (brand new).
      setCategories((prev) =>
        [...prev, { name: data.name, count: 0 }].sort((a, b) => a.name.localeCompare(b.name, "ar"))
      );
    } catch {
      toast.error("حدث خطأ في الاتصال");
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [name]);

  // ── Edit ────────────────────────────────────────────────────────────────
  // ✅ FIX #5: useCallback
  const handleEdit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCat) return;
    setEditError("");
    setEditLoading(true);
    const oldName = editCat.name;
    const oldCount = editCat.count;
    try {
      const res = await fetch(`${BASE}/rename`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ oldName, newName: editName }),
      });
      const data = await res.json();
      if (!res.ok) { setEditError(data.error); return; }

      setEditCat(null);
      toast.success("تم حفظ التعديلات بنجاح ✅");

      // ✅ FIX #6: optimistic rename — update local state immediately, keep count
      setCategories((prev) =>
        prev
          .map((c) => c.name === oldName ? { name: editName.trim(), count: oldCount } : c)
          .sort((a, b) => a.name.localeCompare(b.name, "ar"))
      );
    } catch {
      toast.error("حدث خطأ في الاتصال");
      // Fallback: re-fetch to ensure consistency
      fetchCategories();
    } finally {
      if (mountedRef.current) setEditLoading(false);
    }
  }, [editCat, editName, fetchCategories]);

  // ── Delete ──────────────────────────────────────────────────────────────
  // ✅ FIX #5: useCallback
  const confirmDeleteAction = useCallback(async () => {
    if (!confirmDelete) return;
    const catName = confirmDelete;
    setConfirmDelete(null);

    // ✅ FIX #6: optimistic remove — hide immediately before server confirms
    setCategories((prev) => prev.filter((c) => c.name !== catName));

    try {
      const res = await fetch(`${BASE}/remove`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: catName }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error);
        // Rollback: re-fetch to restore the item that failed to delete
        fetchCategories();
        return;
      }
      toast.success(`تم حذف "${catName}" بنجاح ✅`);
    } catch {
      toast.error("حدث خطأ في الاتصال");
      fetchCategories(); // Rollback
    }
  }, [confirmDelete, fetchCategories]);

  const filtered = categories.filter((c) => c.name.includes(search));

  return {
    categories, filtered, search, setSearch,
    showModal, setShowModal, name, setName, error, loading, handleAdd,
    editCat, setEditCat, editName, setEditName, editError, editLoading, handleEdit,
    confirmDelete, setConfirmDelete, confirmDeleteAction,
  };
}
