import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guard";
import { RESOURCES, schemaFor } from "@/lib/adminResources";
type C = { params: { resource: string; id: string } };
export async function PATCH(req: NextRequest, { params }: C) {
  const g = await requireAdmin(); if ("error" in g) return g.error;
  const r = RESOURCES[params.resource]; if (!r) return NextResponse.json({ error: "Not found." }, { status: 404 });
  const p = schemaFor(r).partial().safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: "Please check the highlighted fields.", issues: p.error.flatten().fieldErrors }, { status: 400 });
  try { return NextResponse.json(await (prisma as any)[r.model].update({ where: { id: params.id }, data: p.data })); }
  catch { return NextResponse.json({ error: "Could not save." }, { status: 404 }); }
}
export async function DELETE(_: NextRequest, { params }: C) {
  const g = await requireAdmin(); if ("error" in g) return g.error;
  const r = RESOURCES[params.resource]; if (!r || r.noDelete) return NextResponse.json({ error: "Not found." }, { status: 404 });
  try { await (prisma as any)[r.model].delete({ where: { id: params.id } }); return NextResponse.json({ ok: true }); }
  catch { return NextResponse.json({ error: "This item is in use (for example, by invitations) and cannot be deleted. Deactivate it instead." }, { status: 409 }); }
}
