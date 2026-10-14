import { prisma } from "@/lib/prisma";
import Chart from "@/components/BarChart";
import { naira } from "@/lib/guard";
import { byMonth } from "@/lib/months";
export const dynamic = "force-dynamic";
export default async function Page() {
  const since = new Date(Date.now() - 200 * 864e5);
  const [users, invs, active, paid, invRows, orderRows, rsvpRows, byTpl] = await Promise.all([
    prisma.user.count(), prisma.invitation.count(), prisma.invitation.count({ where: { status: "PUBLISHED" } }),
    prisma.order.aggregate({ where: { status: "PAID" }, _sum: { amountKobo: true } }),
    prisma.invitation.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true, status: true, updatedAt: true } }),
    prisma.order.findMany({ where: { status: "PAID", paidAt: { gte: since } }, select: { paidAt: true, amountKobo: true } }),
    prisma.rsvp.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
    prisma.invitation.groupBy({ by: ["templateId"], _count: true, orderBy: { _count: { templateId: "desc" } }, take: 6 }),
  ]);
  const tplIds = byTpl.map((t) => t.templateId).filter((id): id is string => id !== null);
  const tpls = await prisma.template.findMany({ where: { id: { in: tplIds } }, select: { id: true, name: true } });
  const cards = [["Total Users", users], ["Total Invitations", invs], ["Active Invitations", active], ["Total Revenue", naira(paid._sum.amountKobo ?? 0)]];
  const charts: [string, { name: string; value: number }[]][] = [
    ["Revenue over time (₦)", byMonth(orderRows, (o) => o.paidAt!, (o) => o.amountKobo / 100)],
    ["Invitations created", byMonth(invRows, (i) => i.createdAt)],
    ["Invitations published", byMonth(invRows.filter((i) => i.status === "PUBLISHED"), (i) => i.updatedAt)],
    ["RSVP activity", byMonth(rsvpRows, (r) => r.createdAt)],
    ["Popular templates", byTpl.map((t) => ({ name: t.templateId ? tpls.find((x) => x.id === t.templateId)?.name ?? "Unknown" : "No template (flyer/scratch)", value: t._count }))],
  ];
  return (<><h1 className="mb-4 text-2xl font-bold">Dashboard</h1>
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">{cards.map(([l, v]) => <div key={l as string} className="card"><p className="text-xs text-slate2">{l}</p><p className="mt-1 font-mono text-2xl">{v}</p></div>)}</div>
    <div className="mt-6 grid gap-4 xl:grid-cols-2">{charts.map(([t, d]) => <div key={t} className="card"><h2 className="mb-2 text-sm font-semibold">{t}</h2>{d.some((x) => x.value) ? <Chart data={d} /> : <p className="py-10 text-center text-sm text-slate2">No data yet.</p>}</div>)}</div></>);
}
