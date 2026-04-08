import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Calendar as CalIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import spotlightImg from "@/assets/event-spotlight.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";

const editions = [
  { num: 1, year: "2015", title: "The Genesis", desc: "Where it all began — the first heartbeat of a movement.", img: gallery1 },
  { num: 2, year: "2016", title: "Rising Energy", desc: "The crowd doubled, the energy tripled.", img: gallery2 },
  { num: 3, year: "2017", title: "The Culture Drop", desc: "Fashion met music on the dancefloor.", img: gallery3 },
  { num: 4, year: "2017", title: "Midnight Fire", desc: "An all-night celebration that broke records.", img: gallery4 },
  { num: 5, year: "2018", title: "Continental Sound", desc: "The most diverse lineup in Otown history.", img: gallery1 },
  { num: 6, year: "2019", title: "The Revolution", desc: "Breaking boundaries, rewriting rules.", img: gallery2 },
  { num: 7, year: "2020", title: "Resilience", desc: "Against all odds, the movement persevered.", img: gallery3 },
  { num: 8, year: "2021", title: "Rebirth", desc: "The world opened back up — and we were ready.", img: gallery4 },
  { num: 9, year: "2022", title: "Golden Era", desc: "The most photographed edition ever.", img: gallery1 },
  { num: 10, year: "2024", title: "A Decade of Raving", desc: "Celebrating a milestone — 10 years of culture.", img: gallery2 },
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
                <div className="aspect-video overflow-hidden">
                  <img src={ed.img} alt={`Edition ${ed.num}: ${ed.title}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-75 group-hover:brightness-100" loading="lazy" />
                </div>
                <div className="p-5">
                  <span className="text-xs text-primary font-semibold uppercase tracking-wider">Edition {ed.num} · {ed.year}</span>
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
