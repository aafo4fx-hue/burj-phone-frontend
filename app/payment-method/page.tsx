"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, CalendarDays, Check, ChevronDown, CreditCard, Wallet } from "lucide-react";
import { useCartStore } from "../store/cartStore";
import PurchaseSteps from "../cart/components/PurchaseSteps";
import "../cart/cart.css";

const fmt = (n: number) => n.toLocaleString("en-US");

function RiyalIcon({ size = 18 }: { size?: number }) {
  return (
    <Image
      src="/money-icon.webp"
      alt="ر.س"
      width={size}
      height={size}
      className="opacity-80 shrink-0"
      style={{ width: "auto", height: "auto" }}
    />
  );
}

export default function PaymentMethodPage() {
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);
  return mounted ? <PaymentOptions /> : <main className="purchase-page" aria-busy="true" />;
}

function PaymentOptions() {
  const router = useRouter();
  const { items, customer, totalPrice, setCustomer } = useCartStore();
  const total = totalPrice();
  const canInstall = total >= 1000;
  const maxMonths = Math.max(0, ...items.map((item) => item.product.installment?.months ?? 0)) || 24;
  const monthsOptions = [3, 6, 9, 12, 18, 24].filter((m) => m <= maxMonths);
  if (!monthsOptions.includes(maxMonths)) monthsOptions.push(maxMonths);
  const downOptions = [1000, 1500, 2000].filter((amount) => amount < total);
  if (!downOptions.length) downOptions.push(Math.floor(total * 0.25));
  const [type, setType] = useState<"full" | "installment">(customer?.installmentType ?? (canInstall ? "installment" : "full"));
  const [selectedMonths, setMonths] = useState(customer?.months ?? maxMonths);
  const [selectedDown, setDown] = useState(customer?.downPayment ?? downOptions[0]);
  const months = monthsOptions.includes(selectedMonths) ? selectedMonths : maxMonths;
  const down = downOptions.includes(selectedDown) ? selectedDown : downOptions[0];
  const isInstallment = canInstall && type === "installment";
  const remaining = total - down;
  const monthly = Math.floor(remaining / months);
  const [scheduleStart] = useState(() => new Date());
  const [navigating, setNavigating] = useState(false);
  const schedule = Array.from({ length: isInstallment ? months : 0 }, (_, i) => {
    const date = new Date(scheduleStart.getFullYear(), scheduleStart.getMonth() + i + 1, 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    date.setDate(Math.min(scheduleStart.getDate(), lastDay));
    return { index: i + 1, date: date.toLocaleDateString("en-GB"), amount: i === months - 1 ? remaining - monthly * (months - 1) : monthly };
  });
  useEffect(() => { if (!items.length) router.replace("/cart"); }, [items.length, router]);
  if (!items.length) return <main className="purchase-page" aria-busy="true" />;

  function handleNext() {
    if (navigating) return;
    setNavigating(true);
    setCustomer({
      name: customer?.name ?? "", nationalId: customer?.nationalId ?? "",
      whatsapp: customer?.whatsapp ?? "", address: customer?.address ?? "",
      installmentType: isInstallment ? "installment" : "full",
      months: isInstallment ? months : 0, downPayment: isInstallment ? down : 0,
    });
    setTimeout(() => router.push("/checkout"), 4000);
  }

  return (
    <main className="purchase-page purchase-payment-page" dir="rtl">
      <div className="purchase-shell">
        <div className="purchase-topline">
          <Link href="/cart" className="purchase-back"><ArrowRight size={16} /> ارجع لسلّتك</Link>
          <span>على راحتك</span>
        </div>
        <PurchaseSteps current={2} />
        <header className="purchase-heading">
          <h1>سدّد على راحتك<span>.</span></h1>
          <p>{canInstall ? "اختر الطريقة اللي تناسبك، والباقي واضح." : "راجع المبلغ وكمّل طلبك بدفعة واحدة."}</p>
        </header>
        <div className="purchase-layout">
          <div className="purchase-main">
            <section className="purchase-panel">
              <div className="purchase-section-heading"><h2><Wallet size={20} /> كيف ودّك تسدّد؟</h2></div>
              <fieldset className="purchase-methods"><legend className="sr-only">طريقة السداد</legend>
                {canInstall && (
                  <label className={`purchase-method ${isInstallment ? "is-selected" : ""}`}>
                    <input type="radio" name="payment-type" value="installment" checked={isInstallment} onChange={() => setType("installment")} />
                    <span className="purchase-method-top"><CalendarDays size={25} /><span className="purchase-radio">{isInstallment && <Check size={13} />}</span></span>
                    <strong>تقسيط شهري</strong><em>بسعر الكاش · بدون فوائد</em>
                  </label>
                )}
                <label className={`purchase-method ${!isInstallment ? "is-selected" : ""}`}>
                  <input type="radio" name="payment-type" value="full" checked={!isInstallment} onChange={() => setType("full")} />
                  <span className="purchase-method-top"><CreditCard size={25} /><span className="purchase-radio">{!isInstallment && <Check size={13} />}</span></span>
                  <strong>دفع كامل</strong>
                  <em className="flex items-center gap-1">{fmt(total)} <RiyalIcon size={14} /></em>
                </label>
              </fieldset>
              {!canInstall && <p className="purchase-caption">التقسيط يبدأ من 1,000 ر.س. تقدر تسدّد طلبك الحالي كامل.</p>}
              {isInstallment && (
                <div className="purchase-plan-controls">
                  <fieldset className="purchase-field">
                    <legend>مدة التقسيط <span>كم شهر يناسبك؟</span></legend>
                    <div className="purchase-months">
                      {monthsOptions.map((value) => (
                        <label key={value} className={months === value ? "is-selected" : ""}>
                          <input type="radio" name="months" value={value} checked={months === value} onChange={() => setMonths(value)} />
                          <b>{value}</b><span>شهر</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  <fieldset className="purchase-field">
                    <legend>المقدّم <span>ينخصم من إجمالي طلبك</span></legend>
                    <div className="purchase-down-options">
                      {downOptions.map((value) => (
                        <label key={value} className={down === value ? "is-selected" : ""}>
                          <input type="radio" name="down-payment" value={value} checked={down === value} onChange={() => setDown(value)} />
                          <b className="flex items-center gap-1">{fmt(value)} <RiyalIcon size={14} /></b>
                          {down === value && <Check size={15} />}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  <details className="purchase-schedule">
                    <summary>
                      <span><CalendarDays size={18} /> شوف جدول الدفعات</span>
                      <span>{months} دفعة <ChevronDown size={16} /></span>
                    </summary>
                    <p className="purchase-caption">المواعيد تقريبية وتبدأ بعد شهر، وتتأكد مع طلبك.</p>
                    <div className="purchase-schedule-scroll" tabIndex={0} role="region" aria-label="جدول الدفعات">
                      <table>
                        <thead><tr><th>الدفعة</th><th>التاريخ المتوقع</th><th>المبلغ</th></tr></thead>
                        <tbody>
                          {schedule.map((row) => (
                            <tr key={row.index}>
                              <td>{String(row.index).padStart(2, "0")}</td>
                              <td><bdi>{row.date}</bdi></td>
                              <td className="flex items-center gap-1">{fmt(row.amount)} <RiyalIcon size={14} /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </details>
                </div>
              )}
            </section>
          </div>
          <aside className="purchase-summary purchase-plan-summary">
            <div className="purchase-plan-hero" aria-live="polite" aria-atomic="true">
              <p>{isInstallment ? "قسطك بالشهر تقريبًا" : "إجمالي المبلغ"}</p>
              <strong className="flex items-center gap-2">
                {fmt(isInstallment ? Math.ceil(remaining / months) : total)}
                <RiyalIcon size={26} />
              </strong>
              <span>{isInstallment ? `على ${months} شهر · بدون فوائد` : "دفعة واحدة وتكمّل طلبك"}</span>
            </div>
            <div className="purchase-plan-body">
              <dl className="purchase-totals">
                <div>
                  <dt>قيمة المنتجات</dt>
                  <dd className="flex items-center gap-1">{fmt(total)} <RiyalIcon size={16} /></dd>
                </div>
                {isInstallment && (
                  <div>
                    <dt>الباقي على أقساط</dt>
                    <dd className="flex items-center gap-1">{fmt(remaining)} <RiyalIcon size={16} /></dd>
                  </div>
                )}
              </dl>
              <div className="purchase-grand-total">
                <span>{isInstallment ? "المقدّم الآن" : "المطلوب الآن"}</span>
                <strong className="flex items-center gap-1">
                  {fmt(isInstallment ? down : total)} <RiyalIcon size={22} />
                </strong>
              </div>
              <p className="purchase-caption">{isInstallment ? "آخر دفعة ممكن تختلف شوي بسبب التقريب." : "تفاصيل التوصيل تطلع لك بالخطوة الجاية."}</p>
              <button
                type="button"
                onClick={handleNext}
                disabled={navigating}
                className="purchase-primary"
                style={navigating ? { opacity: 0.85, cursor: "not-allowed" } : {}}
              >
                {navigating ? (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 0.8s linear infinite" }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                    جاري الانتقال...
                  </span>
                ) : (
                  <>كمّل طلبك <ArrowLeft size={18} /></>
                )}
              </button>
              {navigating && <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>}
              <Link href="/cart" className="purchase-edit-link">عدّل سلّتك</Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
