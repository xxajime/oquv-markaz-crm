import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { withApiErrors } from "@/lib/api-handler";

async function GETHandler() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const slots = await db.timeSlot.findMany({ orderBy: { startTime: "asc" } });
  return NextResponse.json(slots);
}

async function POSTHandler(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user;
  if (!["SUPER_ADMIN", "ADMIN"].includes(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { startTime, endTime, label } = await req.json();
  if (!startTime || !endTime || !label) return NextResponse.json({ error: "Ma'lumot to'liq emas" }, { status: 400 });

  const slot = await db.timeSlot.create({ data: { startTime, endTime, label } });
  return NextResponse.json(slot, { status: 201 });
}

export const GET = withApiErrors(GETHandler, "GET /api/timeslots");
export const POST = withApiErrors(POSTHandler, "POST /api/timeslots");
