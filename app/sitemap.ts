import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const b = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return ["", "/invitations", "/invitations/templates", "/products", "/about"].map((p) => ({ url: b + p, lastModified: new Date() }));
}
