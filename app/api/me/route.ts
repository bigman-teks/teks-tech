import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/guard";
export async function PATCH(req: NextRequest) {
  const g = await requireUser(); if ("error" in g) return g.error;
  const p = z.object({ name: z.string().trim().min(2).max(80), phone: z.string().trim().max(20).optional() }).safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: "Please check your details." }, { status: 400 });
  await prisma.user.update({ where: { id: g.session.sub }, data: p.data });
  return NextResponse.json({ ok: true });
}
