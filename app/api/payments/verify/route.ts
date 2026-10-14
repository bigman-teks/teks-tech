import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/guard";
import { settleOrder } from "@/lib/paystack";
export async function GET(req: NextRequest) {
  const g = await requireUser(); if ("error" in g) return g.error;
  const ref = req.nextUrl.searchParams.get("reference") ?? "";
  const order = await prisma.order.findFirst({ where: { paymentReference: ref, userId: g.session.sub } });
  if (!order) return NextResponse.json({ error: "Payment not found." }, { status: 404 });
  try { return NextResponse.json({ status: await settleOrder(ref), invitationId: order.invitationId }); }
  catch { return NextResponse.json({ error: "Could not verify payment right now. Please retry." }, { status: 502 }); }
}
