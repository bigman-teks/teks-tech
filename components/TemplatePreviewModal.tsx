"use client";
import InvitationView, { InvData } from "./InvitationView";
const SAMPLE: Record<string, Partial<InvData>> = {
  Wedding: { hostName: "David & Sarah", eventTitle: "Wedding Ceremony & Reception", venue: "Eko Hotel Convention Centre", address: "Victoria Island, Lagos", description: "Join us as we begin our forever. Your presence would mean the world to us." },
  Birthday: { hostName: "Chioma Okafor", eventTitle: "30th Birthday Celebration", venue: "The Blu Room", address: "Ikeja, Lagos", description: "Come celebrate a new decade with music, food and good company." },
  Graduation: { hostName: "Emeka Johnson", eventTitle: "Graduation Reception", venue: "Family Residence", address: "Lekki Phase 1, Lagos", description: "Four years of hard work, one unforgettable celebration." },
  "Naming Ceremony": { hostName: "Baby Ayomide", eventTitle: "Naming Ceremony", venue: "St. Peter's Hall", address: "Yaba, Lagos", description: "We are overjoyed to welcome our little one and invite you to share in our joy." },
  Anniversary: { hostName: "Michael & Grace", eventTitle: "10th Wedding Anniversary", venue: "Radisson Blu", address: "Ikeja GRA, Lagos", description: "A decade of love, laughter and partnership." },
  Corporate: { hostName: "Teks Tech Ltd", eventTitle: "Annual Product Launch", venue: "Landmark Event Centre", address: "Oniru, Lagos", description: "You are cordially invited to our annual showcase of new products and partnerships." },
  Church: { hostName: "Grace Family Church", eventTitle: "Thanksgiving Service", venue: "Grace Family Church Auditorium", address: "Ajah, Lagos", description: "A special service of thanksgiving. Come with a grateful heart." },
  "Traditional Ceremony": { hostName: "The Adeyemi & Okonkwo Families", eventTitle: "Traditional Wedding Ceremony", venue: "Civic Centre Event Hall", address: "Ozumba Mbadiwe, Lagos", description: "With joy in our hearts, we invite you to witness the union of our families in the richness of our tradition." },
  "Baby Shower": { hostName: "Funmi Adebayo", eventTitle: "Baby Shower", venue: "The Garden Room", address: "Ikoyi, Lagos", description: "A little one is on the way! Join us for an afternoon of love, laughter and tiny gifts." },
  "Bridal Shower": { hostName: "Amaka & Friends", eventTitle: "Bridal Shower", venue: "Rosewood Lounge", address: "Lekki, Lagos", description: "Help us shower the bride-to-be with love before her big day." },
  Engagement: { hostName: "Tobi & Ifeoma", eventTitle: "Engagement Ceremony", venue: "The Pearl Garden", address: "Victoria Island, Lagos", description: "We said yes! Join us as we celebrate the start of our forever." },
  "Funeral / Celebration of Life": { hostName: "The Family of Pa James Adewale", eventTitle: "Service of Songs & Celebration of Life", venue: "St. Andrew's Cathedral", address: "Marina, Lagos", description: "We invite family and friends to join us in honouring a life well lived." },
  Other: { hostName: "Your Name Here", eventTitle: "Your Event Title", venue: "Your Venue", address: "Your Address", description: "Your event description goes here." },
};
export default function TemplatePreviewModal({ template, onClose, onUse }: { template: any; onClose: () => void; onUse?: () => void }) {
  const theme = { primary: "#2563EB", secondary: "#F8FAFC", background: "#0F172A", font: "serif", ...(template.configuration?.theme ?? {}) };
  const sample = SAMPLE[template.category] ?? SAMPLE.Other;
  const inv: InvData = { eventType: template.category, date: new Date(Date.now() + 30 * 864e5).toISOString(), startTime: "16:00", theme, photos: {}, ...sample } as InvData;
  return (
    <div role="dialog" aria-modal className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-sm overflow-y-auto rounded-2xl border border-white/10" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between bg-navy p-3"><p className="text-sm font-semibold">{template.name} — Preview</p><button onClick={onClose} aria-label="Close preview" className="rounded-lg px-2 py-1 text-lg leading-none hover:bg-white/10">×</button></div>
        <InvitationView inv={inv} />
        {onUse && <div className="bg-navy p-3"><button onClick={onUse} className="btn-primary w-full">Use This Template</button></div>}
      </div>
    </div>
  );
}
