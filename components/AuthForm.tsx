"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const r = useRouter(), next = useSearchParams().get("next");
  const [busy, setBusy] = useState(false), [err, setErr] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setErr("");
    const body: Record<string, string> = {};
    new FormData(e.currentTarget).forEach((v, k) => { body[k] = String(v); });
    try {
      const res = await fetch(`/api/auth/${mode}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const j = await res.json();
      if (!res.ok) { setErr(j.error ?? "Something went wrong. Please try again."); return; }
      r.push(next && next.startsWith("/") ? next : j.user.role === "ADMIN" ? "/admin" : "/dashboard"); r.refresh();
    } catch { setErr("Network error. Check your connection and try again."); } finally { setBusy(false); }
  }
  const f = "mt-1 w-full rounded-lg border border-white/15 bg-charcoal px-3 py-2.5 text-sm outline-none focus:border-bright";
  return (
    <main className="grid min-h-screen place-items-center px-5">
      <form onSubmit={submit} className="card w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">{mode === "login" ? "Welcome back" : "Create your account"}</h1>
        {mode === "register" && <label className="block text-sm">Full name<input name="name" required minLength={2} className={f} autoComplete="name" /></label>}
        <label className="block text-sm">Email<input name="email" type="email" required className={f} autoComplete="email" /></label>
        {mode === "register" && <label className="block text-sm">Phone (optional)<input name="phone" type="tel" className={f} autoComplete="tel" /></label>}
        <label className="block text-sm">Password<input name="password" type="password" required minLength={mode === "register" ? 8 : 1} className={f} autoComplete={mode === "login" ? "current-password" : "new-password"} /></label>
        {err && <p role="alert" className="text-sm text-red-400">{err}</p>}
        <button disabled={busy} className="btn-primary w-full disabled:opacity-60">{busy ? (mode === "login" ? "Signing in..." : "Creating account...") : mode === "login" ? "Log in" : "Register"}</button>
        <p className="text-center text-sm text-slate2">{mode === "login" ? <>No account? <Link className="text-bright" href="/register">Register</Link></> : <>Already registered? <Link className="text-bright" href="/login">Log in</Link></>}</p>
      </form>
    </main>
  );
}
