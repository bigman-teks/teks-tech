"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { RESOURCES, Field } from "@/lib/adminResources";
const naira = (k: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(k / 100);
const inp = "mt-1 w-full rounded-lg border border-white/15 bg-charcoal px-3 py-2 text-sm";
function toForm(f: Field[], row: any) { const o: any = {}; for (const x of f) { const v = row?.[x.name]; o[x.name] = x.type === "money" ? (v == null ? "" : String(v / 100)) : x.type === "list" ? (v ?? []).join("\n") : x.type === "json" ? JSON.stringify(v ?? {}, null, 2) : x.type === "bool" ? (v ?? false) : x.type === "number" ? (v ?? 0) : (v ?? (x.type === "select" ? x.options![0] : "")); } return o; }
function toBody(f: Field[], v: any) {
  const o: any = {};
  for (const x of f) {
    const raw = v[x.name];
    if (x.type === "money") o[x.name] = raw === "" ? null : Math.round(Number(raw) * 100);
    else if (x.type === "list") o[x.name] = String(raw).split("\n").map((s) => s.trim()).filter(Boolean);
    else if (x.type === "json") o[x.name] = JSON.parse(raw || "{}");
    else if (x.type === "number") o[x.name] = Number(raw);
    else if (x.type === "text" || x.type === "textarea" || x.type === "image") o[x.name] = raw === "" ? (x.required ? "" : null) : raw;
    else o[x.name] = raw;
  }
  return o;
}
export default function AdminCrud({ resource, rows }: { resource: string; rows: any[] }) {
  const R = RESOURCES[resource], r = useRouter();
  const [edit, setEdit] = useState<any | null>(null), [form, setForm] = useState<any>({}), [msg, setMsg] = useState(""), [err, setErr] = useState(""), [busy, setBusy] = useState(false);
  const open = (row: any | null) => { setEdit(row ?? {}); setForm(toForm(R.fields, row)); setErr(""); setMsg(""); };
  async function up(name: string, file?: File) {
    if (!file) return; const fd = new FormData(); fd.append("file", file); setMsg("Uploading...");
    const x = await fetch("/api/upload", { method: "POST", body: fd }); const j = await x.json();
    if (x.ok) { setForm((p: any) => ({ ...p, [name]: j.url })); setMsg(""); } else { setMsg(""); setErr(j.error ?? "Upload failed."); }
  }
  async function save(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setErr(""); setMsg("Saving...");
    try {
      const body = toBody(R.fields, form), id = edit?.id;
      const x = await fetch(id ? `/api/admin/${resource}/${id}` : `/api/admin/${resource}`, { method: id ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const j = await x.json(); if (!x.ok) { setErr(j.error ?? "Something went wrong."); setMsg(""); return; }
      setMsg("Saved successfully."); setEdit(null); r.refresh();
    } catch (e: any) { setErr(e instanceof SyntaxError ? "The JSON is not valid." : "Something went wrong. Please try again."); setMsg(""); } finally { setBusy(false); }
  }
  async function del(id: string) { if (!confirm("Delete this item?")) return; const x = await fetch(`/api/admin/${resource}/${id}`, { method: "DELETE" }); const j = await x.json(); if (x.ok) { setMsg("Deleted."); r.refresh(); } else setErr(j.error); }
  const cell = (row: any, c: string) => { const v = row[c]; return c.endsWith("Kobo") ? (v == null ? "Not set" : naira(v)) : typeof v === "boolean" ? (v ? "Yes" : "No") : String(v ?? ""); };
  return (<div>
    <div className="mb-4 flex items-center justify-between"><h1 className="text-2xl font-bold">{R.title}</h1>{!R.noCreate && <button className="btn-primary !py-2" onClick={() => open(null)}>Add</button>}</div>
    {(msg || err) && <p role="status" className={`mb-3 text-sm ${err ? "text-red-400" : "text-green-400"}`}>{err || msg}</p>}
    {edit && <form onSubmit={save} className="card mb-6 grid gap-3 sm:grid-cols-2">{R.fields.map((f) => (
      <label key={f.name} className={`text-sm ${["textarea", "json", "list"].includes(f.type) ? "sm:col-span-2" : ""}`}>{f.label}
        {f.type === "textarea" || f.type === "json" || f.type === "list" ? <textarea rows={f.type === "json" ? 6 : 3} className={inp + (f.type === "json" ? " font-mono" : "")} value={form[f.name]} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} />
          : f.type === "select" ? <select className={inp} value={form[f.name]} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}>{f.options!.map((o) => <option key={o}>{o}</option>)}</select>
          : f.type === "bool" ? <input type="checkbox" className="ml-2 h-4 w-4 align-middle" checked={form[f.name]} onChange={(e) => setForm({ ...form, [f.name]: e.target.checked })} />
          : f.type === "image" ? <span className="block"><input className={inp} value={form[f.name]} placeholder="https://..." onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} /><input type="file" accept="image/jpeg,image/png,image/webp" className="mt-1 text-xs" onChange={(e) => up(f.name, e.target.files?.[0])} /></span>
          : <input className={inp} type={f.type === "number" || f.type === "money" ? "number" : "text"} step={f.type === "money" ? "0.01" : undefined} min={0} value={form[f.name]} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} required={f.required && f.type !== "money"} />}
      </label>))}
      <div className="flex gap-2 sm:col-span-2"><button disabled={busy} className="btn-primary !py-2">Save</button><button type="button" className="btn-ghost !py-2" onClick={() => setEdit(null)}>Cancel</button></div></form>}
    {!rows.length ? <div className="card text-center text-sm">Nothing here yet.</div> :
      <div className="overflow-x-auto rounded-2xl border border-white/10"><table className="w-full min-w-[520px] text-left text-sm"><thead className="bg-navy text-xs text-slate2"><tr>{R.cols.map((c) => <th key={c} className="p-3">{c}</th>)}<th className="p-3" /></tr></thead>
        <tbody>{rows.map((row) => <tr key={row.id} className="border-t border-white/10">{R.cols.map((c) => <td key={c} className="p-3">{cell(row, c)}</td>)}<td className="p-3 text-right whitespace-nowrap"><button className="mr-2 text-bright" onClick={() => open(row)}>Edit</button>{!R.noDelete && <button className="text-red-400" onClick={() => del(row.id)}>Delete</button>}</td></tr>)}</tbody></table></div>}
  </div>);
}
