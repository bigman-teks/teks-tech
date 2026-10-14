import AdminCrud from "@/components/AdminCrud";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
export default async function Page() {
  return <AdminCrud resource="coupons" rows={JSON.parse(JSON.stringify(await (prisma as any).coupon.findMany({ orderBy: { code: "asc" } })))} />;
}
