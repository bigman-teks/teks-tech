import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { getFounder, getLogo } from "@/lib/siteSettings";
export const revalidate = 60;
export const metadata = { title: "About — Teks Tech", description: "Teks Tech is a digital solutions studio focused on making technology practical, accessible and useful." };
export default async function Page() {
  const [founder, logo] = await Promise.all([getFounder(), getLogo()]);
  return (<><Navbar logoUrl={logo.url} /><main className="py-16">
    <Reveal className="container-x max-w-3xl space-y-4 text-slate-300">
      <h1 className="text-3xl font-bold text-white md:text-4xl">Technology Built Around You.</h1>
      <p>Teks Tech is a digital solutions studio focused on making technology practical, accessible and useful.</p>
      <p>We combine web development, creative design, data and automation to build digital solutions that solve real problems.</p>
      <p>Whether you need a professional website, an interactive event invitation, a business dashboard or a custom digital system, Teks Tech helps turn ideas into working technology.</p>
    </Reveal>

    <Reveal delay={100} className="container-x mt-20 max-w-3xl border-t border-white/10 pt-16">
      <p className="font-mono text-xs uppercase tracking-widest text-bright">Meet the Founder</p>
      <div className="mt-6 flex flex-col gap-8 sm:flex-row sm:items-start">
        {founder.photoUrl
          ? <img src={founder.photoUrl} alt={founder.name} className="h-40 w-40 shrink-0 rounded-2xl object-cover shadow-xl transition-transform duration-300 hover:scale-105" />
          : <div aria-hidden className="flex h-40 w-40 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-electric/40 to-navy font-display text-4xl font-bold text-white/70 transition-transform duration-300 hover:scale-105">{founder.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}</div>}
        <div>
          <h2 className="text-2xl font-bold text-white">{founder.name}</h2>
          <p className="mt-1 text-sm text-bright">{founder.title}</p>
          <div className="mt-4 space-y-4 whitespace-pre-line text-slate-300">{founder.bio}</div>
        </div>
      </div>
    </Reveal>
  </main><Footer logoUrl={logo.url} /></>);
}
