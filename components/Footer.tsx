import Link from "next/link";
import { NAV, SERVICES } from "@/lib/content";
export default function Footer({ logoUrl }: { logoUrl?: string | null } = {}) {
  const wa = process.env.NEXT_PUBLIC_WHATSAPP;
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  return (
    <footer className="border-t border-white/10 bg-navy/40">
      <div className="container-x grid gap-10 py-14 md:grid-cols-3">
        <div>
          <p className="flex items-center gap-2 font-display text-2xl font-bold">{logoUrl ? <img src={logoUrl} alt="Teks Tech" className="h-14 w-auto drop-shadow-[0_2px_10px_rgba(37,99,235,0.45)]" /> : <>TEKS <span className="text-bright drop-shadow-[0_0_14px_rgba(37,99,235,0.6)]">TECH</span></>}</p>
          <p className="mt-2 text-slate-300">Tech That Works for You.</p>
          <p className="mt-2 text-sm text-slate2">Digital solutions for people, businesses and organizations.</p>
        </div>
        <ul className="space-y-2 text-sm text-slate-300">{NAV.map(([l, h]) => <li key={l}><Link className="hover:text-white" href={h}>{l}</Link></li>)}</ul>
        <div className="space-y-2 text-sm text-slate-300">
          {SERVICES.map((s) => <p key={s.name}>{s.name}</p>)}
          {email && <p><a className="text-bright" href={`mailto:${email}`}>{email}</a></p>}
          {wa && <p><a className="text-bright" href={`https://wa.me/${wa}`}>WhatsApp</a></p>}
        </div>
      </div>
      <p className="border-t border-white/10 py-5 text-center text-xs text-slate2">© {new Date().getFullYear()} Teks Tech. All rights reserved.</p>
    </footer>
  );
}
