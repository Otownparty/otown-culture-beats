import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import spotlightImg from "@/assets/event-spotlight.jpg";
import edition1 from "@/assets/edition-1.jpg";
import edition2 from "@/assets/edition-2.jpg";
import edition3 from "@/assets/edition-3.jpg";
import edition4 from "@/assets/edition-4.jpg";
import edition5 from "@/assets/edition-5.jpg";
import edition6 from "@/assets/edition-6.jpg";
import edition7 from "@/assets/edition-7.jpg";
import edition8 from "@/assets/edition-8.jpg";
import edition9 from "@/assets/edition-9.jpg";
import edition10 from "@/assets/edition-10.jpg";

const editions = [
  { num: 10, date: "Sat 21st March 2026", title: "Denim After Dark", desc: "A Decade of Raving — the 10th edition at Oyo Durbar Stadium.", img: edition10 },
  { num: 9, date: "Tue 30th Dec 2025", title: "POTY", desc: "Party of the Year returned — closing out 2025 at LaSamba Resort, Oyo.", img: edition9 },
  { num: 8, date: "Sat 25th Oct 2025", title: "Haunted Groove Halloween", desc: "The scariest night of the year — Haunted Groove at LaSamba Resort celebrates African culture.", img: edition8 },
  { num: 7, date: "Sat 31st May 2025", title: "Owambe Edition", desc: "1 Year Anniversary — the Owambe Edition celebrated African culture in full colour.", img: edition7 },
  { num: 6, date: "Sat 15th Feb 2025", title: "XOXO Edition", desc: "The ultimate year-ender — Party of the Year at LaSamba Resort.", img: edition6 },
  { num: 5, date: "Sat 21st Dec 2024", title: "Party of the Year", desc: "A spine-chilling Halloween celebration at LaSamba Resort.", img: edition5 },
  { num: 4, date: "Sat 26th Oct 2024", title: "Halloween: Terror By Night", desc: "The flyest wave hit LaSamba Resort.", img: edition4 },
  { num: 3, date: "Sat 14th Sept 2024", title: "Y2K Edition", desc: "A retro-futuristic throwback — the flyest wave hit LaSamba Resort.", img: edition3 },
  { num: 2, date: "Sat 22nd June 2024", title: "Frenzy Edition", desc: "The energy tripled — the Frenzy Edition took LaSamba Resort by storm.", img: edition2 },
  { num: 1, date: "Sat 27th April 2024", title: "The Genesis", desc: "Where it all began — music, games, dance, drink, and connect at the very first Otown Party.", img: edition1 },
];

const Events = () => {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto max-w-6xl px-4">
          <ScrollReveal>
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-2">Events & Lineup</p>
            <h1 className="text-4xl sm:text-6xl font-display font-bold text-foreground mb-4">Our Editions & Lineup</h1>
            <p className="text-muted-foreground max-w-2xl mb-16 leading-relaxed">Ten iconic chapters. Each one a statement. Together, they tell the story of a movement.</p>
          </ScrollReveal>

          {/* Spotlight */}
          <ScrollReveal>
            <div className="bg-card border border-border rounded-2xl overflow-hidden mb-20 border-l-4 border-l-primary">
              <div className="grid md:grid-cols-2">
                <div className="p-8 p-12 flex flex-col justify-center">
                  <span className="inline-block bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
                    Otown Party 11.0 — Anniversary Edition
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">Glow in the 90s — Chapter II</h2>
                  <p className="text-muted-foreground mb-6 leading-relaxed">The Anniversary Edition returns — bigger stage, bigger lineup. A neon-soaked throwback to the era that started it all.</p>
                  <div className="flex flex-wrap gap-4 mb-8 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Calendar size={14} className="text-primary" /> Sat 30th May 2026 · 6PM – 4AM</span>
                    <span className="flex items-center gap-1.5"><MapPin size={14} className="text-primary" /> Oyo Durbar Stadium</span>
                    <span className="bg-muted px-3 py-0.5 rounded-full">Glow in the 90s</span>
                  </div>
                  <Link to="/tickets" className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm">
                    Get Tickets Now
                  </Link>
                </div>
                <div className="hidden md:block">
                  <img src={spotlightImg} alt="Otown Party XI preview" className="w-full h-full object-cover" loading="lazy" width={1024} />
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Past Editions */}
          <ScrollReveal>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-8">10 Legendary Editions</h2>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {editions.map((ed) => {
              return (
                <ScrollReveal key={ed.num}>
                  <div className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-all">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img src={ed.img} alt={`Edition ${ed.num}: ${ed.title}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-5">
                      <span className="text-xs text-primary font-semibold uppercase tracking-wider">Edition {ed.num} · {ed.date}</span>
                      <h3 className="font-display font-bold text-lg text-foreground mt-1 mb-2">{ed.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{ed.desc}</p>
                      <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                        View Moments <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Events;
