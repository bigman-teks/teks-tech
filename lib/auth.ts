import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
const secret = () => {
  const s = process.env.JWT_SECRET;
  if (!s || s.length < 24) throw new Error("JWT_SECRET missing or too short");
  return new TextEncoder().encode(s);
};
export const COOKIE = "teks_session";
export type Session = { sub: string; role: "USER" | "ADMIN" };
export async function signSession(s: Session) {
  return new SignJWT({ role: s.role }).setProtectedHeader({ alg: "HS256" })
    .setSubject(s.sub).setIssuedAt().setExpirationTime("7d").sign(secret());
}
export async function verifySession(token?: string): Promise<Session | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return { sub: String(payload.sub), role: payload.role as Session["role"] };
  } catch { return null; }
}
export async function getSession() { return verifySession(cookies().get(COOKIE)?.value); }
export function setSessionCookie(res: Response & { cookies: any }, token: string) {
  res.cookies.set(COOKIE, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 604800 });
}
