import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { logAudit } from "@/lib/audit";
import { withApiErrors } from "@/lib/api-handler";

export const dynamic = "force-dynamic";

async function GETHandler(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const payment = await db.payment.findUnique({
    where: { id },
    include: {
      lead: { select: { fullName: true, phone: true, course: { select: { name: true } } } },
      group: { select: { name: true } },
      createdBy: { select: { fullName: true } },
    },
  });
  if (!payment) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ...payment, courseName: payment.lead?.course?.name || null });
}

async function DELETEHandler(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!["SUPER_ADMIN", "ADMIN"].includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  await db.payment.delete({ where: { id } });
  const u = session.user;
  await logAudit(u.id, u.name || u.fullName, "payment_deleted", "Payment", id);
  return NextResponse.json({ success: true });
}

export const GET = withApiErrors(GETHandler, "GET /api/payments/[id]");
export const DELETE = withApiErrors(DELETEHandler, "DELETE /api/payments/[id]");
