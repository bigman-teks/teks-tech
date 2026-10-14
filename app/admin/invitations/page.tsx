import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
const SOURCE_LABEL: Record<string, string> = { TEMPLATE: "Template", UPLOADED_FLYER: "Flyer", SCRATCH: "Scratch" };
export default async function Page() {
  const rows = await prisma.invitation.findMany({ orderBy: { createdAt: "desc" }, take: 200, include: { user: { select: { name: true } }, template: { select: { name: true } }, _count: { select: { rsvps: true } } } });
  return (<><h1 className="mb-4 text-2xl font-bold">Invitations</h1>{!rows.length ? <div className="card text-center text-sm">No invitations yet.</div> : <div className="overflow-x-auto rounded-2xl border border-white/10"><table className="w-full min-w-[640px] text-left text-sm"><thead className="bg-navy text-xs text-slate2"><tr>{["Event", "Owner", "Template", "Status", "RSVPs", "Link", "Created"].map((h) => <th key={h} className="p-3">{h}</th>)}</tr></thead>
    <tbody>{rows.map((i) => <tr key={i.id} className="border-t border-white/10"><td className="p-3">{i.hostName} — {i.eventTitle}</td><td className="p-3">{i.user.name}</td><td className="p-3">{i.template?.name ?? SOURCE_LABEL[i.sourceType]}</td><td className="p-3">{i.status}</td><td className="p-3 font-mono">{i._count.rsvps}</td><td className="p-3">{i.slug ? <a className="text-bright" href={`/i/${i.slug}`} target="_blank">/i/{i.slug}</a> : "—"}</td><td className="p-3 whitespace-nowrap">{i.createdAt.toLocaleDateString("en-NG")}</td></tr>)}</tbody></table></div>}</>);
}
