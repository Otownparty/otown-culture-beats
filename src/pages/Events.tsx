import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Calendar as CalIcon } from "lucide-react";
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
  { num: 1, date: "Sat 27th April 2024", title: "The Genesis", desc: "Where it all began — music, games, dance, drink, and connect at LaBamba Resort.", img: edition1 },
  { num: 2, date: "Sat 22nd June 2024", title: "Frenzy Edition", desc: "The energy tripled — the Frenzy Edition took LaBamba Resort by storm.", img: edition2 },
  { num: 3, date: "Sat 14th Sept 2024", title: "Y2K Edition", desc: "A retro-futuristic throwback — the flyest wave hit LaBamba Resort.", img: edition3 },
  { num: 4, date: "Sat 26th Oct 2024", title: "Halloween: Terror By Night", desc: "A spine-chilling Halloween celebration at LaBamba Resort.", img: edition4 },
  { num: 5, date: "Sat 21st Dec 2024", title: "Party of the Year", desc: "The ultimate year-ender — Party of the Year at LaBamba Resort, Oyo.", img: edition5 },
  { num: 6, date: "Sat 15th Feb 2025", title: "XOXO Edition", desc: "Love was in the air — the Valentine's XOXO Edition at LaBamba Resort.", img: edition6 },
  { num: 7, date: "Sat 31st May 2025", title: "Owanbe Edition", desc: "1 Year Anniversary — the Owanbe Edition celebrated African culture at LaBamba Hotel & Resort.", img: edition7 },
  { num: 8, date: "Sat 25th Oct 2025", title: "Haunted Groove Halloween", desc: "The scariest night of the year — Haunted Groove at LaBamba Hotel & Resort.", img: edition8 },
  { num: 9, date: "Tue 30th Dec 2025", title: "POTY", desc: "Party of the Year returned — closing out 2025 at LaBamba Resort, Oyo.", img: edition9 },
  { num: 10, date: "Sat 21st March 2026", title: "Denim After Dark", desc: "A Decade of Raving — the 10th edition at Oyo Durbar Stadium, Oyo State.", img: edition10 },
];

const Events = () => (
  <>
    <Navbar />
    <main className="pt-24 pb-16">
      <div className="container mx-auto max-w-6xl px-4">
        <ScrollReveal>
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-2">Events & Lineup</p>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-4">Our Editions & Lineup</h1>
          <p className="text-muted-foreground max-w-2xl mb-16 leading-relaxed">Ten iconic chapters. Each one a statement. Together, they tell the story of Africa's most electrifying rave movement.</p>
        </ScrollReveal>

        {/* Spotlight */}
        <ScrollReveal>
          <div className="bg-card border border-border rounded-2xl overflow-hidden mb-20 border-l-4 border-l-primary">
            <div className="grid md:grid-cols-2">
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <span className="inline-block bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4 w-fit">11th Edition</span>
                <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">Otown Party XI — May 2026</h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">The most monumental edition yet. Bigger stage, bigger lineup, bigger energy. This is where the next chapter of African rave culture gets written.</p>
                <div className="flex flex-wrap gap-4 mb-8 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5"><CalIcon size={14} className="text-primary" /> May 2026</span>
                  <span className="flex items-center gap-1.5"><MapPin size={14} className="text-primary" /> Location TBA</span>
                  <span className="bg-muted px-3 py-0.5 rounded-full">Theme TBA</span>
                </div>
                <Link to="/tickets" className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:brightness-110 transition w-fit">
                  Get Tickets Now
                </Link>
              </div>
              <div className="hidden md:block">
                <img src={spotlightImg} alt="Otown Party XI preview" className="w-full h-full object-cover" loading="lazy" width={1024} height={768} />
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Past Editions */}
        <ScrollReveal>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-8">10 Legendary Editions</h2>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {editions.map((ed) => (
            <ScrollReveal key={ed.num}>
              <div className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-all">
                <div className="aspect-[4/5] overflow-hidden">
                  <img src={ed.img} alt={`Edition ${ed.num}: ${ed.title}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
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
          ))}
        </div>
      </div>
    </main>
    <Footer />
  </>
);

export default Events;
