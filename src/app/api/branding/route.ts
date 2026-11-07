import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { withApiErrors } from "@/lib/api-handler";
import { BRAND_NAME } from "@/lib/brand";

export const dynamic = "force-dynamic";

// Public endpoint: returns brand logo + name for login/sidebar (no auth required).
async function GETHandler() {
  try {
    const settings = await db.setting.findMany({
      where: { key: { in: ["brand_logo", "center_name"] } },
    });
    const map: Record<string, string> = {};
    for (const s of settings) map[s.key] = s.value;
    return NextResponse.json({
      logo: map["brand_logo"] || "",
      name: map["center_name"] || BRAND_NAME,
    });
  } catch {
    return NextResponse.json({ logo: "", name: BRAND_NAME });
  }
}

export const GET = withApiErrors(GETHandler, "GET /api/branding");
