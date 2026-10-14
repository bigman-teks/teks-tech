import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
export default async function Page() {
  const uid = (await getSession())!.sub;
  const [total, published, drafts, rsvps] = await Promise.all([
    prisma.invitation.count({ where: { userId: uid } }), prisma.invitation.count({ where: { userId: uid, status: "PUBLISHED" } }),
    prisma.invitation.count({ where: { userId: uid, status: "DRAFT" } }), prisma.rsvp.count({ where: { invitation: { userId: uid } } }),
  ]);
  const cards = [["Total Invitations", total], ["Published", published], ["Drafts", drafts], ["Total RSVPs", rsvps]];
  return (<><h1 className="mb-4 text-2xl font-bold">Dashboard</h1>
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">{cards.map(([l, v]) => <div key={l as string} className="card"><p className="text-xs text-slate2">{l}</p><p className="mt-1 font-mono text-3xl">{v}</p></div>)}</div>
    {total === 0 && <div className="card mt-6 text-center"><p>No invitations yet. Create your first invitation.</p><Link href="/invitations/create" className="btn-primary mt-4">Create Invitation</Link></div>}</>);
}
