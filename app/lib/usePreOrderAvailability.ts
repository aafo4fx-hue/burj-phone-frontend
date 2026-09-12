"use client";

import { useState, useEffect } from "react";

export type ReservationStatus = "not_started" | "open" | "ended";

export function usePreOrderAvailability(): ReservationStatus {
  const [status, setStatus] = useState<ReservationStatus>("not_started");

  useEffect(() => {
    const dateStr =
      process.env.NEXT_PUBLIC_IPHONE18_RESERVATION_DATE ??
      "2026-09-22T12:00:00+03:00";
    const openAt = new Date(dateStr).getTime();

    const calc = () => {
      if (Date.now() >= openAt) setStatus("open");
      else setStatus("not_started");
    };

    calc();
    const id = setInterval(calc, 5000);
    return () => clearInterval(id);
  }, []);

  return status;
}

/**
 * Returns true if the product name matches any iPhone 18 variant
 * (18, 18 Pro, 18 Pro Max, 18 Duo / دو)
 */
export function isIPhone18PreOrder(productName: string): boolean {
  return (
    /iphone\s*18/i.test(productName) ||
    /آيفون\s*18|ايفون\s*18/i.test(productName) ||
    /آيفون\s*(Duo|دو)\b/i.test(productName)
  );
}
