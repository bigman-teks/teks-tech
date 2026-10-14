import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/guard";
const cell = (v: unknown) => { let s = String(v ?? ""); if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; return `"${s.replace(/"/g, '""')}"`; }; // blocks spreadsheet formula injection
const LABEL: Record<string, string> = { ATTENDING: "Attending", MAYBE: "Maybe", NOT_ATTENDING: "Not attending" };
export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const g = await requireUser(); if ("error" in g) return g.error;
  const inv = await prisma.invitation.findFirst({ where: { id: params.id, userId: g.session.sub } });
  if (!inv) return NextResponse.json({ error: "Not found." }, { status: 404 });
  const rows = await prisma.rsvp.findMany({ where: { invitationId: inv.id }, orderBy: { createdAt: "desc" } });
  const csv = ["Name,Phone,Email,Guests,Status,Message,Date", ...rows.map((r) => [r.name, r.phone, r.email, r.guests, LABEL[r.attendance], r.message, r.createdAt.toISOString()].map(cell).join(","))].join("\n");
  return new NextResponse(csv, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="rsvps-${inv.slug ?? inv.id}.csv"` } });
}
