import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guard";
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const g = await requireAdmin(); if ("error" in g) return g.error;
  const p = z.object({ status: z.enum(["ACTIVE", "SUSPENDED"]) }).safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  if (params.id === g.session.sub) return NextResponse.json({ error: "You cannot suspend your own account." }, { status: 400 });
  await prisma.user.update({ where: { id: params.id }, data: { status: p.data.status } });
  return NextResponse.json({ ok: true });
}
