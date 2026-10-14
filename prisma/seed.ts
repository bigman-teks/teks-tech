import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();
(async () => {
  const email = process.env.ADMIN_SEED_EMAIL, pw = process.env.ADMIN_SEED_PASSWORD;
  if (!email || !pw) throw new Error("Set ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD in .env");
  await prisma.user.upsert({ where: { email }, update: { role: "ADMIN" },
    create: { name: "Teks Tech Admin", email, passwordHash: await bcrypt.hash(pw, 12), role: "ADMIN" } });
  console.log("Admin ready:", email);
})().finally(() => prisma.$disconnect());

// Starter templates + packages (idempotent). Prices stay NULL (unset) unless SEED_DEV_FREE=1 for local testing only.
(async () => {
  const p = new PrismaClient();
  const T = [
    ["Elegant Wedding", "Wedding", "Elegant", "BASIC", { primary: "#B08D57", secondary: "#FDF8F0", background: "#1C1917", font: "serif" }, "Timeless gold-and-charcoal palette with a classic serif — a refined choice for a formal ceremony."],
    ["Romantic Blush", "Wedding", "Romantic", "STANDARD", { primary: "#E11D74", secondary: "#FFF1F2", background: "#3B0A24", font: "serif" }, "Soft blush tones with a romantic serif — warm and intimate for a love story."],
    ["Party Pop", "Birthday", "Modern", "BASIC", { primary: "#F59E0B", secondary: "#FFFFFF", background: "#111827", font: "display" }, "Bold amber on deep charcoal with a modern display font — energetic and fun."],
    ["Graduation Classic", "Graduation", "Traditional", "BASIC", { primary: "#2563EB", secondary: "#F8FAFC", background: "#0F172A", font: "serif" }, "Classic navy and blue with a dignified serif — proud and celebratory."],
    ["Corporate Clean", "Corporate", "Professional", "STANDARD", { primary: "#3B82F6", secondary: "#F8FAFC", background: "#0B0F14", font: "sans" }, "Crisp, minimal sans-serif on near-black — polished for a business audience."],
    ["Church Celebration", "Church", "Traditional", "BASIC", { primary: "#D4AF37", secondary: "#FFFFFF", background: "#1E1B4B", font: "serif" }, "Gold on deep indigo with a traditional serif — reverent and celebratory."],
    ["Naming Day Joy", "Naming Ceremony", "Modern", "BASIC", { primary: "#10B981", secondary: "#F0FDF4", background: "#022C22", font: "display" }, "Fresh green and mint with a friendly display font — bright and joyful."],
    ["Anniversary Gold", "Anniversary", "Luxury", "PREMIUM", { primary: "#C9A227", secondary: "#FFFDF5", background: "#1A1300", font: "serif" }, "Deep gold on black with an elegant serif — a luxurious milestone feel."],
    ["Royal Owambe", "Traditional Ceremony", "Royal", "STANDARD", { primary: "#C1272D", secondary: "#FFF8E7", background: "#2B0A0A", font: "serif" }, "Vivid red and gold inspired by Nigerian traditional ceremonies — bold, regal and festive."],
    ["Minimalist Luxury", "Wedding", "Minimal", "PREMIUM", { primary: "#D4D4D4", secondary: "#FFFFFF", background: "#0A0A0A", font: "sans" }, "Black, white and a thin line of silver — understated elegance for a modern couple."],
    ["Kids Wonderland", "Birthday", "Modern", "BASIC", { primary: "#14B8A6", secondary: "#FFFBEB", background: "#0C2B2B", font: "display" }, "Playful teal and sunshine yellow with a bold display font — perfect for a children's party."],
    ["Golden Hour", "Birthday", "Elegant", "PREMIUM", { primary: "#C9A227", secondary: "#FDF4E3", background: "#2B1A3D", font: "serif" }, "Deep plum and gold with a refined serif — an elegant milestone birthday."],
    ["Little Feet", "Baby Shower", "Romantic", "BASIC", { primary: "#F4A9B8", secondary: "#FFFDFB", background: "#2E2430", font: "display" }, "Soft blush and mint with a gentle, friendly font — tender and welcoming."],
    ["Bridal Blossom", "Bridal Shower", "Romantic", "STANDARD", { primary: "#E8A0BF", secondary: "#FFF5F8", background: "#2B1620", font: "serif" }, "Soft floral pinks with a romantic serif — light and celebratory."],
    ["Forever Yes", "Engagement", "Romantic", "STANDARD", { primary: "#D4AF8C", secondary: "#FFF8F0", background: "#14121F", font: "serif" }, "Rose gold on deep navy with a romantic serif — for the moment it all began."],
    ["Peaceful Remembrance", "Funeral / Celebration of Life", "Traditional", "BASIC", { primary: "#B9C4D1", secondary: "#F7F8FA", background: "#11151C", font: "serif" }, "A calm, dignified palette of navy and silver with a classic serif — respectful and comforting."],
  ] as const;
  for (const [name, category, style, priceTier, theme, description] of T)
    if (!(await p.template.findFirst({ where: { name } })))
      await p.template.create({ data: { name, category, style, priceTier, description, configuration: { theme }, isPremium: priceTier === "PREMIUM", featured: ["Elegant Wedding", "Royal Owambe", "Golden Hour", "Corporate Clean"].includes(name) } });
  const free = process.env.SEED_DEV_FREE === "1";
  const P = [["BASIC", "Basic", ["Template", "Event details", "Countdown", "Location", "Shareable link", "Mobile responsive design"], false], ["STANDARD", "Standard", ["Everything in Basic", "RSVP", "Photo gallery", "WhatsApp sharing", "Add to calendar", "Custom colors"], false], ["PREMIUM", "Premium", ["Everything in Standard", "Premium templates", "Custom design", "Advanced RSVP", "Guest management", "Analytics", "Priority support"], false], ["CUSTOM", "Custom", ["Custom digital experience"], true]] as const;
  for (const [id, name, features, isQuote] of P)
    await p.package.upsert({ where: { id }, update: {}, create: { id, name, features: [...features], isQuote, priceKobo: free && !isQuote ? 0 : null } });
  await p.$disconnect();
})();
