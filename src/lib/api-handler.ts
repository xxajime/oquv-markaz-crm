import { NextResponse } from "next/server";

/**
 * Har bir Route Handler uchun umumiy `try/catch`.
 *
 * Nega kerak: handler ichida kutilmagan xato (DB uzilishi, buzuq JSON body,
 * `undefined` maydon) otilsa, Next.js standart 500 sahifasini qaytaradi — u
 * ko'pincha bo'sh yoki HTML body bilan keladi. Klient tomonda esa hamma joyda
 * `res.json()` chaqiriladi va bo'sh body'da u ham otilib, sahifa qulaydi.
 *
 * Bu o'ram har qanday holatda ham JSON javob qaytishini kafolatlaydi, xatoni
 * server logiga yozadi va tafsilotlarni (stack, DB xabari) tashqariga chiqarmaydi.
 */

// Next.js `redirect()` / `notFound()` kabi funksiyalar ichki xato otish orqali
// ishlaydi — ularni ushlab qolmaslik kerak, aks holda navigatsiya buziladi.
function isNextControlFlowError(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "digest" in err &&
    typeof (err as { digest?: unknown }).digest === "string" &&
    (err as { digest: string }).digest.startsWith("NEXT_")
  );
}

export function withApiErrors<A extends unknown[], R extends Response>(
  handler: (...args: A) => Promise<R> | R,
  name: string
): (...args: A) => Promise<R | NextResponse> {
  return async (...args: A) => {
    try {
      return await handler(...args);
    } catch (err) {
      if (isNextControlFlowError(err)) throw err;
      // `await req.json()` buzuq body'da SyntaxError otadi — bu klient xatosi,
      // shuning uchun 500 emas, 400 qaytarish to'g'ri.
      if (err instanceof SyntaxError) {
        return NextResponse.json({ error: "Noto'g'ri JSON" }, { status: 400 });
      }
      console.error(`[api] ${name}:`, err);
      return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
    }
  };
}

/** `?limit=abc` / `?limit=-5` kabi qiymatlar Prisma'ga NaN yoki manfiy `take` bo'lib
 *  o'tib ketmasligi uchun — har doim chegaralangan butun son qaytaradi. */
export function intParam(value: string | null, fallback: number, min: number, max: number): number {
  const n = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

/** "YYYY-MM-DD" ni tekshiradi. Noto'g'ri bo'lsa `null` — chaqiruvchi 400 qaytaradi. */
export function parseDateParam(value: string | null): Date | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const d = new Date(value + "T00:00:00.000Z");
  return Number.isNaN(d.getTime()) ? null : d;
}

/** "YYYY-MM" ni tekshiradi va oyning boshi/oxirini qaytaradi. */
export function parseMonthParam(value: string | null): { from: Date; to: Date } | null {
  if (!value || !/^\d{4}-\d{2}$/.test(value)) return null;
  const [yr, mn] = value.split("-").map(Number);
  if (mn < 1 || mn > 12) return null;
  const from = new Date(Date.UTC(yr, mn - 1, 1, 0, 0, 0, 0));
  const to = new Date(Date.UTC(yr, mn, 0, 23, 59, 59, 999));
  return Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()) ? null : { from, to };
}
