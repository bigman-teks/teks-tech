import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimit";
const TYPES = ["VIEW", "SHARE", "WHATSAPP_CLICK", "MAP_CLICK"];
export async function POST(req: NextRequest) {
  const b = await req.json().catch(() => null);
  if (!b || !TYPES.includes(b.type) || typeof b.slug !== "string") return NextResponse.json({ ok: false }, { status: 400 });
  if (!rateLimit(`trk:${b.visitorId ?? "v"}:${b.slug}`, 30)) return NextResponse.json({ ok: false }, { status: 429 });
  const inv = await prisma.invitation.findFirst({ where: { slug: b.slug, status: "PUBLISHED" }, select: { id: true } });
  if (!inv) return NextResponse.json({ ok: false }, { status: 404 });
  await prisma.analyticsEvent.create({ data: { invitationId: inv.id, type: b.type, visitorId: String(b.visitorId ?? "").slice(0, 40) || null } });
  if (b.type === "VIEW") await prisma.invitation.update({ where: { id: inv.id }, data: { views: { increment: 1 } } }).catch(() => {});
  return NextResponse.json({ ok: true });
}
