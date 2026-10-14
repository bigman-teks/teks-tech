import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { signSession, setSessionCookie } from "@/lib/auth";
import { rateLimit } from "@/lib/rateLimit";
const schema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().toLowerCase().email(),
  phone: z.string().trim().max(20).optional(),
  password: z.string().min(8).max(100),
});
export async function POST(req: NextRequest) {
  if (!rateLimit("reg:" + (req.headers.get("x-forwarded-for") ?? "ip"), 5))
    return NextResponse.json({ error: "Too many attempts. Please try again shortly." }, { status: 429 });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please check your details and try again." }, { status: 400 });
  const { name, email, phone, password } = parsed.data;
  if (await prisma.user.findUnique({ where: { email } }))
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  const user = await prisma.user.create({ data: { name, email, phone, passwordHash: await bcrypt.hash(password, 12) } });
  const res = NextResponse.json({ ok: true, user: { id: user.id, name: user.name, role: user.role } }, { status: 201 });
  setSessionCookie(res, await signSession({ sub: user.id, role: user.role }));
  return res;
}
