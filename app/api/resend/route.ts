import { NextRequest, NextResponse } from "next/server";
import { rateLimit, sendToTelegram } from "../../lib/rateLimit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(ip, 5, 15 * 60 * 1000)) {
    return NextResponse.json({ ok: false, error: "عدد محاولات كثيرة" }, { status: 429 });
  }

  const { orderId, customerName } = await req.json();

  const text = [
    `🔄 تم طلب إعادة ارسال كود`,
    `🆔 رقم الطلب: ${orderId ?? "—"}`,
    `👤 اسم العميل: ${customerName ?? "—"}`,
  ].join("\n");

  const sent = await sendToTelegram({ chat_id: process.env.TELEGRAM_CHAT_ID, text });

  return NextResponse.json({ ok: sent }, { status: sent ? 200 : 502 });
}
