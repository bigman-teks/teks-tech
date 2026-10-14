import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import FlyerUploader from "@/components/FlyerUploader";
import { getLogo } from "@/lib/siteSettings";
export const metadata = { title: "Upload My Flyer — Teks Tech", description: "Already have a flyer? Turn it into a digital invitation." };
export default async function Page() {
  const s = await getSession();
  if (!s) redirect("/login?next=/invitations/upload");
  const logo = await getLogo();
  return (<><Navbar logoUrl={logo.url} /><main className="container-x py-16">
    <Reveal className="mx-auto mb-10 max-w-xl text-center">
      <h1 className="text-3xl font-bold">Already have a flyer?</h1>
      <p className="mt-3 text-slate-300">Don&apos;t redesign it. Upload it and we&apos;ll turn it into a live, mobile-friendly digital invitation — with a countdown, RSVP, map, gallery and more, while your original design stays front and center.</p>
    </Reveal>
    <Reveal delay={100}><FlyerUploader /></Reveal>
  </main><Footer logoUrl={logo.url} /></>);
}
