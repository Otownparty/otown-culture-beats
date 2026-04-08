import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Users, Music, Flame } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CountdownTimer from "@/components/CountdownTimer";
import ScrollReveal from "@/components/ScrollReveal";
import heroBg from "@/assets/hero-bg.jpg";
import logo from "@/assets/logo-final.png";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";

const stats = [
  { value: "10", label: "Editions Hosted" },
  { value: "5K+", label: "Ravers Per Edition" },
  { value: "50+", label: "Artists Featured" },
  { value: "1", label: "Movement" },
];

const teaserCards = [
  { icon: Calendar, title: "Our Editions", desc: "From the Genesis to A Decade of Raving — explore every chapter.", link: "/events" },
  { icon: Flame, title: "The Movement", desc: "More than a party — a cultural statement rooted in African urban life.", link: "/about" },
  { icon: Music, title: "Gallery", desc: "Captured moments of energy, colour, and community.", link: "/gallery" },
];

const Index = () => (
  <>
    <Navbar />
    <main>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <img src={heroBg} alt="Otown Party concert crowd" className="absolute inset-0 w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/50 to-background/95" />
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-8">
          <img src={logo} alt="Otown Party Logo" className="mx-auto h-28 sm:h-36 w-auto" />
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold text-foreground leading-tight">
            Otown Party – <span className="text-gradient-brand">Let's Rave</span>
          </h1>
          <p className="text-xs sm:text-sm uppercase tracking-[0.25em] text-muted-foreground">
            10 Editions Strong &nbsp;|&nbsp; Celebrating African Urban Culture &nbsp;|&nbsp; Next Edition: May 2026
          </p>

          <CountdownTimer />

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/tickets" className="px-8 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:brightness-110 transition">
              Get Tickets Now
            </Link>
            <Link to="/events" className="px-8 py-3.5 rounded-lg border border-foreground/30 text-foreground font-semibold text-sm hover:border-primary hover:text-primary transition">
              Explore Events
            </Link>
          </div>
        </div>
      </section>

      {/* Teaser */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <ScrollReveal>
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-2">The Movement</p>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">Africa's Premier Rave Experience</h2>
            <p className="text-muted-foreground max-w-2xl mb-12 leading-relaxed">
              What started as a bold vision has grown into 10 iconic editions — each one more electrifying than the last. Otown Party is where African urban culture finds its pulse.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {teaserCards.map((card) => (
              <ScrollReveal key={card.title}>
                <Link to={card.link} className="group block bg-card border border-border rounded-xl p-6 hover:border-primary/40 transition-all hover:-translate-y-1">
                  <card.icon className="text-primary mb-4" size={28} />
                  <h3 className="font-display font-bold text-lg text-foreground mb-2">{card.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{card.desc}</p>
                  <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    Explore <ArrowRight size={14} />
                  </span>
                </Link>
              </ScrollReveal>
            ))}
          </div>

          {/* Stats */}
          <ScrollReveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-card border border-border rounded-xl p-8 mb-16">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-3xl sm:text-4xl font-display font-bold text-primary">{s.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* Gallery preview */}
          <ScrollReveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {[gallery1, gallery2, gallery3, gallery4].map((img, i) => (
                <div key={i} className="aspect-square overflow-hidden rounded-lg">
                  <img src={img} alt={`Otown Party moment ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 brightness-75 hover:brightness-100" loading="lazy" />
                </div>
              ))}
            </div>
            <div className="text-center">
              <Link to="/gallery" className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all">
                View Full Gallery <ArrowRight size={16} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
    <Footer />
  </>
);

export default Index;
