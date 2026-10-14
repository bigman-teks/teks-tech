"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
const ITEMS = ["Dashboard", "Users", "Invitations", "Templates", "Orders", "Payments", "RSVPs", "Products", "Services", "Portfolio", "Branding", "Coupons", "Analytics", "Settings"];
export default function AdminNav() {
  const p = usePathname(), r = useRouter();
  const out = async () => { await fetch("/api/auth/logout", { method: "POST" }); r.push("/login"); r.refresh(); };
  return (<nav aria-label="Admin" className="flex gap-1 overflow-x-auto lg:flex-col">
    {ITEMS.map((l) => { const h = l === "Dashboard" ? "/admin" : `/admin/${l.toLowerCase()}`; const a = p === h || (h !== "/admin" && p.startsWith(h)); return <Link key={l} href={h} className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm ${a ? "bg-electric" : "text-slate-300 hover:bg-white/5"}`}>{l}</Link>; })}
    <button onClick={out} className="whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm text-slate-300 hover:bg-white/5">Logout</button></nav>);
}
