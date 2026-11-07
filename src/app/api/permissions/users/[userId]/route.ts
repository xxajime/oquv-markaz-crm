import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { PERMISSION_CATALOG } from "@/lib/permission-catalog";
import { withApiErrors } from "@/lib/api-handler";

function isAdmin(role: string) {
  return role === "SUPER_ADMIN" || role === "ADMIN";
}

async function GETHandler(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isAdmin(session.user.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { userId } = await params;
  const user = await db.user.findUnique({ where: { id: userId }, select: { id: true, fullName: true, role: true } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const grants = await db.userPermission.findMany({
    where: { userId, granted: true },
    select: { permission: { select: { module: true, action: true } } },
  });
  const grantedSet = new Set(grants.map((g) => `${g.permission.module}:${g.permission.action}`));

  return NextResponse.json({
    user,
    catalog: PERMISSION_CATALOG,
    granted: PERMISSION_CATALOG
      .filter((p) => grantedSet.has(`${p.module}:${p.action}`))
      .map((p) => `${p.module}:${p.action}`),
  });
}

const patchSchema = z.object({
  grants: z.array(z.object({
    module: z.string(),
    action: z.string(),
    granted: z.boolean(),
  })),
});

async function PATCHHandler(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isAdmin(session.user.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { userId } = await params;
  const user = await db.user.findUnique({ where: { id: userId }, select: { id: true } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  let updated = 0;
  for (const g of parsed.data.grants) {
    const permission = await db.permission.findUnique({ where: { module_action: { module: g.module, action: g.action } } });
    if (!permission) continue;
    await db.userPermission.upsert({
      where: { userId_permissionId: { userId, permissionId: permission.id } },
      update: { granted: g.granted },
      create: { userId, permissionId: permission.id, granted: g.granted },
    });
    updated++;
  }

  return NextResponse.json({ success: true, updated });
}

export const GET = withApiErrors(GETHandler, "GET /api/permissions/users/[userId]");
export const PATCH = withApiErrors(PATCHHandler, "PATCH /api/permissions/users/[userId]");
