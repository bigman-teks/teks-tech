"use client";
import { useState } from "react";
export default function ProfileForm({ name, phone, email }: { name: string; phone: string; email: string }) {
  const [msg, setMsg] = useState(""), [busy, setBusy] = useState(false);
  async function go(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setMsg("Saving...");
    const f = new FormData(e.currentTarget);
    try { const r = await fetch("/api/me", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: f.get("name"), phone: f.get("phone") || undefined }) }); setMsg(r.ok ? "Profile saved successfully." : "Something went wrong. Please try again."); }
    catch { setMsg("Network error. Please try again."); } finally { setBusy(false); }
  }
  const i = "mt-1 w-full rounded-lg border border-white/15 bg-charcoal px-3 py-2.5 text-sm";
  return <form onSubmit={go} className="card max-w-md space-y-4"><label className="block text-sm">Email<input disabled value={email} className={i + " opacity-60"} /></label><label className="block text-sm">Name<input name="name" defaultValue={name} required minLength={2} className={i} /></label><label className="block text-sm">Phone<input name="phone" defaultValue={phone} className={i} /></label><button disabled={busy} className="btn-primary">Save</button><p role="status" className="text-sm text-slate-300">{msg}</p></form>;
}
