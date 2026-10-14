import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/guard";
import { paystack } from "@/lib/paystack";
import { rateLimit } from "@/lib/rateLimit";
export async function POST(req: NextRequest) {
  const g = await requireUser(); if ("error" in g) return g.error;
  if (!rateLimit("pay:" + g.session.sub, 10)) return NextResponse.json({ error: "Too many attempts. Please wait." }, { status: 429 });
  const { invitationId } = (await req.json().catch(() => ({}))) as { invitationId?: string };
  const inv = invitationId ? await prisma.invitation.findFirst({ where: { id: invitationId, userId: g.session.sub } }) : null;
  if (!inv?.packageId) return NextResponse.json({ error: "Choose a package first." }, { status: 400 });
  const pkg = await prisma.package.findUnique({ where: { id: inv.packageId } });
  // Amount always comes from the database, never from the browser.
  if (!pkg || pkg.status !== "ACTIVE" || pkg.isQuote || pkg.priceKobo == null) return NextResponse.json({ error: "This package cannot be purchased online. Please request a quote." }, { status: 400 });
  if (pkg.priceKobo === 0 || (await prisma.order.findFirst({ where: { invitationId: inv.id, status: "PAID" } }))) return NextResponse.json({ free: true });
  const user = await prisma.user.findUniqueOrThrow({ where: { id: g.session.sub } });
  const reference = "TT-" + crypto.randomUUID();
  await prisma.order.create({ data: { userId: user.id, invitationId: inv.id, packageId: pkg.id, amountKobo: pkg.priceKobo, paymentReference: reference } });
  try {
    const d = await paystack("/transaction/initialize", { method: "POST", body: JSON.stringify({ email: user.email, amount: pkg.priceKobo, currency: "NGN", reference, callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/callback`, metadata: { invitationId: inv.id, packageId: pkg.id } }) });
    return NextResponse.json({ url: d.authorization_url, reference });
  } catch {
    await prisma.order.update({ where: { paymentReference: reference }, data: { status: "FAILED" } });
    return NextResponse.json({ error: "Could not start payment. Please try again." }, { status: 502 });
  }
}
