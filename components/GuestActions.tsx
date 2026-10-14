"use client";
import { useEffect, useRef, useState } from "react";
type P = { slug: string; title: string; venue?: string | null; address?: string | null; mapUrl?: string | null; start?: string | null; rsvp: boolean; whatsapp?: boolean; music?: string | null; color: string };
const vid = () => { try { let v = localStorage.getItem("tk_vid"); if (!v) { v = crypto.randomUUID(); localStorage.setItem("tk_vid", v); } return v; } catch { return "anon"; } };
const track = (slug: string, type: string) => fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug, type, visitorId: vid() }), keepalive: true }).catch(() => {});
export function Countdown({ to }: { to: string }) {
  const [n, setN] = useState<number | null>(null);
  useEffect(() => { const t = () => setN(new Date(to).getTime() - Date.now()); t(); const i = setInterval(t, 1000); return () => clearInterval(i); }, [to]);
  if (n === null) return null;
  if (n <= 0) return <p className="mt-4 text-sm opacity-80">The celebration has begun!</p>;
  const u = [["Days", Math.floor(n / 864e5)], ["Hrs", Math.floor(n / 36e5) % 24], ["Min", Math.floor(n / 6e4) % 60], ["Sec", Math.floor(n / 1e3) % 60]];
  return <div className="mt-5 grid grid-cols-4 gap-2">{u.map(([l, v]) => <div key={l as string} className="rounded-lg bg-white/10 py-2"><p className="font-mono text-xl">{String(v).padStart(2, "0")}</p><p className="text-[10px] uppercase opacity-70">{l}</p></div>)}</div>;
}
export default function GuestActions(p: P) {
  const [open, setOpen] = useState(false), [done, setDone] = useState(false), [busy, setBusy] = useState(false), [err, setErr] = useState(""), [muted, setMuted] = useState(true);
  const audio = useRef<HTMLAudioElement>(null);
  useEffect(() => { track(p.slug, "VIEW"); }, [p.slug]);
  const [showQr, setShowQr] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";
  const map = p.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([p.venue, p.address].filter(Boolean).join(", "))}`;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=12&data=${encodeURIComponent(url)}`;
  const ics = () => {
    if (!p.start) return "#";
    const d = new Date(p.start), f = (x: Date) => x.toISOString().replace(/[-:]|\.\d{3}/g, "");
    return "data:text/calendar;charset=utf-8," + encodeURIComponent(`BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${p.title}\nDTSTART:${f(d)}\nDTEND:${f(new Date(d.getTime() + 36e5 * 3))}\nLOCATION:${p.venue ?? ""}\nEND:VEVENT\nEND:VCALENDAR`);
  };
  async function share() { track(p.slug, "SHARE"); if (navigator.share) navigator.share({ title: p.title, url }).catch(() => {}); else { await navigator.clipboard?.writeText(url); alert("Link copied."); } }
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setErr("");
    const f = new FormData(e.currentTarget);
    try {
      const r = await fetch(`/api/rsvp/${p.slug}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: f.get("name"), phone: f.get("phone") || undefined, email: f.get("email") || undefined, guests: Number(f.get("guests")), attendance: f.get("attendance"), message: f.get("message") || undefined }) });
      if (!r.ok) setErr((await r.json()).error ?? "Something went wrong. Please try again."); else setDone(true);
    } catch { setErr("Network error. Please try again."); } finally { setBusy(false); }
  }
  const b = "rounded-lg border border-white/25 px-4 py-2.5 text-sm font-semibold";
  const i = "mt-1 w-full rounded-lg border border-white/25 bg-black/30 px-3 py-2 text-sm";
  return (
    <div className="mt-8 space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {(p.venue || p.address) && <a href={map} target="_blank" rel="noopener" onClick={() => track(p.slug, "MAP_CLICK")} className={b}>Location</a>}
        <a href={ics()} download="event.ics" className={b}>Add to Calendar</a>
        <button onClick={share} className={b}>Share</button>
        <a href={`https://wa.me/?text=${encodeURIComponent(p.title + " " + url)}`} target="_blank" rel="noopener" onClick={() => track(p.slug, "WHATSAPP_CLICK")} className={b}>WhatsApp</a>
        <button onClick={() => setShowQr(!showQr)} className={b}>{showQr ? "Hide QR Code" : "Show QR Code"}</button>
      </div>
      {showQr && (
        <div className="rounded-xl bg-white p-4 text-center">
          <img src={qrSrc} alt="QR code linking to this invitation" className="mx-auto h-40 w-40" />
          <a href={qrSrc} download="invitation-qr.png" className="mt-2 inline-block text-xs text-black underline">Download QR Code</a>
        </div>
      )}
      {p.rsvp && !done && <button onClick={() => setOpen(!open)} className="w-full rounded-lg px-4 py-3 text-sm font-bold text-white" style={{ background: p.color }}>RSVP</button>}
      {done && <p role="status" className="rounded-lg bg-white/10 p-3 text-sm">Your RSVP has been submitted.</p>}
      {open && !done && (
        <form onSubmit={submit} className="space-y-3 rounded-xl bg-white/5 p-4 text-left text-sm">
          <label className="block">Name<input name="name" required minLength={2} className={i} /></label>
          <label className="block">Phone<input name="phone" type="tel" className={i} /></label>
          <label className="block">Email<input name="email" type="email" className={i} /></label>
          <label className="block">Number of guests<input name="guests" type="number" min={1} max={20} defaultValue={1} required className={i} /></label>
          <label className="block">Attendance<select name="attendance" className={i}><option value="ATTENDING">Yes, I&apos;ll Attend</option><option value="MAYBE">Maybe</option><option value="NOT_ATTENDING">Sorry, Can&apos;t Attend</option></select></label>
          <label className="block">Message<textarea name="message" rows={2} maxLength={500} className={i} /></label>
          {err && <p role="alert" className="text-red-300">{err}</p>}
          <button disabled={busy} className="w-full rounded-lg bg-white py-2.5 font-bold text-black disabled:opacity-60">{busy ? "Submitting..." : "Submit RSVP"}</button>
        </form>
      )}
      {p.music && <><audio ref={audio} src={p.music} loop muted={muted} /><button onClick={() => { const a = audio.current!; setMuted(!muted); a.muted = !muted; if (muted) a.play().catch(() => {}); }} aria-label={muted ? "Unmute music" : "Mute music"} className="fixed bottom-4 right-4 rounded-full bg-black/70 px-4 py-2 text-xs text-white">{muted ? "🔇 Music off" : "🔊 Music on"}</button></>}
    </div>
  );
}
