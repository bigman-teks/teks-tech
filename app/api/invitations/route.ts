import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/guard";
import { draftSchema } from "@/lib/invitationSchema";
import { extrasSchema, syncExtras } from "@/lib/invitationExtras";
import { jsonOrNull } from "@/lib/prismaJson";
export async function GET() {
  const g = await requireUser(); if ("error" in g) return g.error;
  const rows = await prisma.invitation.findMany({ where: { userId: g.session.sub }, orderBy: { updatedAt: "desc" }, include: { _count: { select: { rsvps: true } } } });
  return NextResponse.json(rows);
}
export async function POST(req: NextRequest) {
  const g = await requireUser(); if ("error" in g) return g.error;
  const body = await req.json().catch(() => null);
  const p = draftSchema.safeParse(body);
  if (!p.success) return NextResponse.json({ error: "Please complete the required event details.", issues: p.error.flatten().fieldErrors }, { status: 400 });
  const ex = extrasSchema.safeParse(body);
  if (!ex.success) return NextResponse.json({ error: "Please check the programme, contacts or FAQ entries.", issues: ex.error.flatten().fieldErrors }, { status: 400 });
  const { date, personalMessage, dressCode, ...rest } = p.data;
  if (rest.templateId && !(await prisma.template.findFirst({ where: { id: rest.templateId, status: "ACTIVE" } })))
    return NextResponse.json({ error: "Template not available." }, { status: 400 });
  if (rest.sourceType === "UPLOADED_FLYER" && !rest.originalFlyerUrl)
    return NextResponse.json({ error: "Please upload a flyer first." }, { status: 400 });
  const row = await prisma.$transaction(async (tx) => {
    const inv = await tx.invitation.create({ data: { ...rest, personalMessage: jsonOrNull(personalMessage), dressCode: jsonOrNull(dressCode), photos: rest.photos ?? {}, theme: rest.theme ?? {}, date: date ? new Date(date) : null, userId: g.session.sub } });
    await syncExtras(tx, inv.id, ex.data);
    return inv;
  });
  return NextResponse.json(row, { status: 201 });
}
