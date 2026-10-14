import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { getLogo } from "@/lib/siteSettings";
export const metadata = { title: "Digital Invitations — Teks Tech", description: "Beautiful digital invitations for weddings, birthdays, graduations, celebrations and special events." };
export default async function Page() {
  const logo = await getLogo();
  return (<><Navbar logoUrl={logo.url} /><main className="container-x py-20 text-center">
    <Reveal>
      <h1 className="mx-auto max-w-2xl text-4xl font-bold md:text-5xl">Create an Invitation They&apos;ll Remember.</h1>
      <p className="mx-auto mt-5 max-w-xl text-lg text-slate-300">Beautiful digital invitations for weddings, birthdays, graduations, celebrations and special events.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3"><Link href="/invitations/create" className="btn-primary transition-transform hover:scale-105">Create Invitation</Link><Link href="/invitations/templates" className="btn-ghost transition-transform hover:scale-105">Explore Templates</Link></div>
    </Reveal>
    <ul className="mx-auto mt-14 grid max-w-3xl gap-4 text-left sm:grid-cols-3">{["Countdown, location and calendar", "RSVP and photo gallery", "Share instantly on WhatsApp"].map((f, i) => <Reveal key={f} delay={i * 100}><li className="card h-full text-sm">{f}</li></Reveal>)}</ul>
  </main><Footer logoUrl={logo.url} /></>);
}
