import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { getLogo } from "@/lib/siteSettings";
export const metadata = { title: "Create Digital Invitation — Teks Tech" };

const MODES = [
  {
    title: "Choose a Template",
    blurb: "Start with a professionally designed Teks Tech template.",
    cta: "Browse Templates",
    href: "/invitations/templates",
    icon: "🎨",
  },
  {
    title: "Upload My Flyer",
    blurb: "Already have a flyer? Turn it into a digital invitation.",
    cta: "Upload Flyer",
    href: "/invitations/upload",
    icon: "🖼️",
  },
  {
    title: "Start From Scratch",
    blurb: "Build your invitation from the ground up, your way.",
    cta: "Start Designing",
    href: "/invitations/build?mode=scratch",
    icon: "✏️",
  },
];

export default async function Page() {
  const s = await getSession();
  if (!s) redirect("/login?next=/invitations/create");
  const logo = await getLogo();
  return (<><Navbar logoUrl={logo.url} /><main className="container-x py-16">
    <Reveal className="mx-auto mb-12 max-w-2xl text-center">
      <h1 className="text-3xl font-bold md:text-4xl">Create. Customize. Share.</h1>
      <p className="mt-4 text-slate-300">Choose how you&apos;d like to start your digital invitation.</p>
    </Reveal>
    <div className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-3">
      {MODES.map((m, i) => (
        <Reveal key={m.title} delay={i * 100}>
          <Link href={m.href} className="card group flex h-full flex-col items-center text-center transition-transform hover:-translate-y-1">
            <span aria-hidden className="text-4xl">{m.icon}</span>
            <h2 className="mt-4 font-semibold">{m.title}</h2>
            <p className="mt-2 flex-1 text-sm text-slate-300">{m.blurb}</p>
            <span className="btn-primary mt-5 w-full transition-transform group-hover:scale-105">{m.cta}</span>
          </Link>
        </Reveal>
      ))}
    </div>
    <Reveal delay={300} className="mx-auto mt-14 max-w-3xl border-t border-white/10 pt-10 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-bright">How It Works</p>
      <div className="mt-6 grid gap-5 sm:grid-cols-4">
        {[["1. Choose", "Choose a template, upload your flyer, or start from scratch."],
          ["2. Customize", "Add your event information, photos, programme and RSVP."],
          ["3. Publish", "Get your unique digital invitation link."],
          ["4. Share", "Send it to your guests through WhatsApp, social media or QR code."]].map(([t, d]) => (
          <div key={t}><p className="font-semibold text-white">{t}</p><p className="mt-1 text-sm text-slate-300">{d}</p></div>
        ))}
      </div>
    </Reveal>
  </main><Footer logoUrl={logo.url} /></>);
}
