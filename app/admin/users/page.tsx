import Link from "next/link";
import { prisma } from "@/lib/prisma";
import UserActions from "@/components/UserActions";
export const dynamic = "force-dynamic";
export default async function Page({ searchParams }: { searchParams: { q?: string } }) {
  const q = searchParams.q?.trim();
  const rows = await prisma.user.findMany({ where: q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { email: { contains: q, mode: "insensitive" } }] } : {}, orderBy: { createdAt: "desc" }, take: 200, select: { id: true, name: true, email: true, phone: true, role: true, status: true, createdAt: true, _count: { select: { invitations: true } } } });
  return (<><h1 className="mb-3 text-2xl font-bold">Users</h1>
    <form className="mb-4 flex gap-2"><input name="q" defaultValue={q} placeholder="Search name or email" className="w-full max-w-xs rounded-lg border border-white/15 bg-charcoal px-3 py-2 text-sm" /><button className="btn-ghost !py-2">Search</button></form>
    {!rows.length ? <div className="card text-center text-sm">No users found.</div> : <div className="overflow-x-auto rounded-2xl border border-white/10"><table className="w-full min-w-[640px] text-left text-sm"><thead className="bg-navy text-xs text-slate2"><tr>{["Name", "Email", "Role", "Status", "Invitations", "Joined", ""].map((h) => <th key={h} className="p-3">{h}</th>)}</tr></thead>
      <tbody>{rows.map((u) => <tr key={u.id} className="border-t border-white/10"><td className="p-3"><Link className="text-bright" href={`/admin/users/${u.id}`}>{u.name}</Link></td><td className="p-3">{u.email}</td><td className="p-3">{u.role}</td><td className="p-3">{u.status}</td><td className="p-3 font-mono">{u._count.invitations}</td><td className="p-3 whitespace-nowrap">{u.createdAt.toLocaleDateString("en-NG")}</td><td className="p-3">{u.role !== "ADMIN" && <UserActions id={u.id} status={u.status} />}</td></tr>)}</tbody></table></div>}</>);
}
