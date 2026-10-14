"use client";
import { useState } from "react";
import InvitationView, { InvData } from "./InvitationView";
import { EVENT_CATEGORIES } from "@/lib/content";
import TemplatePreviewModal from "./TemplatePreviewModal";
import { uploadFile as upload } from "@/lib/clientUpload";
const STEPS = ["Template", "Details", "Photos", "Design", "RSVP", "Extras", "Preview", "Payment", "Publish"];
const TYPES = EVENT_CATEGORIES;
const DEF_THEME = { primary: "#2563EB", secondary: "#F8FAFC", background: "#0F172A", font: "serif" };
type Photos = { main?: string; person?: string; background?: string; gallery?: string[] };
function Uploader({ label, accept, multiple, onDone }: { label: string; accept: string; multiple?: boolean; onDone: (urls: string[]) => void }) {
  const [pct, setPct] = useState<number | null>(null), [err, setErr] = useState("");
  async function go(files: FileList | null) {
    if (!files?.length) return; setErr(""); const urls: string[] = [];
    try { for (const f of Array.from(files)) { setPct(0); urls.push(await upload(f, setPct)); } onDone(urls); } catch (e: any) { setErr(e.message); } finally { setPct(null); }
  }
  return (
    <div onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); go(e.dataTransfer.files); }} className="rounded-xl border border-dashed border-white/25 p-4 text-center text-sm">
      <p className="font-medium">{label}</p>
      <label className="btn-ghost mt-2 cursor-pointer !py-2">Choose file{multiple ? "s" : ""}<input type="file" hidden accept={accept} multiple={multiple} onChange={(e) => go(e.target.files)} /></label>
      <p className="mt-2 text-xs text-slate2">or drag and drop here</p>
      {pct !== null && <div className="mt-3 h-2 overflow-hidden rounded bg-white/10"><div className="h-full bg-bright transition-all" style={{ width: `${pct}%` }} /></div>}
      {err && <p role="alert" className="mt-2 text-red-400">{err}</p>}
    </div>
  );
}
function ListEditor<T extends Record<string, any>>({ items, setItems, empty, fields, addLabel }: { items: T[]; setItems: (v: T[]) => void; empty: T; fields: { key: keyof T; label: string; type?: "text" | "textarea" }[]; addLabel: string }) {
  const inp = "mt-1 w-full rounded-lg border border-white/15 bg-charcoal px-3 py-2 text-sm";
  const update = (i: number, k: keyof T, v: string) => setItems(items.map((it, idx) => (idx === i ? { ...it, [k]: v } : it)));
  const move = (i: number, dir: -1 | 1) => { const j = i + dir; if (j < 0 || j >= items.length) return; const next = items.slice(); [next[i], next[j]] = [next[j], next[i]]; setItems(next); };
  return (
    <div className="space-y-3">
      {items.map((it, i) => (
        <div key={i} className="rounded-xl border border-white/10 p-3">
          <div className="grid gap-2 sm:grid-cols-2">
            {fields.map((f) => (
              <label key={String(f.key)} className="block text-xs text-slate2">{f.label}
                {f.type === "textarea" ? <textarea rows={2} className={inp} value={it[f.key] ?? ""} onChange={(e) => update(i, f.key, e.target.value)} />
                  : <input className={inp} value={it[f.key] ?? ""} onChange={(e) => update(i, f.key, e.target.value)} />}
              </label>
            ))}
          </div>
          <div className="mt-2 flex gap-3 text-xs">
            <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="text-slate2 disabled:opacity-30">Move up</button>
            <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} className="text-slate2 disabled:opacity-30">Move down</button>
            <button type="button" onClick={() => setItems(items.filter((_, idx) => idx !== i))} className="text-red-400">Remove</button>
          </div>
        </div>
      ))}
      <button type="button" onClick={() => setItems([...items, { ...empty }])} className="btn-ghost w-full !py-2">{addLabel}</button>
    </div>
  );
}

export default function Builder({ templates, packages, draft, initialStep = 0, mode = "template", initialTemplateId, initialFlyerUrl }: { templates: any[]; packages: any[]; draft: any; initialStep?: number; mode?: "template" | "scratch" | "flyer"; initialTemplateId?: string; initialFlyerUrl?: string }) {
  const preselected = !draft && mode === "template" && initialTemplateId ? templates.find((t) => t.id === initialTemplateId) : null;
  const skipsTemplate = mode === "scratch" || mode === "flyer";
  const defaultStep = initialStep || (draft ? 0 : skipsTemplate ? 1 : preselected ? 1 : 0);
  const minStep = skipsTemplate ? 1 : 0;
  const [step, setStep] = useState(Math.min(Math.max(defaultStep, minStep), 8)), [id, setId] = useState<string | null>(draft?.id ?? null), [msg, setMsg] = useState(""), [err, setErr] = useState(""), [busy, setBusy] = useState(false);
  const [view, setView] = useState<"mobile" | "tablet" | "desktop">("mobile"), [slug, setSlug] = useState<string | null>(draft?.slug ?? null);
  const [preview, setPreview] = useState<any | null>(null);
  const [d, setD] = useState({
    templateId: draft?.templateId ?? preselected?.id ?? "", packageId: draft?.packageId ?? "", eventType: draft?.eventType ?? preselected?.category ?? "Wedding", eventTitle: draft?.eventTitle ?? "", hostName: draft?.hostName ?? "",
    date: draft?.date ? draft.date.slice(0, 10) : "", startTime: draft?.startTime ?? "", endTime: draft?.endTime ?? "", venue: draft?.venue ?? "", address: draft?.address ?? "", mapUrl: draft?.mapUrl ?? "", description: draft?.description ?? "",
    photos: { ...(draft?.photos ?? {}), background: draft?.photos?.background ?? (mode === "flyer" ? initialFlyerUrl : undefined) } as Photos,
    theme: { ...DEF_THEME, ...(draft?.theme ?? preselected?.configuration?.theme ?? {}) }, music: draft?.music ?? "", rsvpEnabled: draft?.rsvpEnabled ?? true,
    originalFlyerUrl: draft?.originalFlyerUrl ?? (mode === "flyer" ? initialFlyerUrl : null) ?? null,
    hashtag: draft?.hashtag ?? "",
    personalMessage: { heading: draft?.personalMessage?.heading ?? "", message: draft?.personalMessage?.message ?? "", signature: draft?.personalMessage?.signature ?? "" },
    dressCode: { title: draft?.dressCode?.title ?? "", description: draft?.dressCode?.description ?? "", colorsText: (draft?.dressCode?.colors ?? []).join(", ") },
  });
  const [programme, setProgramme] = useState<{ time: string; title: string; description: string }[]>((draft?.programme ?? []).map((p: any) => ({ time: p.time ?? "", title: p.title ?? "", description: p.description ?? "" })));
  const [contacts, setContacts] = useState<{ role: string; name: string; phone: string; whatsapp: string }[]>((draft?.contacts ?? []).map((c: any) => ({ role: c.role ?? "", name: c.name ?? "", phone: c.phone ?? "", whatsapp: c.whatsapp ?? "" })));
  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>((draft?.faqs ?? []).map((f: any) => ({ question: f.question ?? "", answer: f.answer ?? "" })));
  const set = (k: string, v: any) => setD((p) => ({ ...p, [k]: v }));
  const payload = () => ({
    ...d, templateId: d.templateId || null, sourceType: draft?.sourceType ?? (mode === "flyer" ? "UPLOADED_FLYER" : mode === "scratch" ? "SCRATCH" : "TEMPLATE"), packageId: d.packageId || null,
    date: d.date ? new Date(`${d.date}T${d.startTime || "12:00"}`).toISOString() : null, startTime: d.startTime || null, endTime: d.endTime || null, music: d.music || null,
    hashtag: d.hashtag || null,
    personalMessage: d.personalMessage.heading || d.personalMessage.message || d.personalMessage.signature ? d.personalMessage : null,
    dressCode: d.dressCode.title || d.dressCode.description || d.dressCode.colorsText ? { title: d.dressCode.title, description: d.dressCode.description, colors: d.dressCode.colorsText.split(",").map((s: string) => s.trim()).filter(Boolean) } : null,
    programme: programme.filter((p) => p.title.trim()), contacts: contacts.filter((c) => c.role.trim() && c.name.trim()), faqs: faqs.filter((f) => f.question.trim() && f.answer.trim()),
  });
  async function save(quiet = false): Promise<string | null> {
    if (mode === "template" && !d.templateId) { setErr("Choose a template first."); return null; }
    if (!d.eventTitle || !d.hostName) { setErr("Add the event title and host name to save."); setStep((s) => (s < 1 ? 1 : s)); return null; }
    setBusy(true); setErr(""); if (!quiet) setMsg("Saving invitation...");
    try {
      const r = await fetch(id ? `/api/invitations/${id}` : "/api/invitations", { method: id ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload()) });
      const j = await r.json(); if (!r.ok) { setErr(j.error ?? "Something went wrong. Please try again."); setMsg(""); return null; }
      setId(j.id); if (!quiet) setMsg("Invitation saved successfully."); return j.id;
    } catch { setErr("Network error. Please try again."); setMsg(""); return null; } finally { setBusy(false); }
  }
  async function next() {
    setErr("");
    if (mode === "template" && step === 0 && !d.templateId) return setErr("Please choose a template.");
    if (step === 1 && (!d.eventTitle || !d.hostName || !d.date || !d.venue)) return setErr("Event title, host name, date and venue are required.");
    if (step >= 1 && step < 8) await save(true);
    setStep(step + 1);
  }
  async function pay() {
    if (!d.packageId) return setErr("Choose a package first.");
    const iid = await save(true); if (!iid) return; setBusy(true); setMsg("Starting payment...");
    try {
      const r = await fetch("/api/payments/initialize", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ invitationId: iid }) }); const j = await r.json();
      if (!r.ok) { setErr(j.error ?? "Something went wrong. Please try again."); setMsg(""); }
      else if (j.free) { setMsg("No payment needed for this package."); setStep(8); }
      else window.location.href = j.url;
    } catch { setErr("Network error. Please try again."); setMsg(""); } finally { setBusy(false); }
  }
  async function publish() {
    const iid = await save(true); if (!iid) return; setBusy(true); setMsg("Publishing...");
    try {
      const r = await fetch(`/api/invitations/${iid}/publish`, { method: "POST" }); const j = await r.json();
      if (r.ok) { setSlug(j.slug); setMsg("Invitation published."); } else { setErr(j.error ?? "Something went wrong. Please try again."); setMsg(""); }
    } catch { setErr("Network error. Please try again."); } finally { setBusy(false); }
  }
  const inp = "mt-1 w-full rounded-lg border border-white/15 bg-charcoal px-3 py-2.5 text-sm outline-none focus:border-bright";
  const effectiveSourceType = draft?.sourceType ?? (mode === "flyer" ? "UPLOADED_FLYER" : mode === "scratch" ? "SCRATCH" : "TEMPLATE");
  const pv: InvData & { sourceType?: string } = {
    ...d, date: d.date ? new Date(d.date).toISOString() : null, photos: d.photos, theme: d.theme, sourceType: effectiveSourceType,
    personalMessage: d.personalMessage.heading || d.personalMessage.message || d.personalMessage.signature ? d.personalMessage : null,
    dressCode: d.dressCode.title || d.dressCode.description || d.dressCode.colorsText ? { title: d.dressCode.title, description: d.dressCode.description, colors: d.dressCode.colorsText.split(",").map((s: string) => s.trim()).filter(Boolean) } : null,
  };
  const link = slug && typeof window !== "undefined" ? `${window.location.origin}/i/${slug}` : "";
  const width = { mobile: 375, tablet: 768, desktop: 1024 }[view];
  return (
    <main className="container-x py-8">
      <ol className="mb-6 flex gap-1 overflow-x-auto pb-2" aria-label="Progress">
        {STEPS.map((s, i) => (skipsTemplate && i === 0) ? null : <li key={s} aria-current={i === step} className={`whitespace-nowrap rounded-full px-3 py-1.5 font-mono text-xs ${i === step ? "bg-electric" : i < step ? "bg-electric/25" : "bg-white/5 text-slate2"}`}>{String(i + 1).padStart(2, "0")} {s}</li>)}
      </ol>
      <section className="card min-h-[20rem]">
        {step === 0 && (templates.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{templates.map((t) => {
          const th = { primary: "#2563EB", secondary: "#F8FAFC", background: "#0F172A", ...(t.configuration?.theme ?? {}) };
          return (
          <div key={t.id} className={`overflow-hidden rounded-xl border ${d.templateId === t.id ? "border-bright" : "border-white/10"}`}>
            <button onClick={() => setPreview(t)} className="block h-32 w-full" aria-label={`Preview ${t.name}`} style={{ background: `linear-gradient(160deg,${th.primary},${th.background} 70%)` }}>
              <div className="flex h-full flex-col items-center justify-center gap-1 bg-black/10 p-3 text-center" style={{ color: th.secondary, fontFamily: t.configuration?.theme?.font === "sans" ? "var(--font-inter)" : t.configuration?.theme?.font === "display" ? "var(--font-grotesk)" : "Georgia, serif" }}>
                <p className="text-[10px] uppercase tracking-[0.25em] opacity-80">You&apos;re Invited</p>
                <p className="text-sm font-bold leading-tight">{t.category}</p>
                <div className="my-0.5 h-px w-8" style={{ background: th.secondary, opacity: 0.5 }} />
                <p className="text-[10px] opacity-70">Tap to preview</p>
              </div>
            </button>
            <div className="p-4">
              <p className="font-semibold">{t.name}</p><p className="text-xs text-slate2">{t.category}{t.style ? ` • ${t.style}` : ""} • {t.priceTier}</p>
              <div className="mt-3 flex gap-2">
                <button className="btn-ghost flex-1 !py-2" onClick={() => setPreview(t)}>Preview</button>
                <button className="btn-primary flex-1 !py-2" onClick={() => { set("templateId", t.id); if (t.configuration?.theme) set("theme", { ...DEF_THEME, ...t.configuration.theme }); set("eventType", t.category); }}>{d.templateId === t.id ? "Selected" : "Use Template"}</button>
              </div>
            </div>
          </div>); })}</div> : <p className="text-slate-300">No templates are available yet. Please check back soon.</p>)}
        {preview && <TemplatePreviewModal template={preview} onClose={() => setPreview(null)} onUse={() => { const t = preview; set("templateId", t.id); if (t.configuration?.theme) set("theme", { ...DEF_THEME, ...t.configuration.theme }); set("eventType", t.category); setPreview(null); }} />}
        {step === 1 && <div className="grid gap-4 sm:grid-cols-2">
          {mode === "flyer" && <p className="rounded-lg bg-electric/10 p-3 text-sm text-slate-200 sm:col-span-2">We couldn&apos;t read your flyer automatically yet, so please fill in your event details below — your flyer image is already set as the invitation background.</p>}
          <label className="text-sm">Event type<select className={inp} value={d.eventType} onChange={(e) => set("eventType", e.target.value)}>{TYPES.map((t) => <option key={t}>{t}</option>)}</select></label>
          <label className="text-sm">Event title *<input className={inp} value={d.eventTitle} onChange={(e) => set("eventTitle", e.target.value)} /></label>
          <label className="text-sm">Host / celebrant name *<input className={inp} value={d.hostName} onChange={(e) => set("hostName", e.target.value)} /></label>
          <label className="text-sm">Date *<input type="date" className={inp} value={d.date} onChange={(e) => set("date", e.target.value)} /></label>
          <label className="text-sm">Start time<input type="time" className={inp} value={d.startTime} onChange={(e) => set("startTime", e.target.value)} /></label>
          <label className="text-sm">End time<input type="time" className={inp} value={d.endTime} onChange={(e) => set("endTime", e.target.value)} /></label>
          <label className="text-sm">Venue *<input className={inp} value={d.venue} onChange={(e) => set("venue", e.target.value)} /></label>
          <label className="text-sm">Address<input className={inp} value={d.address} onChange={(e) => set("address", e.target.value)} /></label>
          <label className="text-sm sm:col-span-2">Google Maps link (optional — guests get a Location button either way)<input className={inp} placeholder="https://maps.google.com/..." value={d.mapUrl} onChange={(e) => set("mapUrl", e.target.value)} /></label>
          <label className="text-sm sm:col-span-2">Event description<textarea rows={4} maxLength={2000} className={inp} value={d.description} onChange={(e) => set("description", e.target.value)} /></label></div>}
        {step === 2 && <div className="grid gap-4 sm:grid-cols-2">
          {d.originalFlyerUrl && <div className="sm:col-span-2">
            <p className="mb-2 text-sm font-medium">Your uploaded flyer</p>
            <div className="flex items-center gap-4 rounded-xl border border-white/10 p-3">
              <img src={d.originalFlyerUrl} alt="Your uploaded flyer" className="h-20 w-20 rounded-lg object-cover" />
              <div className="text-sm text-slate-300">
                <p>This is set as your invitation&apos;s background so your original design stays visible behind the digital details below.</p>
                {d.photos.background !== d.originalFlyerUrl && <button type="button" className="mt-2 text-bright" onClick={() => set("photos", { ...d.photos, background: d.originalFlyerUrl })}>Restore as background</button>}
              </div>
            </div>
          </div>}
          {([["main", "Main photo"], ["person", "Couple / celebrant photo"], ["background", d.originalFlyerUrl ? "Background image (your flyer, or replace it)" : "Background image"]] as const).map(([k, l]) => <div key={k}><Uploader label={l} accept="image/jpeg,image/png,image/webp" onDone={([u]) => set("photos", { ...d.photos, [k]: u })} />{d.photos[k] && <img src={d.photos[k]} alt="" className="mt-2 h-20 rounded object-cover" />}</div>)}
          <div><Uploader label="Gallery photos (up to 12)" multiple accept="image/jpeg,image/png,image/webp" onDone={(u) => set("photos", { ...d.photos, gallery: [...(d.photos.gallery ?? []), ...u].slice(0, 12) })} />
            <div className="mt-2 flex flex-wrap gap-2">{d.photos.gallery?.map((g) => <button key={g} title="Remove" onClick={() => set("photos", { ...d.photos, gallery: d.photos.gallery!.filter((x) => x !== g) })}><img src={g} alt="" className="h-14 w-14 rounded object-cover" /></button>)}</div></div>
          <p className="text-xs text-slate2 sm:col-span-2">JPG, PNG or WebP, up to 5MB each.</p></div>}
        {step === 3 && <div className="grid gap-4 sm:grid-cols-2">
          {(["primary", "secondary", "background"] as const).map((k) => <label key={k} className="text-sm capitalize">{k} colour<input type="color" className="mt-1 h-11 w-full rounded-lg bg-charcoal" value={(d.theme as any)[k]} onChange={(e) => set("theme", { ...d.theme, [k]: e.target.value })} /></label>)}
          <label className="text-sm">Font<select className={inp} value={d.theme.font} onChange={(e) => set("theme", { ...d.theme, font: e.target.value })}><option value="serif">Elegant serif</option><option value="sans">Clean sans</option><option value="display">Modern display</option><option value="mono">Mono</option></select></label>
          <div className="sm:col-span-2"><Uploader label="Optional background music (MP3, up to 10MB)" accept="audio/mpeg,audio/mp4,audio/wav" onDone={([u]) => set("music", u)} />{d.music && <p className="mt-2 text-xs text-slate-300">Music added. Guests get a mute/unmute button. <button className="text-bright" onClick={() => set("music", "")}>Remove</button></p>}</div></div>}
        {step === 4 && <label className="flex items-center gap-3 text-sm"><input type="checkbox" className="h-5 w-5" checked={d.rsvpEnabled} onChange={(e) => set("rsvpEnabled", e.target.checked)} />Enable RSVP (guests give name, phone, email, number of guests, attendance and a message)</label>}
        {step === 5 && <div className="space-y-8">
          <div>
            <h3 className="font-semibold">Personal Message</h3>
            <p className="mb-3 text-xs text-slate2">A short note from you to your guests, shown on the invitation. Optional.</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm">Heading<input className={inp} placeholder="A Note From Us" value={d.personalMessage.heading} onChange={(e) => set("personalMessage", { ...d.personalMessage, heading: e.target.value })} /></label>
              <label className="text-sm">Signature<input className={inp} placeholder="John & Mary" value={d.personalMessage.signature} onChange={(e) => set("personalMessage", { ...d.personalMessage, signature: e.target.value })} /></label>
              <label className="text-sm sm:col-span-2">Message<textarea rows={3} className={inp} placeholder="We would be delighted to celebrate this special moment with you." value={d.personalMessage.message} onChange={(e) => set("personalMessage", { ...d.personalMessage, message: e.target.value })} /></label>
            </div>
          </div>
          <div>
            <h3 className="font-semibold">Dress Code</h3>
            <p className="mb-3 text-xs text-slate2">Optional.</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm">Title<input className={inp} placeholder="Black Tie" value={d.dressCode.title} onChange={(e) => set("dressCode", { ...d.dressCode, title: e.target.value })} /></label>
              <label className="text-sm">Suggested colours (comma separated)<input className={inp} placeholder="Gold, Ivory" value={d.dressCode.colorsText} onChange={(e) => set("dressCode", { ...d.dressCode, colorsText: e.target.value })} /></label>
              <label className="text-sm sm:col-span-2">Description<textarea rows={2} className={inp} value={d.dressCode.description} onChange={(e) => set("dressCode", { ...d.dressCode, description: e.target.value })} /></label>
            </div>
          </div>
          <div>
            <h3 className="font-semibold">Social Hashtag</h3>
            <label className="mt-3 block text-sm sm:w-1/2"><input className={inp} placeholder="#JohnAndMary2027" value={d.hashtag} onChange={(e) => set("hashtag", e.target.value)} /></label>
          </div>
          <div>
            <h3 className="font-semibold">Programme / Schedule</h3>
            <p className="mb-3 text-xs text-slate2">Optional. The order of your guest list.</p>
            <ListEditor items={programme} setItems={setProgramme} empty={{ time: "", title: "", description: "" }} addLabel="Add Programme Item"
              fields={[{ key: "time", label: "Time (e.g. 10:00 AM)" }, { key: "title", label: "Title" }, { key: "description", label: "Description", type: "textarea" }]} />
          </div>
          <div>
            <h3 className="font-semibold">Contacts</h3>
            <p className="mb-3 text-xs text-slate2">Optional. Guests can call or WhatsApp these directly.</p>
            <ListEditor items={contacts} setItems={setContacts} empty={{ role: "", name: "", phone: "", whatsapp: "" }} addLabel="Add Contact"
              fields={[{ key: "role", label: "Role (e.g. Bride, Event Coordinator)" }, { key: "name", label: "Name" }, { key: "phone", label: "Phone" }, { key: "whatsapp", label: "WhatsApp number" }]} />
          </div>
          <div>
            <h3 className="font-semibold">FAQ</h3>
            <p className="mb-3 text-xs text-slate2">Optional.</p>
            <ListEditor items={faqs} setItems={setFaqs} empty={{ question: "", answer: "" }} addLabel="Add Question"
              fields={[{ key: "question", label: "Question" }, { key: "answer", label: "Answer", type: "textarea" }]} />
          </div>
        </div>}
        {step === 6 && <div><div className="mb-3 flex gap-2">{(["mobile", "tablet", "desktop"] as const).map((v) => <button key={v} onClick={() => setView(v)} className={`rounded-lg px-3 py-1.5 text-sm capitalize ${view === v ? "bg-electric" : "bg-white/5"}`}>{v}</button>)}</div>
          <div className="overflow-auto rounded-xl border border-white/10 bg-black/40 p-3"><div className="mx-auto" style={{ width: Math.min(width, 1100), maxWidth: "100%" }}><InvitationView inv={pv} programme={programme} contacts={contacts} faqs={faqs} /></div></div></div>}
        {step === 7 && <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{packages.length ? packages.map((p) => (
          <button key={p.id} onClick={() => set("packageId", p.id)} className={`rounded-xl border p-4 text-left ${d.packageId === p.id ? "border-bright bg-electric/10" : "border-white/10"}`}>
            <p className="font-display font-semibold">{p.name}</p>
            <p className="mt-1 font-mono text-lg">{p.isQuote ? "Request a Quote" : p.priceKobo == null ? "Price not set" : new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(p.priceKobo / 100)}</p>
            <ul className="mt-2 space-y-1 text-xs text-slate-300">{(p.features as string[]).map((f) => <li key={f}>• {f}</li>)}</ul></button>)) : <p className="text-slate-300">No packages are available yet.</p>}
          <p className="text-xs text-slate2 sm:col-span-2 lg:col-span-4">Payments are processed by Paystack and confirmed on our server before your invitation can be published.</p>
          <div className="sm:col-span-2 lg:col-span-4">{packages.find((p) => p.id === d.packageId)?.isQuote ? <a className="btn-primary" href="/#contact">Request a Quote</a> : <button disabled={busy || !d.packageId} onClick={pay} className="btn-primary disabled:opacity-60">Pay with Paystack</button>}</div></div>}
        {step === 8 && <div className="space-y-4 text-sm">
          {slug ? <><p className="text-green-400">Your invitation is live.</p><p className="break-all font-mono text-bright">{link}</p>
            <div className="flex flex-wrap gap-2"><button className="btn-ghost" onClick={() => navigator.clipboard.writeText(link).then(() => setMsg("Link copied."))}>Copy Link</button>
              <a className="btn-ghost" target="_blank" rel="noopener" href={`https://wa.me/?text=${encodeURIComponent(link)}`}>Share on WhatsApp</a>
              <a className="btn-primary" target="_blank" rel="noopener" href={`/i/${slug}`}>View Invitation</a></div></>
            : <><p className="text-slate-300">Publishing creates a unique link like /i/john-and-mary that you can share with guests.</p><button disabled={busy} onClick={publish} className="btn-primary disabled:opacity-60">Publish</button></>}</div>}
      </section>
      <div aria-live="polite" className="mt-3 min-h-6 text-sm">{err ? <p role="alert" className="text-red-400">{err}</p> : <p className="text-green-400">{msg}</p>}</div>
      <div className="mt-2 flex flex-wrap justify-between gap-2">
        <button className="btn-ghost" disabled={step === minStep} onClick={() => setStep(step - 1)}>Back</button>
        <div className="flex gap-2"><button className="btn-ghost" disabled={busy} onClick={() => save()}>Save Draft</button>{step < 8 && <button className="btn-primary" disabled={busy} onClick={next}>Next</button>}</div>
      </div>
    </main>
  );
}
