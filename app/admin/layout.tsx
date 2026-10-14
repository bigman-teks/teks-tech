import Link from "next/link";
import { redirect } from "next/navigation";
import AdminNav from "@/components/AdminNav";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
export const metadata = { title: "Admin — Teks Tech", robots: { index: false } };
export default async function Layout({ children }: { children: React.ReactNode }) {
  const s = await getSession(); if (!s) redirect("/login?next=/admin");
  const u = await prisma.user.findUnique({ where: { id: s.sub } });
  if (!u || u.role !== "ADMIN" || u.status !== "ACTIVE") redirect("/dashboard");
  return (<div className="container-x grid gap-6 py-6 lg:grid-cols-[13rem_1fr]"><aside><Link href="/" className="mb-4 block font-display font-bold">TEKS <span className="text-bright">ADMIN</span></Link><AdminNav /></aside><div className="min-w-0">{children}</div></div>);
}
