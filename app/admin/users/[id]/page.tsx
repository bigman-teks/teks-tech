import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { naira } from "@/lib/guard";
export const dynamic = "force-dynamic";
export default async function Page({ params }: { params: { id: string } }) {
  const u = await prisma.user.findUnique({ where: { id: params.id }, select: { id: true, name: true, email: true, phone: true, role: true, status: true, createdAt: true, invitations: { orderBy: { createdAt: "desc" } }, orders: { orderBy: { createdAt: "desc" } } } });
  if (!u) notFound();
  return (<><h1 className="text-2xl font-bold">{u.name}</h1><p className="mb-4 text-sm text-slate-300">{u.email} • {u.phone ?? "no phone"} • {u.role} • {u.status}</p>
    <h2 className="mb-2 font-semibold">Invitations</h2>{u.invitations.length ? <ul className="card mb-6 space-y-1 text-sm">{u.invitations.map((i) => <li key={i.id}>{i.hostName} — {i.eventTitle} <span className="text-slate2">({i.status})</span></li>)}</ul> : <p className="mb-6 text-sm text-slate2">No invitations.</p>}
    <h2 className="mb-2 font-semibold">Payment history</h2>{u.orders.length ? <ul className="card space-y-1 text-sm">{u.orders.map((o) => <li key={o.id}>{naira(o.amountKobo)} • {o.status} • <span className="font-mono text-xs">{o.paymentReference}</span> • {o.createdAt.toLocaleDateString("en-NG")}</li>)}</ul> : <p className="text-sm text-slate2">No payments.</p>}</>);
}
