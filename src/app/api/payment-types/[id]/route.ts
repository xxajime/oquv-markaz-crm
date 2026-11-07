import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import type { Session } from "next-auth";
import { withApiErrors } from "@/lib/api-handler";

function admin(s: Session | null) { return s && ["SUPER_ADMIN", "ADMIN"].includes(s.user.role); }

async function PATCHHandler(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!admin(session)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const body = await req.json();
  const t = await db.paymentType.update({ where: { id }, data: { isActive: body.isActive } });
  return NextResponse.json(t);
}

async function DELETEHandler(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!admin(session)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  await db.paymentType.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

export const PATCH = withApiErrors(PATCHHandler, "PATCH /api/payment-types/[id]");
export const DELETE = withApiErrors(DELETEHandler, "DELETE /api/payment-types/[id]");
