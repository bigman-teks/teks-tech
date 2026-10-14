import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/guard";
import { draftSchema } from "@/lib/invitationSchema";
import { extrasSchema, syncExtras } from "@/lib/invitationExtras";
import { jsonOrNull } from "@/lib/prismaJson";
type Ctx = { params: { id: string } };
async function own(id: string, uid: string) { return prisma.invitation.findFirst({ where: { id, userId: uid } }); }
export async function GET(_: NextRequest, { params }: Ctx) {
  const g = await requireUser(); if ("error" in g) return g.error;
  const inv = await own(params.id, g.session.sub);
  return inv ? NextResponse.json(inv) : NextResponse.json({ error: "Not found." }, { status: 404 });
}
export async function PATCH(req: NextRequest, { params }: Ctx) {
  const g = await requireUser(); if ("error" in g) return g.error;
  if (!(await own(params.id, g.session.sub))) return NextResponse.json({ error: "Not found." }, { status: 404 });
  const body = await req.json().catch(() => null);
  const p = draftSchema.partial().safeParse(body);
  if (!p.success) return NextResponse.json({ error: "Some details are invalid.", issues: p.error.flatten().fieldErrors }, { status: 400 });
  const ex = extrasSchema.safeParse(body);
  if (!ex.success) return NextResponse.json({ error: "Please check the programme, contacts or FAQ entries.", issues: ex.error.flatten().fieldErrors }, { status: 400 });
  const { date, personalMessage, dressCode, ...rest } = p.data;
  const row = await prisma.$transaction(async (tx) => {
    const inv = await tx.invitation.update({ where: { id: params.id }, data: { ...rest, personalMessage: jsonOrNull(personalMessage), dressCode: jsonOrNull(dressCode), ...(date !== undefined && { date: date ? new Date(date) : null }) } });
    await syncExtras(tx, params.id, ex.data);
    return inv;
  });
  return NextResponse.json(row);
}
export async function DELETE(_: NextRequest, { params }: Ctx) {
  const g = await requireUser(); if ("error" in g) return g.error;
  if (!(await own(params.id, g.session.sub))) return NextResponse.json({ error: "Not found." }, { status: 404 });
  await prisma.invitation.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
