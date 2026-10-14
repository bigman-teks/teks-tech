import { z } from "zod";
import { EVENT_CATEGORIES } from "./content";
export type Field = { name: string; label: string; type: "text" | "textarea" | "number" | "money" | "select" | "bool" | "image" | "list" | "json"; options?: string[]; required?: boolean };
export type Resource = { model: string; title: string; fields: Field[]; cols: string[]; noCreate?: boolean; noDelete?: boolean };
const ST = ["ACTIVE", "INACTIVE"];
export const RESOURCES: Record<string, Resource> = {
  templates: { model: "template", title: "Templates", cols: ["name", "category", "priceTier", "isPremium", "status"], fields: [
    { name: "name", label: "Name", type: "text", required: true }, { name: "category", label: "Category", type: "select", options: [...EVENT_CATEGORIES], required: true },
    { name: "style", label: "Style", type: "select", options: ["Elegant", "Luxury", "Minimal", "Traditional", "Modern", "Romantic", "Professional"] }, { name: "description", label: "Description", type: "textarea" },
    { name: "preview", label: "Preview image", type: "image" }, { name: "configuration", label: "Configuration (JSON, e.g. {\"theme\":{\"primary\":\"#2563EB\"}})", type: "json", required: true },
    { name: "tags", label: "Tags (one per line)", type: "list" },
    { name: "priceTier", label: "Price tier", type: "select", options: ["BASIC", "STANDARD", "PREMIUM"], required: true },
    { name: "isPremium", label: "Premium (requires payment to use)", type: "bool" }, { name: "priceKobo", label: "Premium price (₦, leave empty if free)", type: "money" },
    { name: "featured", label: "Featured on templates page", type: "bool" },
    { name: "status", label: "Status", type: "select", options: ST, required: true }] },
  products: { model: "product", title: "Products", cols: ["name", "category", "priceKobo", "status"], fields: [
    { name: "name", label: "Product name", type: "text", required: true }, { name: "category", label: "Category", type: "select", options: ["Excel Systems", "Business Templates", "Dashboards", "AI Guides", "Digital Resources", "Professional Templates"], required: true },
    { name: "description", label: "Description", type: "textarea" }, { name: "priceKobo", label: "Price (₦)", type: "money", required: true }, { name: "previewUrl", label: "Preview image", type: "image" },
    { name: "fileUrl", label: "Download file URL", type: "text" }, { name: "status", label: "Status", type: "select", options: ST, required: true }] },
  services: { model: "service", title: "Services", cols: ["name", "sortOrder", "status"], fields: [
    { name: "name", label: "Service name", type: "text", required: true }, { name: "description", label: "Description", type: "textarea", required: true }, { name: "icon", label: "Icon (optional)", type: "text" },
    { name: "features", label: "Features (one per line)", type: "list", required: true }, { name: "ctaLabel", label: "CTA label", type: "text", required: true }, { name: "ctaHref", label: "CTA link", type: "text", required: true },
    { name: "sortOrder", label: "Sort order", type: "number", required: true }, { name: "status", label: "Status", type: "select", options: ST, required: true }] },
  portfolio: { model: "portfolioItem", title: "Portfolio", cols: ["name", "category", "published"], fields: [
    { name: "name", label: "Project name", type: "text", required: true }, { name: "category", label: "Category", type: "text", required: true }, { name: "description", label: "Description", type: "textarea", required: true },
    { name: "imageUrl", label: "Image", type: "image" }, { name: "projectUrl", label: "Project URL", type: "text" }, { name: "published", label: "Published", type: "bool" }] },
  coupons: { model: "coupon", title: "Coupons", cols: ["code", "percentOff", "active"], fields: [
    { name: "code", label: "Code", type: "text", required: true }, { name: "percentOff", label: "Percent off (1-100)", type: "number", required: true }, { name: "active", label: "Active", type: "bool" }] },
  packages: { model: "package", title: "Packages & pricing", noCreate: true, noDelete: true, cols: ["id", "name", "priceKobo", "isQuote", "status"], fields: [
    { name: "name", label: "Name", type: "text", required: true }, { name: "priceKobo", label: "Price (₦, leave empty if not set)", type: "money" }, { name: "features", label: "Features (one per line)", type: "list", required: true },
    { name: "isQuote", label: "Quote only (no online checkout)", type: "bool" }, { name: "status", label: "Status", type: "select", options: ST, required: true }] },
};
export function schemaFor(r: Resource) {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const f of r.fields) {
    let s: z.ZodTypeAny;
    switch (f.type) {
      case "text": case "textarea": s = f.required ? z.string().trim().min(1).max(2000) : z.string().trim().max(2000).nullable().optional(); break;
      case "image": s = z.string().url().max(500).nullable().optional(); break;
      case "number": s = z.number().int().min(0).max(1_000_000); break;
      case "money": s = f.required ? z.number().int().min(0).max(1e10) : z.number().int().min(0).max(1e10).nullable().optional(); break;
      case "select": s = z.enum(f.options as [string, ...string[]]); if (!f.required) s = s.nullable().optional(); break;
      case "bool": s = z.boolean(); break;
      case "list": s = z.array(z.string().trim().min(1).max(200)).max(30); break;
      case "json": s = z.record(z.any()); break;
    }
    shape[f.name] = s;
  }
  return z.object(shape);
}
