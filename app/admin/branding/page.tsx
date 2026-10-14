import BrandingForm from "@/components/BrandingForm";
import { getFounder, getLogo } from "@/lib/siteSettings";
export const dynamic = "force-dynamic";
export default async function Page() {
  const [founder, logo] = await Promise.all([getFounder(), getLogo()]);
  return (<><h1 className="mb-4 text-2xl font-bold">Branding</h1><BrandingForm founder={founder} logoUrl={logo.url} /></>);
}
