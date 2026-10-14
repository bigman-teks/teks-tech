import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/guard";

// Toggles a template in the signed-in user's favourites.
export async function POST(req: NextRequest) {
  const g = await requireUser(); if ("error" in g) return g.error;
  const p = z.object({ templateId: z.string().min(1) }).safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  const key = { userId_templateId: { userId: g.session.sub, templateId: p.data.templateId } };
  const existing = await prisma.favorite.findUnique({ where: key });
  if (existing) {
    await prisma.favorite.delete({ where: key });
    return NextResponse.json({ favorited: false });
  }
  const tpl = await prisma.template.findFirst({ where: { id: p.data.templateId, status: "ACTIVE" }, select: { id: true } });
  if (!tpl) return NextResponse.json({ error: "Template not available." }, { status: 404 });
  await prisma.favorite.create({ data: { userId: g.session.sub, templateId: p.data.templateId } });
  return NextResponse.json({ favorited: true });
}
