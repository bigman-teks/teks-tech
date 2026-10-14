import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { getLogo } from "@/lib/siteSettings";
import { prisma } from "@/lib/prisma";
import { naira } from "@/lib/guard";
export const revalidate = 60;
export const metadata = { title: "Digital Products — Teks Tech", description: "Ready-to-use Excel systems, business templates, dashboards, AI guides and digital resources." };
export default async function Page() {
  const [rows, logo] = await Promise.all([
    prisma.product.findMany({ where: { status: "ACTIVE" }, orderBy: { createdAt: "desc" } }).catch(() => []),
    getLogo(),
  ]);
  const wa = process.env.NEXT_PUBLIC_WHATSAPP;
  return (<><Navbar logoUrl={logo.url} /><main className="container-x py-16">
    <Reveal><h1 className="mb-8 text-3xl font-bold">Ready-to-Use Digital Tools</h1></Reveal>
    {!rows.length ? <p className="text-slate-300">No products are listed yet. Please check back soon.</p> :
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{rows.map((p, i) => (
        <Reveal key={p.id} delay={i * 80}>
        <article className="card group h-full overflow-hidden">{p.previewUrl && <div className="-m-6 mb-3 overflow-hidden"><img src={p.previewUrl} alt={p.name} loading="lazy" className="h-36 w-full object-cover transition-transform duration-500 group-hover:scale-110" /></div>}
          <p className="font-mono text-xs text-bright">{p.category}</p><h2 className="mt-1 font-semibold">{p.name}</h2>{p.description && <p className="mt-2 text-sm text-slate-300">{p.description}</p>}
          <p className="mt-3 font-mono text-lg">{naira(p.priceKobo)}</p>
          {wa && <a className="btn-ghost mt-3 w-full !py-2 transition-transform hover:scale-[1.03]" href={`https://wa.me/${wa}?text=${encodeURIComponent("I'd like to get: " + p.name)}`}>Enquire on WhatsApp</a>}</article>
        </Reveal>))}</div>}
  </main><Footer logoUrl={logo.url} /></>);
}
