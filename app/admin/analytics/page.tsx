import { prisma } from "@/lib/prisma";
import Chart from "@/components/BarChart";
export const dynamic = "force-dynamic";
export default async function Page() {
  const g = await prisma.analyticsEvent.groupBy({ by: ["type"], _count: true });
  const d = ["VIEW", "SHARE", "WHATSAPP_CLICK", "MAP_CLICK"].map((t) => ({ name: t.replace("_CLICK", "").toLowerCase(), value: g.find((x) => x.type === t)?._count ?? 0 }));
  return (<><h1 className="mb-4 text-2xl font-bold">Analytics</h1><div className="card">{d.some((x) => x.value) ? <Chart data={d} /> : <p className="py-10 text-center text-sm text-slate2">No guest activity recorded yet.</p>}</div><p className="mt-3 text-xs text-slate2">Counts come from events recorded when guests open and use published invitations.</p></>);
}
