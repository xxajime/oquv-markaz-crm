import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { withApiErrors } from "@/lib/api-handler";

async function PATCHHandler(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const slot = await db.timeSlot.update({ where: { id }, data: body });
  return NextResponse.json(slot);
}

async function DELETEHandler(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await db.timeSlot.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

export const PATCH = withApiErrors(PATCHHandler, "PATCH /api/timeslots/[id]");
export const DELETE = withApiErrors(DELETEHandler, "DELETE /api/timeslots/[id]");
