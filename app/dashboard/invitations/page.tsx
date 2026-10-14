import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import InvitationActions from "@/components/InvitationActions";
const LABEL: Record<string, string> = { DRAFT: "Draft", PENDING_PAYMENT: "Pending Payment", PUBLISHED: "Published", EXPIRED: "Expired", ARCHIVED: "Archived" };
const SOURCE_LABEL: Record<string, string> = { TEMPLATE: "Template", UPLOADED_FLYER: "Flyer", SCRATCH: "Scratch" };
export default async function Page() {
  const rows = await prisma.invitation.findMany({ where: { userId: (await getSession())!.sub }, orderBy: { updatedAt: "desc" }, include: { _count: { select: { rsvps: true } } } });
  return (<><div className="mb-4 flex items-center justify-between"><h1 className="text-2xl font-bold">My Invitations</h1><Link href="/invitations/create" className="btn-primary !py-2">Create Invitation</Link></div>
    {!rows.length ? <div className="card text-center">No invitations yet. Create your first invitation.</div> :
      <div className="overflow-x-auto rounded-2xl border border-white/10"><table className="w-full min-w-[640px] text-left text-sm"><thead className="bg-navy text-xs text-slate2"><tr>{["Invitation", "Event", "Status", "RSVPs", "Created", "Actions"].map((h) => <th key={h} className="p-3">{h}</th>)}</tr></thead>
        <tbody>{rows.map((r) => <tr key={r.id} className="border-t border-white/10 align-top"><td className="p-3">{r.hostName}<span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate2">{SOURCE_LABEL[r.sourceType]}</span></td><td className="p-3">{r.eventTitle}</td><td className="p-3">{LABEL[r.status]}</td><td className="p-3 font-mono">{r._count.rsvps}</td><td className="p-3 whitespace-nowrap">{r.createdAt.toLocaleDateString("en-NG")}</td><td className="p-3"><InvitationActions id={r.id} slug={r.slug} published={r.status === "PUBLISHED"} /></td></tr>)}</tbody></table></div>}</>);
}
