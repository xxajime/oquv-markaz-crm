import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { withApiErrors } from "@/lib/api-handler";

export const dynamic = "force-dynamic";

async function GETHandler() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const holidays = await db.holiday.findMany({ orderBy: { date: "asc" } });
  return NextResponse.json(holidays);
}

const schema = z.object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Sana YYYY-MM-DD formatida bo\'lishi kerak"), name: z.string().min(1, "Nom kiriting") });

async function POSTHandler(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!["SUPER_ADMIN", "ADMIN"].includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  try {
    const h = await db.holiday.create({ data: { date: new Date(parsed.data.date + "T00:00:00.000Z"), name: parsed.data.name.trim() } });
    return NextResponse.json(h, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Bu sana allaqachon qo'shilgan" }, { status: 400 });
  }
}

export const GET = withApiErrors(GETHandler, "GET /api/holidays");
export const POST = withApiErrors(POSTHandler, "POST /api/holidays");
