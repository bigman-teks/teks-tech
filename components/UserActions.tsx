"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function UserActions({ id, status }: { id: string; status: string }) {
  const r = useRouter(), [err, setErr] = useState("");
  async function go() {
    const next = status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    if (next === "SUSPENDED" && !confirm("Suspend this account?")) return;
    const x = await fetch(`/api/admin/users/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: next }) });
    if (x.ok) r.refresh(); else setErr((await x.json()).error ?? "Something went wrong.");
  }
  return <span><button onClick={go} className="text-bright">{status === "ACTIVE" ? "Suspend" : "Reactivate"}</button>{err && <span className="ml-2 text-xs text-red-400">{err}</span>}</span>;
}
