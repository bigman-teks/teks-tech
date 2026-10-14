import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, slugify } from "@/lib/guard";
import { publishRequired } from "@/lib/invitationSchema";
export async function POST(_: NextRequest, { params }: { params: { id: string } }) {
  const g = await requireUser(); if ("error" in g) return g.error;
  const inv = await prisma.invitation.findFirst({ where: { id: params.id, userId: g.session.sub } });
  if (!inv) return NextResponse.json({ error: "Not found." }, { status: 404 });
  if (inv.status === "PUBLISHED") return NextResponse.json({ slug: inv.slug });
  if (!publishRequired.safeParse({ ...inv, date: inv.date?.toISOString() }).success)
    return NextResponse.json({ error: "Add the event date, venue, title and host name before publishing." }, { status: 400 });
  // Entitlement is decided by the database only: a package with price 0, or an order marked PAID by server-side verification (stage 4).
  const pkg = inv.packageId ? await prisma.package.findUnique({ where: { id: inv.packageId } }) : null;
  const paid = await prisma.order.findFirst({ where: { invitationId: inv.id, status: "PAID" } });
  if (!pkg || pkg.isQuote || (pkg.priceKobo !== 0 && !paid)) {
    await prisma.invitation.update({ where: { id: inv.id }, data: { status: "PENDING_PAYMENT" } });
    return NextResponse.json({ error: "Payment is required before publishing." }, { status: 402 });
  }
  const base = slugify(inv.hostName);
  let slug = base;
  for (let i = 0; await prisma.invitation.findUnique({ where: { slug } }); i++) slug = `${base}-${Math.random().toString(36).slice(2, 6)}`;
  await prisma.invitation.update({ where: { id: inv.id }, data: { slug, status: "PUBLISHED", publishedAt: new Date() } });
  return NextResponse.json({ slug });
}
