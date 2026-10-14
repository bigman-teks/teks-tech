import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import Chart from "@/components/BarChart";
const LABEL: Record<string, string> = { ATTENDING: "Attending", MAYBE: "Maybe", NOT_ATTENDING: "Not attending" };
export default async function Page({ searchParams }: { searchParams: { inv?: string } }) {
  const uid = (await getSession())!.sub;
  const invs = await prisma.invitation.findMany({ where: { userId: uid }, orderBy: { updatedAt: "desc" }, select: { id: true, hostName: true, eventTitle: true, packageId: true } });
  if (!invs.length) return <div className="card text-center">No invitations yet. Create your first invitation.</div>;
  const cur = invs.find((i) => i.id === searchParams.inv) ?? invs[0];
  const rows = await prisma.rsvp.findMany({ where: { invitationId: cur.id }, orderBy: { createdAt: "desc" } });
  const att = rows.filter((r) => r.attendance === "ATTENDING"), maybe = rows.filter((r) => r.attendance === "MAYBE"), no = rows.filter((r) => r.attendance === "NOT_ATTENDING");
  const stats = [["Total RSVPs", rows.length], ["Attending", att.length], ["Maybe", maybe.length], ["Not Attending", no.length], ["Total Guests", att.reduce((n, r) => n + r.guests, 0)]];
  const eligible = cur.packageId === "PREMIUM";
  let a: { name: string; value: number }[] = [];
  if (eligible) {
    const ev = await prisma.analyticsEvent.findMany({ where: { invitationId: cur.id }, select: { type: true, visitorId: true } });
    const c = (t: string) => ev.filter((e) => e.type === t).length;
    a = [{ name: "Views", value: c("VIEW") }, { name: "Unique", value: new Set(ev.filter((e) => e.type === "VIEW" && e.visitorId).map((e) => e.visitorId)).size }, { name: "RSVPs", value: rows.length }, { name: "Shares", value: c("SHARE") }, { name: "WhatsApp", value: c("WHATSAPP_CLICK") }, { name: "Map", value: c("MAP_CLICK") }];
  }
  return (<><h1 className="mb-3 text-2xl font-bold">RSVPs</h1>
    <div className="mb-4 flex flex-wrap gap-2">{invs.map((i) => <Link key={i.id} href={`/dashboard/rsvps?inv=${i.id}`} className={`rounded-lg px-3 py-1.5 text-sm ${i.id === cur.id ? "bg-electric" : "bg-white/5"}`}>{i.hostName} — {i.eventTitle}</Link>)}</div>
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-5">{stats.map(([l, v]) => <div key={l as string} className="card"><p className="text-xs text-slate2">{l}</p><p className="mt-1 font-mono text-2xl">{v}</p></div>)}</div>
    <p className="mt-2 text-xs text-slate2">Attendance figures are based on everyone who has submitted an RSVP so far.</p>
    <div className="mt-4 flex justify-end"><a className="btn-ghost !py-2" href={`/api/invitations/${cur.id}/rsvps`}>Export CSV</a></div>
    {!rows.length ? <div className="card mt-3 text-center">No RSVPs yet. Share your invitation link to start receiving responses.</div> :
      <div className="mt-3 overflow-x-auto rounded-2xl border border-white/10"><table className="w-full min-w-[600px] text-left text-sm"><thead className="bg-navy text-xs text-slate2"><tr>{["Name", "Phone", "Email", "Guests", "Status", "Date"].map((h) => <th key={h} className="p-3">{h}</th>)}</tr></thead>
        <tbody>{rows.map((r) => <tr key={r.id} className="border-t border-white/10"><td className="p-3">{r.name}</td><td className="p-3">{r.phone}</td><td className="p-3">{r.email}</td><td className="p-3 font-mono">{r.guests}</td><td className="p-3">{LABEL[r.attendance]}</td><td className="p-3 whitespace-nowrap">{r.createdAt.toLocaleDateString("en-NG")}</td></tr>)}</tbody></table></div>}
    <h2 className="mb-2 mt-8 text-lg font-semibold">Analytics</h2>
    {eligible ? <div className="card"><Chart data={a} /></div> : <div className="card text-sm text-slate-300">Analytics are included with the Premium package.</div>}</>);
}
