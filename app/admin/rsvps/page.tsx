import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
const LABEL: Record<string, string> = { ATTENDING: "Attending", MAYBE: "Maybe", NOT_ATTENDING: "Not attending" };
export default async function Page() {
  const rows = await prisma.rsvp.findMany({ orderBy: { createdAt: "desc" }, take: 200, include: { invitation: { select: { hostName: true, eventTitle: true } } } });
  return (<><h1 className="mb-4 text-2xl font-bold">RSVPs</h1>{!rows.length ? <div className="card text-center text-sm">No RSVPs yet.</div> : <div className="overflow-x-auto rounded-2xl border border-white/10"><table className="w-full min-w-[600px] text-left text-sm"><thead className="bg-navy text-xs text-slate2"><tr>{["Guest", "Event", "Guests", "Status", "Date"].map((h) => <th key={h} className="p-3">{h}</th>)}</tr></thead>
    <tbody>{rows.map((r) => <tr key={r.id} className="border-t border-white/10"><td className="p-3">{r.name}</td><td className="p-3">{r.invitation.hostName} — {r.invitation.eventTitle}</td><td className="p-3 font-mono">{r.guests}</td><td className="p-3">{LABEL[r.attendance]}</td><td className="p-3 whitespace-nowrap">{r.createdAt.toLocaleDateString("en-NG")}</td></tr>)}</tbody></table></div>}</>);
}
