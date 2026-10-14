import AdminCrud from "@/components/AdminCrud";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
export default async function Page() {
  return <AdminCrud resource="portfolio" rows={JSON.parse(JSON.stringify(await (prisma as any).portfolioItem.findMany({ orderBy: { createdAt: "desc" } })))} />;
}
