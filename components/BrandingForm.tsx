"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
type Founder = { name: string; title: string; bio: string; photoUrl: string | null };
async function upload(file: File): Promise<string> {
  const fd = new FormData(); fd.append("file", file);
  const r = await fetch("/api/upload", { method: "POST", body: fd });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error ?? "Upload failed. Please try again.");
  return j.url;
}
function PhotoField({ label, url, onChange, round }: { label: string; url: string | null; onChange: (u: string) => void; round?: boolean }) {
  const [busy, setBusy] = useState(false), [err, setErr] = useState("");
  async function go(f: File | undefined) {
    if (!f) return; setBusy(true); setErr("");
    try { onChange(await upload(f)); } catch (e: any) { setErr(e.message); } finally { setBusy(false); }
  }
  return (
    <div>
      <p className="mb-2 text-sm font-medium">{label}</p>
      <div className="flex items-center gap-4">
        {url ? <img src={url} alt="" className={`h-24 w-24 object-cover ${round ? "rounded-full" : "rounded-xl"} border border-white/10`} />
          : <div className={`grid h-24 w-24 place-items-center border border-dashed border-white/25 text-xs text-slate2 ${round ? "rounded-full" : "rounded-xl"}`}>No image</div>}
        <div>
          <label className="btn-ghost cursor-pointer !py-2">{busy ? "Uploading..." : "Choose file"}<input type="file" hidden accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={(e) => go(e.target.files?.[0])} /></label>
          {url && <button type="button" onClick={() => onChange("")} className="ml-2 text-xs text-red-400">Remove</button>}
          {err && <p role="alert" className="mt-1 text-xs text-red-400">{err}</p>}
        </div>
      </div>
    </div>
  );
}
export default function BrandingForm({ founder, logoUrl }: { founder: Founder; logoUrl: string | null }) {
  const r = useRouter();
  const [f, setF] = useState(founder), [logo, setLogo] = useState(logoUrl ?? "");
  const [msgF, setMsgF] = useState(""), [msgL, setMsgL] = useState(""), [busy, setBusy] = useState(false);
  async function save(key: "founder" | "logo", value: any, setMsg: (s: string) => void) {
    setBusy(true); setMsg("Saving...");
    try {
      const x = await fetch("/api/admin/site-settings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key, value }) });
      const j = await x.json();
      setMsg(x.ok ? "Saved successfully." : j.error ?? "Something went wrong. Please try again.");
      if (x.ok) r.refresh();
    } catch { setMsg("Network error. Please try again."); } finally { setBusy(false); }
  }
  const inp = "mt-1 w-full rounded-lg border border-white/15 bg-charcoal px-3 py-2 text-sm";
  return (<div className="space-y-8">
    <section className="card">
      <h2 className="mb-4 font-semibold">Site Logo</h2>
      <PhotoField label="Logo (shown in the navbar and footer)" url={logo || null} onChange={setLogo} />
      <p className="mt-2 text-xs text-slate2">Leave empty to use the default text logo, &quot;TEKS TECH&quot;.</p>
      <button disabled={busy} onClick={() => save("logo", { url: logo || null }, setMsgL)} className="btn-primary mt-4 !py-2">Save Logo</button>
      {msgL && <p role="status" className="mt-2 text-sm text-slate-300">{msgL}</p>}
    </section>

    <section className="card">
      <h2 className="mb-4 font-semibold">Founder / About Page</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <PhotoField label="Photo" url={f.photoUrl} onChange={(u) => setF({ ...f, photoUrl: u || null })} round />
        <div className="space-y-4">
          <label className="block text-sm">Name<input className={inp} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></label>
          <label className="block text-sm">Title<input className={inp} value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></label>
        </div>
        <label className="block text-sm sm:col-span-2">Bio (each blank line starts a new paragraph)<textarea rows={8} className={inp} value={f.bio} onChange={(e) => setF({ ...f, bio: e.target.value })} /></label>
      </div>
      <button disabled={busy} onClick={() => save("founder", f, setMsgF)} className="btn-primary mt-4 !py-2">Save Founder Bio</button>
      {msgF && <p role="status" className="mt-2 text-sm text-slate-300">{msgF}</p>}
    </section>
  </div>);
}
