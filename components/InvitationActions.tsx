"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function InvitationActions({ id, slug, published }: { id: string; slug: string | null; published: boolean }) {
  const r = useRouter(), [msg, setMsg] = useState("");
  const call = async (path: string, method: string, ok: string) => { setMsg(""); const x = await fetch(path, { method }); if (x.ok) { setMsg(ok); r.refresh(); } else setMsg("Something went wrong. Please try again."); };
  const share = async () => { const u = `${location.origin}/i/${slug}`; if (navigator.share) navigator.share({ url: u }).catch(() => {}); else { await navigator.clipboard.writeText(u); setMsg("Link copied."); } };
  const b = "rounded border border-white/15 px-2 py-1 text-xs hover:bg-white/5";
  return (<div className="flex flex-wrap items-center gap-1.5">
    {published && <Link className={b} href={`/i/${slug}`} target="_blank">View</Link>}
    <Link className={b} href={`/invitations/build?id=${id}`}>Edit</Link>
    <button className={b} onClick={() => call(`/api/invitations/${id}/duplicate`, "POST", "Invitation duplicated.")}>Duplicate</button>
    {published && <button className={b} onClick={share}>Share</button>}
    <button className={b + " text-red-400"} onClick={() => confirm("Delete this invitation and its RSVPs? This cannot be undone.") && call(`/api/invitations/${id}`, "DELETE", "Invitation deleted.")}>Delete</button>
    {msg && <span role="status" className="text-xs text-slate-300">{msg}</span>}</div>);
}
