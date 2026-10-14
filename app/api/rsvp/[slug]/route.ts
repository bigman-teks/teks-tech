import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimit";
const schema = z.object({ name: z.string().trim().min(2).max(80), phone: z.string().trim().max(20).optional(), email: z.string().trim().email().optional().or(z.literal("")), guests: z.number().int().min(1).max(20), attendance: z.enum(["ATTENDING", "MAYBE", "NOT_ATTENDING"]), message: z.string().max(500).optional() });
export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  if (!rateLimit(`rsvp:${req.headers.get("x-forwarded-for") ?? "ip"}:${params.slug}`, 5))
    return NextResponse.json({ error: "Too many submissions. Please try again later." }, { status: 429 });
  const inv = await prisma.invitation.findFirst({ where: { slug: params.slug, status: "PUBLISHED", rsvpEnabled: true } });
  if (!inv) return NextResponse.json({ error: "This invitation is not accepting RSVPs." }, { status: 404 });
  const p = schema.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: "Please check your details." }, { status: 400 });
  await prisma.rsvp.create({ data: { ...p.data, email: p.data.email || null, invitationId: inv.id } });
  return NextResponse.json({ ok: true }, { status: 201 });
}
