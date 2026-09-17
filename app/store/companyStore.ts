import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Cache TTL: 1 hour — company data rarely changes.
const COMPANY_TTL_MS = 60 * 60 * 1000;

interface CompanyStore {
  logo: string;
  nameAr: string;
  nameEn: string;
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  details: string;
  /** Timestamp of the last successful fetch (ms). 0 = never fetched. */
  lastFetched: number;
  fetchCompany: () => Promise<void>;
  setLogo: (url: string) => void;
}

export const useCompanyStore = create<CompanyStore>()(
  persist(
    (set, get) => ({
      logo: "",
      nameAr: "",
      nameEn: "",
      phone: "",
      whatsapp: "",
      email: "",
      website: "",
      details: "",
      lastFetched: 0,

      fetchCompany: async () => {
        // Skip fetch if data was loaded within the TTL window.
        const { lastFetched } = get();
        if (lastFetched && Date.now() - lastFetched < COMPANY_TTL_MS) return;

        try {
          // Uses /api/company/public — a cookie-free endpoint with route-level
          // revalidate:3600 so the Vercel Function is NOT invoked on cache hits.
          // The previous /api/admin/company used forwardCookies which prevented
          // Next.js Data Cache from activating.
          const res = await fetch(`/api/company/public`);
          if (!res.ok) return;
          const text = await res.text();
          if (!text) return;
          const data = JSON.parse(text);
          const fullLogo = data.logo
            ? data.logo.startsWith("http")
              ? data.logo
              : `${API}${data.logo}`
            : "";
          set({
            logo: fullLogo,
            nameAr: data.nameAr || "",
            nameEn: data.nameEn || "",
            phone: data.phone || "",
            whatsapp: data.whatsapp || "",
            email: data.email || "",
            website: data.website || "",
            details: data.details || "",
            lastFetched: Date.now(),
          });
        } catch {
          // Silently ignore fetch errors — store retains last known values.
        }
      },

      setLogo: (url) => set({ logo: url }),
    }),
    {
      name: "company-storage",
      storage: createJSONStorage(() => localStorage),
      // Only persist the data fields; skip the async function.
      partialize: (s) => ({
        logo: s.logo,
        nameAr: s.nameAr,
        nameEn: s.nameEn,
        phone: s.phone,
        whatsapp: s.whatsapp,
        email: s.email,
        website: s.website,
        details: s.details,
        lastFetched: s.lastFetched,
      }),
    }
  )
);

// Backward-compat alias
export const useCompanyStoreLegacy = useCompanyStore;
