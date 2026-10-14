import Link from "next/link";
import { redirect } from "next/navigation";
import DashNav from "@/components/DashNav";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
export default async function Layout({ children }: { children: React.ReactNode }) {
  const s = await getSession(); if (!s) redirect("/login");
  const u = await prisma.user.findUnique({ where: { id: s.sub } });
  if (!u || u.status === "SUSPENDED") redirect("/login");
  return (
    <div className="container-x grid gap-6 py-6 lg:grid-cols-[13rem_1fr]">
      <aside><Link href="/" className="mb-4 block font-display font-bold">TEKS <span className="text-bright">TECH</span></Link><DashNav /></aside>
      <div className="min-w-0"><p className="mb-4 text-sm text-slate2">Signed in as {u.name}</p>{children}</div>
    </div>
  );
}
