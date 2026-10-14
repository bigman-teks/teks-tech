import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guard";
import { RESOURCES, schemaFor } from "@/lib/adminResources";
export async function POST(req: NextRequest, { params }: { params: { resource: string } }) {
  const g = await requireAdmin(); if ("error" in g) return g.error;
  const r = RESOURCES[params.resource];
  if (!r || r.noCreate) return NextResponse.json({ error: "Not found." }, { status: 404 });
  const p = schemaFor(r).safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: "Please check the highlighted fields.", issues: p.error.flatten().fieldErrors }, { status: 400 });
  try { return NextResponse.json(await (prisma as any)[r.model].create({ data: p.data }), { status: 201 }); }
  catch { return NextResponse.json({ error: "Could not save. It may already exist." }, { status: 409 }); }
}
