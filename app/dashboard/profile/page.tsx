import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import ProfileForm from "@/components/ProfileForm";
export default async function Page() {
  const u = await prisma.user.findUniqueOrThrow({ where: { id: (await getSession())!.sub }, select: { name: true, phone: true, email: true } });
  return <><h1 className="mb-4 text-2xl font-bold">Profile</h1><ProfileForm name={u.name} phone={u.phone ?? ""} email={u.email} /></>;
}
