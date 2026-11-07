import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { hasPermission } from "@/lib/rbac";
import { withApiErrors } from "@/lib/api-handler";

export const dynamic = "force-dynamic";

async function GETHandler() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const exams = await db.exam.findMany({
    orderBy: { date: "desc" },
    include: {
      group: { select: { name: true } },
      course: { select: { name: true } },
      _count: { select: { scores: true } },
    },
  });
  return NextResponse.json(exams);
}

const schema = z.object({
  title: z.string().min(1, "Nom kiriting"),
  type: z.enum(["exam", "level_test"]).optional(),
  courseId: z.string().optional().nullable(),
  groupId: z.string().optional().nullable(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Sana YYYY-MM-DD formatida bo\'lishi kerak"),
  maxScore: z.coerce.number().int().min(1).optional(),
});

async function POSTHandler(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = session.user;
  const isAdminRole = ["SUPER_ADMIN", "ADMIN"].includes(user.role);
  const canAdd = isAdminRole || user.canManageGrades || await hasPermission(user, "exams", "add");
  if (!canAdd) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const d = parsed.data;

  const exam = await db.exam.create({
    data: {
      title: d.title.trim(),
      type: d.type || "exam",
      courseId: d.courseId || null,
      groupId: d.groupId || null,
      date: new Date(d.date + "T00:00:00.000Z"),
      maxScore: d.maxScore || 100,
      createdById: user.id,
    },
  });
  return NextResponse.json(exam, { status: 201 });
}

export const GET = withApiErrors(GETHandler, "GET /api/exams");
export const POST = withApiErrors(POSTHandler, "POST /api/exams");
