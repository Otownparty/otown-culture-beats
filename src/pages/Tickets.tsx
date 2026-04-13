import { useState } from "react";
import { Check, Mail, MapPin, Instagram, Twitter, Youtube } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

const tickets = [
  {
    name: "Early Bird",
    badge: "Best Value",
    price: "TBA",
    features: ["Full event access", "Welcome drink", "Digital memento"],
    accent: "primary" as const,
    featured: true,
  },
  {
    name: "Standard Access",
    price: "TBA",
    features: ["Full event access", "All stages and areas"],
    accent: "foreground" as const,
    featured: false,
  },
  {
    name: "VIP Experience",
    price: "TBA",
    features: ["VIP lounge access", "Premium bar", "Exclusive merch", "Priority entry"],
    accent: "pink" as const,
    featured: false,
  },
];

const Tickets = () => {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto max-w-6xl px-4">
          <ScrollReveal>
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-2">Tickets & Contact</p>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-4">Join the Movement – Get Your Tickets</h1>
            <p className="text-muted-foreground max-w-2xl mb-16">Secure your place at the most anticipated rave event of 2026. Tickets are limited.</p>
          </ScrollReveal>

          <div className="grid lg:grid-cols-2 gap-12 mb-20">
            {/* Ticket Tiers */}
            <div className="space-y-6">
              {tickets.map((t) => (
                <ScrollReveal key={t.name}>
                  <div className={`bg-card border rounded-xl p-6 transition-all hover:-translate-y-1 ${
                    t.featured ? "border-primary border-l-4" : t.accent === "pink" ? "border-pink/40" : "border-border"
                  }`}>
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-display font-bold text-lg text-foreground">{t.name}</h3>
                      {t.badge && <span className="bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">{t.badge}</span>}
                    </div>
                    <p className="text-2xl font-display font-bold text-foreground mb-4">{t.price}</p>
                    <ul className="space-y-2 mb-6">
                      {t.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Check size={14} className="text-primary flex-shrink-0" /> {f}
                        </li>
                      ))}
                    </ul>
                    <button className={`w-full py-3 rounded-lg font-semibold text-sm transition ${
                      t.featured
                        ? "bg-primary text-primary-foreground hover:brightness-110"
                        : t.accent === "pink"
                        ? "border border-pink text-pink hover:bg-pink/10"
                        : "border border-foreground/30 text-foreground hover:border-primary hover:text-primary"
                    }`}>
                      Get {t.name} Ticket
                    </button>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* Contact Form */}
            <ScrollReveal>
              <div className="bg-card border border-border rounded-xl p-8">
                <h2 className="font-display font-bold text-xl text-foreground mb-6">Get In Touch</h2>
                {sent ? (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="text-primary" size={32} />
                    </div>
                    <h3 className="font-display font-bold text-lg text-foreground">Message Sent!</h3>
                    <p className="text-sm text-muted-foreground">We'll get back to you within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
                      <input
                        type="text"
                        required
                        maxLength={100}
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Email Address</label>
                      <input
                        type="email"
                        required
                        maxLength={255}
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Message</label>
                      <textarea
                        required
                        maxLength={1000}
                        rows={4}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                        placeholder="Your message..."
                      />
                    </div>
                    <button type="submit" className="w-full py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:brightness-110 transition">
                      Send Message
                    </button>
                  </form>
                )}
              </div>

              {/* Contact details */}
              <div className="bg-card border border-border rounded-xl p-6 mt-6 space-y-4">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Mail size={16} className="text-primary" /> pr@otownparty.com
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <MapPin size={16} className="text-primary" /> Africa – Location Announced Per Edition
                </div>
                <div className="flex gap-4 pt-2">
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram"><Instagram size={20} /></a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Twitter"><Twitter size={20} /></a>
                  <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="TikTok">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
                  </a>
                  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="YouTube"><Youtube size={20} /></a>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Tickets;
