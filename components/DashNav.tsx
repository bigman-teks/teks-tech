"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
const ITEMS = [["Dashboard", "/dashboard"], ["My Invitations", "/dashboard/invitations"], ["Create Invitation", "/invitations/create"], ["RSVPs", "/dashboard/rsvps"], ["Payments", "/dashboard/payments"], ["Profile", "/dashboard/profile"], ["Support", "/dashboard/support"]];
export default function DashNav() {
  const path = usePathname(), r = useRouter();
  const out = async () => { await fetch("/api/auth/logout", { method: "POST" }); r.push("/login"); r.refresh(); };
  const c = (a: boolean) => `whitespace-nowrap rounded-lg px-3 py-2 text-sm ${a ? "bg-electric" : "text-slate-300 hover:bg-white/5"}`;
  return <nav aria-label="Dashboard" className="flex gap-1 overflow-x-auto lg:flex-col">{ITEMS.map(([l, h]) => <Link key={h} href={h} className={c(path === h)}>{l}</Link>)}<button onClick={out} className={c(false) + " text-left"}>Logout</button></nav>;
}
