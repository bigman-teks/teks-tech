// Pure presentational: used by the builder preview AND the public /i/[slug] page so they always match.
import type { ReactNode } from "react";
export type InvData = {
  eventType: string; eventTitle: string; hostName: string; date?: string | null; startTime?: string | null; endTime?: string | null;
  venue?: string | null; address?: string | null; mapUrl?: string | null; description?: string | null;
  photos?: { main?: string; person?: string; background?: string; gallery?: string[] } | null;
  theme?: { primary?: string; secondary?: string; background?: string; font?: string } | null;
  sourceType?: string | null;
  hashtag?: string | null;
  personalMessage?: { heading?: string; message?: string; signature?: string } | null;
  dressCode?: { title?: string; description?: string; colors?: string[] } | null;
};
type ProgrammeItem = { time?: string | null; title: string; description?: string | null };
type Contact = { role: string; name: string; phone?: string | null; whatsapp?: string | null };
type Faq = { question: string; answer: string };
export const FONTS: Record<string, string> = { serif: "Georgia, 'Times New Roman', serif", sans: "var(--font-inter), system-ui, sans-serif", display: "var(--font-grotesk), system-ui, sans-serif", mono: "var(--font-mono), monospace" };

export default function InvitationView({ inv, countdown, actions, programme, contacts, faqs }: { inv: InvData; countdown?: ReactNode; actions?: ReactNode; programme?: ProgrammeItem[]; contacts?: Contact[]; faqs?: Faq[] }) {
  const t = { primary: "#2563EB", secondary: "#F8FAFC", background: "#0F172A", font: "serif", ...inv.theme };
  const p = inv.photos ?? {};
  const isFlyer = inv.sourceType === "UPLOADED_FLYER";
  const when = inv.date ? new Date(inv.date).toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : "Date to be confirmed";
  const time = [inv.startTime, inv.endTime].filter(Boolean).join(" – ");
  const pm = inv.personalMessage;
  const dc = inv.dressCode;
  return (
    <article style={{ background: t.background, color: t.secondary, fontFamily: FONTS[t.font] ?? FONTS.serif }} className="relative w-full overflow-hidden">
      {/* An uploaded flyer stays fully visible — it IS the invitation's design. A template background stays a subtle texture behind the template's own layout. */}
      {p.background && <div aria-hidden className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${p.background})`, opacity: isFlyer ? 1 : 0.25 }} />}
      <div className={`relative mx-auto max-w-md px-6 py-12 text-center ${isFlyer ? "my-6 rounded-2xl bg-black/55 backdrop-blur-[2px]" : ""}`}>
        {p.main && <img src={p.main} alt={inv.eventTitle} loading="lazy" className="mx-auto mb-6 h-64 w-full rounded-2xl object-cover" />}
        <p style={{ color: t.primary }} className="text-xs uppercase tracking-[0.3em]">You are invited</p>
        <h1 className="mt-3 text-4xl font-bold leading-tight">{inv.hostName}</h1>
        <p className="mt-2 text-lg opacity-90">{inv.eventTitle}</p>
        {p.person && <img src={p.person} alt={inv.hostName} loading="lazy" className="mx-auto mt-6 h-32 w-32 rounded-full object-cover ring-2" style={{ ["--tw-ring-color" as string]: t.primary }} />}
        <div className="mx-auto my-6 h-px w-16" style={{ background: t.primary }} />
        <p className="text-xl">{when}</p>{time && <p className="opacity-80">{time}</p>}
        {countdown}
        {inv.venue && <p className="mt-6 text-lg font-semibold">{inv.venue}</p>}
        {inv.address && <p className="text-sm opacity-80">{inv.address}</p>}
        {inv.description && <p className="mt-6 whitespace-pre-line text-sm leading-relaxed opacity-90">{inv.description}</p>}

        {pm && (pm.heading || pm.message) && (
          <div className="mt-8 border-t pt-8" style={{ borderColor: `${t.primary}33` }}>
            {pm.heading && <p className="font-semibold" style={{ color: t.primary }}>{pm.heading}</p>}
            {pm.message && <p className="mt-2 whitespace-pre-line text-sm leading-relaxed opacity-90">{pm.message}</p>}
            {pm.signature && <p className="mt-3 text-sm italic opacity-80">{pm.signature}</p>}
          </div>
        )}

        {!!p.gallery?.length && <div className="mt-8 grid grid-cols-2 gap-2">{p.gallery.map((g) => <img key={g} src={g} alt="" loading="lazy" className="aspect-square w-full rounded-lg object-cover" />)}</div>}

        {!!programme?.length && (
          <div className="mt-8 text-left">
            <p className="text-center text-xs uppercase tracking-[0.3em] opacity-70">Programme</p>
            <ol className="mt-4 space-y-3 border-l pl-4" style={{ borderColor: `${t.primary}55` }}>
              {programme.map((it, i) => (
                <li key={i}>
                  {it.time && <p className="font-mono text-xs" style={{ color: t.primary }}>{it.time}</p>}
                  <p className="font-semibold">{it.title}</p>
                  {it.description && <p className="text-sm opacity-80">{it.description}</p>}
                </li>
              ))}
            </ol>
          </div>
        )}

        {dc && (dc.title || dc.description) && (
          <div className="mt-8">
            <p className="text-xs uppercase tracking-[0.3em] opacity-70">Dress Code</p>
            {dc.title && <p className="mt-2 font-semibold">{dc.title}</p>}
            {dc.description && <p className="mt-1 text-sm opacity-80">{dc.description}</p>}
            {!!dc.colors?.length && <p className="mt-2 text-xs opacity-70">{dc.colors.join(" • ")}</p>}
          </div>
        )}

        {inv.hashtag && <p className="mt-6 font-mono text-sm" style={{ color: t.primary }}>{inv.hashtag}</p>}

        {actions}

        {!!faqs?.length && (
          <div className="mt-10 text-left">
            <p className="text-center text-xs uppercase tracking-[0.3em] opacity-70">FAQ</p>
            <div className="mt-4 space-y-2">
              {faqs.map((f, i) => (
                <details key={i} className="rounded-lg bg-white/5 p-3">
                  <summary className="cursor-pointer text-sm font-medium">{f.question}</summary>
                  <p className="mt-2 text-sm opacity-80">{f.answer}</p>
                </details>
              ))}
            </div>
          </div>
        )}

        {!!contacts?.length && (
          <div className="mt-8 text-left">
            <p className="text-center text-xs uppercase tracking-[0.3em] opacity-70">Contacts</p>
            <div className="mt-4 space-y-2">
              {contacts.map((c, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg bg-white/5 p-3 text-sm">
                  <div><p className="font-medium">{c.name}</p><p className="opacity-70">{c.role}</p></div>
                  <div className="flex gap-2">
                    {c.phone && <a href={`tel:${c.phone}`} className="rounded border border-white/25 px-2 py-1 text-xs">Call</a>}
                    {c.whatsapp && <a href={`https://wa.me/${c.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener" className="rounded border border-white/25 px-2 py-1 text-xs">WhatsApp</a>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
