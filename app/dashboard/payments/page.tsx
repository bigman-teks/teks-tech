import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { naira } from "@/lib/guard";
export default async function Page() {
  const rows = await prisma.order.findMany({ where: { userId: (await getSession())!.sub }, orderBy: { createdAt: "desc" }, include: { invitation: { select: { eventTitle: true } } } });
  return (<><h1 className="mb-4 text-2xl font-bold">Payments</h1>
    {!rows.length ? <div className="card text-center">No payments yet.</div> :
      <div className="overflow-x-auto rounded-2xl border border-white/10"><table className="w-full min-w-[560px] text-left text-sm"><thead className="bg-navy text-xs text-slate2"><tr>{["Invitation", "Package", "Amount", "Status", "Reference", "Date"].map((h) => <th key={h} className="p-3">{h}</th>)}</tr></thead>
        <tbody>{rows.map((o) => <tr key={o.id} className="border-t border-white/10"><td className="p-3">{o.invitation?.eventTitle ?? "—"}</td><td className="p-3">{o.packageId}</td><td className="p-3 font-mono">{naira(o.amountKobo)}</td><td className="p-3">{o.status}</td><td className="p-3 font-mono text-xs">{o.paymentReference}</td><td className="p-3 whitespace-nowrap">{o.createdAt.toLocaleDateString("en-NG")}</td></tr>)}</tbody></table></div>}</>);
}
