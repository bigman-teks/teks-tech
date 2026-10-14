import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import Counter from "@/components/Counter";
import { CAPABILITIES, STEPS, PRODUCT_CATS } from "@/lib/content";
import { getServices, getPortfolio } from "@/lib/publicContent";
import { getLogo } from "@/lib/siteSettings";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

const wa = process.env.NEXT_PUBLIC_WHATSAPP;
const H2 = ({ t, d }: { t: string; d?: string }) => (
  <Reveal className="mx-auto mb-12 max-w-2xl text-center">
    <h2 className="text-3xl font-bold md:text-4xl">{t}</h2>
    {d && <p className="mt-4 text-slate-300">{d}</p>}
  </Reveal>
);

export default async function Home() {
  const [SERVICES, PORTFOLIO, logo, templateCount, publishedCount] = await Promise.all([
    getServices(), getPortfolio(), getLogo(),
    prisma.template.count({ where: { status: "ACTIVE" } }).catch(() => 0),
    prisma.invitation.count({ where: { status: "PUBLISHED" } }).catch(() => 0),
  ]);
  const stats = [
    { value: SERVICES.length, label: "Core Services" },
    { value: templateCount, label: "Invitation Templates" },
    { value: PORTFOLIO.length, label: "Projects Delivered" },
    { value: publishedCount, label: "Invitations Published" },
  ];
  return (
    <>
      <Navbar logoUrl={logo.url} />
      <main>
        <section className="relative overflow-hidden bg-[radial-gradient(60%_50%_at_70%_0%,rgba(37,99,235,.25),transparent)]">
          <div className="container-x grid items-center gap-12 py-16 md:py-24 lg:grid-cols-2">
            <div>
              <span className="inline-block animate-[reveal-up_.6s_cubic-bezier(.16,1,.3,1)_forwards] rounded-full border border-electric/40 bg-electric/10 px-3 py-1 font-mono text-xs tracking-wider text-bright">DIGITAL SOLUTIONS • DESIGN • DATA</span>
              <h1 className="mt-5 animate-[reveal-up_.7s_cubic-bezier(.16,1,.3,1)_.1s_forwards] text-4xl font-bold leading-tight opacity-0 md:text-6xl">Technology That Works for You.</h1>
              <p className="mt-5 max-w-xl animate-[reveal-up_.7s_cubic-bezier(.16,1,.3,1)_.2s_forwards] text-lg text-slate-300 opacity-0">We build websites, digital experiences, data solutions and creative tools that help individuals, businesses and organizations work smarter.</p>
              <div className="mt-8 flex animate-[reveal-up_.7s_cubic-bezier(.16,1,.3,1)_.3s_forwards] flex-wrap gap-3 opacity-0">
                <Link href="/register" className="btn-primary transition-transform hover:scale-105">Get Started</Link>
                <Link href="#services" className="btn-ghost transition-transform hover:scale-105">Explore Our Services</Link>
              </div>
            </div>
            <div aria-hidden className="relative mx-auto w-full max-w-md">
              <div className="card shadow-glow motion-safe:animate-[float_6s_ease-in-out_infinite]">
                <div className="flex gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-white/20" /><i className="h-2.5 w-2.5 rounded-full bg-white/20" /><i className="h-2.5 w-2.5 rounded-full bg-white/20" /></div>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {[40, 70, 55].map((h, i) => <div key={i} className="flex h-20 items-end rounded-lg bg-charcoal/70 p-2"><div className="w-full origin-bottom scale-y-0 rounded bg-electric" style={{ height: `${h}%`, animation: `grow-bar .8s ease-out ${0.4 + i * 0.15}s forwards` }} /></div>)}
                </div>
                <div className="mt-3 space-y-2"><div className="h-2.5 w-3/4 rounded bg-white/10" /><div className="h-2.5 w-1/2 rounded bg-white/10" /></div>
              </div>
              <div className="card absolute -bottom-8 -left-4 w-40 rotate-[-4deg] !p-4 text-center motion-safe:animate-[float_5s_ease-in-out_.5s_infinite]"><p className="font-display text-sm">You&apos;re Invited</p><div className="mx-auto mt-2 h-px w-10 bg-bright" /><p className="mt-2 font-mono text-[10px] text-slate2">RSVP • SHARE</p></div>
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-navy/40">
          <ul className="container-x flex flex-wrap justify-center gap-x-8 gap-y-3 py-5 font-mono text-xs tracking-widest text-slate-300">
            {CAPABILITIES.map((c, i) => (
              <li key={c} className="opacity-0" style={{ animation: `reveal-up .5s cubic-bezier(.16,1,.3,1) ${i * 0.08}s forwards` }}>{c.toUpperCase()}</li>
            ))}
          </ul>
        </section>

        <section className="border-b border-white/10 py-14">
          <Reveal className="container-x grid grid-cols-2 gap-6 lg:grid-cols-4">
            {stats.map((s) => <Counter key={s.label} value={s.value} suffix="+" label={s.label} />)}
          </Reveal>
        </section>

        <section id="services" className="container-x scroll-mt-20 py-20">
          <H2 t="Everything You Need to Go Digital" d="From your first website to custom business systems, we create practical digital solutions designed around your needs." />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s, i) => (
              <Reveal key={s.name} delay={i * 80}>
                <article className="card flex h-full flex-col">
                  <h3 className="text-lg font-semibold">{s.name}</h3>
                  <p className="mt-2 text-sm text-slate-300">{s.desc}</p>
                  <ul className="mt-4 flex-1 space-y-1.5 text-sm text-slate-300">{s.features.map((f) => <li key={f}>• {f}</li>)}</ul>
                  <Link href={s.href} className="btn-ghost mt-5 transition-transform hover:scale-[1.03]">{s.cta}</Link>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-b from-navy to-charcoal py-20">
          <div className="container-x text-center">
            <Reveal>
              <h2 className="mx-auto max-w-2xl text-3xl font-bold md:text-4xl">Your Event Deserves More Than a Picture.</h2>
              <p className="mx-auto mt-4 max-w-2xl text-slate-300">Create a beautiful digital invitation with your event details, photos, countdown timer, location, RSVP and more — then share it instantly with your guests.</p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Link href="/invitations/create" className="btn-primary transition-transform hover:scale-105">Create Your Invitation</Link>
                <Link href="/invitations/templates" className="btn-ghost transition-transform hover:scale-105">View Templates</Link>
              </div>
            </Reveal>
            <div className="mt-12 grid gap-5 sm:grid-cols-3">
              {["Wedding", "Birthday", "Corporate"].map((t, i) => (
                <Reveal key={t} delay={i * 100}>
                  <div className="card mx-auto w-full max-w-[16rem] !p-8 hover:rotate-1"><p className="font-mono text-xs tracking-widest text-bright">{t.toUpperCase()}</p><p className="mt-3 font-display text-xl">You&apos;re Invited</p><div className="mx-auto my-3 h-px w-12 bg-white/20" /><p className="text-xs text-slate2">Save the date • RSVP</p></div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="container-x py-20">
          <H2 t="From Idea to Digital Solution" />
          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(([n, t, d], i) => (
              <Reveal key={n} delay={i * 100}>
                <li className="card h-full"><p className="font-mono text-2xl text-bright">{n}</p><h3 className="mt-2 font-semibold">{t.toUpperCase()}</h3><p className="mt-1 text-sm text-slate-300">{d}</p></li>
              </Reveal>
            ))}
          </ol>
        </section>

        <section id="portfolio" className="container-x scroll-mt-20 py-20">
          <H2 t="Projects We've Built" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PORTFOLIO.map((p, i) => (
              <Reveal key={p.name} delay={i * 80}>
                <article className="card group overflow-hidden !p-0">
                  <div className="overflow-hidden">
                    {p.imageUrl ? <img src={p.imageUrl} alt={p.name} loading="lazy" className="h-36 w-full object-cover transition-transform duration-500 group-hover:scale-110" /> : <div className="h-36 bg-gradient-to-br from-electric/40 to-navy transition-transform duration-500 group-hover:scale-110" aria-hidden />}
                  </div>
                  <div className="p-5"><p className="font-mono text-xs text-bright">{p.cat}</p><h3 className="mt-1 font-semibold">{p.name}</h3><p className="mt-2 text-sm text-slate-300">{p.desc}</p><Link href={p.href || "/#contact"} className="btn-ghost mt-4 !py-2 transition-transform hover:scale-[1.03]">View Project</Link></div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="products" className="border-y border-white/10 bg-navy/40 py-20">
          <div className="container-x">
            <H2 t="Ready-to-Use Digital Tools" />
            <Reveal className="flex flex-wrap justify-center gap-3">
              <ul className="flex flex-wrap justify-center gap-3">{PRODUCT_CATS.map((c) => <li key={c} className="rounded-full border border-white/15 px-4 py-2 text-sm text-slate-200 transition-colors hover:border-bright hover:text-white">{c}</li>)}</ul>
            </Reveal>
            <div className="mt-8 text-center"><Link href="/products" className="btn-primary transition-transform hover:scale-105">Browse Products</Link></div>
          </div>
        </section>

        <section id="about" className="container-x scroll-mt-20 py-20">
          <Reveal className="mx-auto max-w-3xl space-y-4 text-slate-300">
            <h2 className="text-3xl font-bold text-white md:text-4xl">Technology Built Around You.</h2>
            <p>Teks Tech is a digital solutions studio focused on making technology practical, accessible and useful.</p>
            <p>We combine web development, creative design, data and automation to build digital solutions that solve real problems.</p>
            <p>Whether you need a professional website, an interactive event invitation, a business dashboard or a custom digital system, Teks Tech helps turn ideas into working technology.</p>
            <Link href="/about" className="btn-ghost inline-block transition-transform hover:scale-[1.03]">Learn More About Teks Tech</Link>
          </Reveal>
        </section>

        <section id="contact" className="scroll-mt-20 bg-gradient-to-br from-electric/30 to-navy py-20 text-center">
          <Reveal className="container-x">
            <h2 className="text-3xl font-bold md:text-4xl">Have an Idea? Let&apos;s Build It.</h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-200">Tell us what you want to create and let&apos;s turn your idea into a digital solution that works.</p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link href="/register" className="btn-primary transition-transform hover:scale-105">Start a Project</Link>
              {wa && <a href={`https://wa.me/${wa}`} className="btn-ghost transition-transform hover:scale-105">Chat on WhatsApp</a>}
            </div>
          </Reveal>
        </section>
      </main>
      <Footer logoUrl={logo.url} />
    </>
  );
}
