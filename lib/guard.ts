import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
// Checks the database on every call, so suspending a user or demoting an admin takes effect immediately (JWT alone would not).
export async function requireUser() {
  const s = await getSession();
  if (!s) return { error: NextResponse.json({ error: "Please log in to continue." }, { status: 401 }) } as const;
  const u = await prisma.user.findUnique({ where: { id: s.sub }, select: { role: true, status: true } });
  if (!u) return { error: NextResponse.json({ error: "Please log in to continue." }, { status: 401 }) } as const;
  if (u.status === "SUSPENDED") return { error: NextResponse.json({ error: "This account has been suspended." }, { status: 403 }) } as const;
  return { session: { sub: s.sub, role: u.role } } as const;
}
export async function requireAdmin() {
  const g = await requireUser(); if ("error" in g) return g;
  if (g.session.role !== "ADMIN") return { error: NextResponse.json({ error: "Not allowed." }, { status: 403 }) } as const;
  return g;
}
export const slugify = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 50) || "invitation";
export const naira = (kobo: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(kobo / 100);
