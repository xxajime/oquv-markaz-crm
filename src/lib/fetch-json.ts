/**
 * Klient tomonidagi GET so'rovlar uchun xavfsiz yordamchilar.
 *
 * Muammo: kod bo'ylab `fetch(url).then(r => r.json()).then(setX)` shabloni
 * ishlatilgan edi. Bunda:
 *   - 401/403/500 javobda body `{ error: "..." }` bo'ladi va u massiv kutayotgan
 *     state'ga tushadi → keyingi `.map()` sahifani qulatadi;
 *   - body bo'sh bo'lsa `r.json()` otiladi → `.finally(setLoading(false))` bo'lmasa
 *     sahifa abadiy "yuklanmoqda" holatida qoladi.
 *
 * Quyidagi funksiyalar har ikkala holatda ham xavfsiz standart qiymat qaytaradi.
 */

export async function fetchArray<T>(url: string, init?: RequestInit): Promise<T[]> {
  try {
    const res = await fetch(url, init);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function fetchJson<T>(url: string, fallback: T, init?: RequestInit): Promise<T> {
  try {
    const res = await fetch(url, init);
    if (!res.ok) return fallback;
    const data = await res.json();
    return (data ?? fallback) as T;
  } catch {
    return fallback;
  }
}
