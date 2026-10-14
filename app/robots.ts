import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  const b = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return { rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/dashboard", "/api", "/i/", "/payment"] }, sitemap: `${b}/sitemap.xml` };
}
