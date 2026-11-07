import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { withApiErrors } from "@/lib/api-handler";

export const dynamic = "force-dynamic";

async function GETHandler() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!["SUPER_ADMIN", "ADMIN"].includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const logs = await db.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  return NextResponse.json(logs);
}

export const GET = withApiErrors(GETHandler, "GET /api/logs");
