import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { BRAND_NAME } from "@/lib/brand";

export const metadata: Metadata = {
  title: BRAND_NAME,
  description:
    "O'quv markazlar uchun boshqaruv tizimi: lidlar, guruhlar, davomat, to'lovlar, o'qituvchilar va hisobotlar.",
};

export const dynamic = "force-dynamic";

export default async function Home() {
  const settings = await db.setting
    .findMany({ where: { key: { in: ["brand_logo", "center_name"] } } })
    .catch(() => []);

  const map: Record<string, string> = {};
  settings.forEach((s) => (map[s.key] = s.value));
  const centerName = map["center_name"] || BRAND_NAME;
  const hasLogo = Boolean(map["brand_logo"]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 text-center shadow-sm">
        {hasLogo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/api/branding/logo" alt={centerName} className="mx-auto mb-4 h-16 w-16 rounded-xl object-contain" />
        )}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{centerName}</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Kursga yozilish uchun ariza qoldiring yoki tizimga kiring.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Link
            href="/apply"
            className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Ariza qoldirish
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Tizimga kirish
          </Link>
        </div>
      </div>
    </main>
  );
}
