import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guard";
const schemas = {
  founder: z.object({ name: z.string().trim().min(1).max(100), title: z.string().trim().min(1).max(100), bio: z.string().trim().min(1).max(3000), photoUrl: z.string().url().max(500).nullable() }),
  logo: z.object({ url: z.string().url().max(500).nullable() }),
};
export async function PATCH(req: NextRequest) {
  const g = await requireAdmin(); if ("error" in g) return g.error;
  const body = await req.json().catch(() => null) as { key?: string; value?: unknown } | null;
  const schema = body?.key ? (schemas as any)[body.key] : null;
  if (!schema) return NextResponse.json({ error: "Unknown setting." }, { status: 400 });
  const p = schema.safeParse(body!.value);
  if (!p.success) return NextResponse.json({ error: "Please check the highlighted fields.", issues: p.error.flatten().fieldErrors }, { status: 400 });
  await prisma.setting.upsert({ where: { key: body!.key! }, update: { value: p.data }, create: { key: body!.key!, value: p.data } });
  return NextResponse.json({ ok: true });
}
