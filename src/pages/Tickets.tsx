import { useState } from "react";
import { Check, Mail, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

const tickets = [
  {
    name: "Early Bird",
    badge: "Best Value",
    price: "₦4,000",
    features: ["Full event access"],
    accent: "primary" as const,
    featured: true,
  },
  {
    name: "Regular",
    price: "₦5,000",
    features: ["Full event access"],
    accent: "foreground" as const,
    featured: false,
  },
  {
    name: "VIP Experience",
    price: "₦15,000",
    features: ["Full stage access", "Premium visibility", "Priority entry", "Access to merch"],
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
                    t.featured ? "border-primary border-l-4" : t.accent === "pink" ? "border-pink-400/40" : "border-border"
                  }`}>
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-display font-bold text-lg text-foreground">{t.name}</h3>
                      {t.badge && (
                        <span className="bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                          {t.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-2xl font-display font-bold text-foreground mb-4">{t.price}</p>
                    <ul className="space-y-2 mb-6">
                      {t.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Check size={14} className="text-primary flex-shrink-0" /> {f}
                        </li>
                      ))}
                    </ul>
                    <a
                      href="https://selar.com/1778771257"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`block w-full py-3 rounded-lg font-semibold text-sm transition text-center ${
                        t.featured
                          ? "bg-primary text-primary-foreground hover:brightness-110"
                          : t.accent === "pink"
                          ? "border border-pink-400 text-pink-400 hover:bg-pink-400/10"
                          : "border border-foreground/30 text-foreground hover:border-primary hover:text-primary"
                      }`}
                    >
                      Get {t.name} Ticket
                    </a>
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
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:brightness-110 transition"
                    >
                      Send Message
                    </button>
                  </form>
                )}
              </div>

              <div className="bg-card border border-border rounded-xl p-6 mt-6 space-y-4">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Mail size={16} className="text-primary" />
                  <a href="mailto:pr@otownparty.com" className="hover:text-primary transition">pr@otownparty.com</a>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <MapPin size={16} className="text-primary" /> Africa – Location Announced Per Edition
                </div>
                <div className="flex gap-4 pt-2">
                  <a href="https://www.instagram.com/o_town_party?igsh=MWVrNTR2OWViMjl4cg%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                  </a>
                  <a href="https://www.tiktok.com/@otown.party?_r=1&_t=ZS-95PD2A5A8wR" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.14a8.16 8.16 0 004.77 1.52V7.2a4.85 4.85 0 01-1-.51z"/></svg>
                  </a>
                  <a href="https://youtube.com/@otownparty?si=HSjtK_yE06ik8Gp1" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  </a>
                  <a href="https://chat.whatsapp.com/L1XOSfBpM3uLL8CK07QgZY?mode=gi_t" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.38 1.26 4.8L2 22l5.44-1.43c1.37.75 2.93 1.17 4.6 1.17 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm0 18.15c-1.53 0-2.96-.41-4.2-1.12l-.3-.18-3.12.82.83-3.04-.2-.31a8.26 8.26 0 01-1.26-4.42c0-4.54 3.7-8.24 8.25-8.24 4.55 0 8.24 3.7 8.24 8.24 0 4.55-3.69 8.25-8.24 8.25zm4.52-6.17c-.25-.12-1.46-.72-1.69-.8-.22-.08-.39-.12-.55.12-.17.25-.63.8-.77.96-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47c-.17 0-.43.06-.65.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.46-.6 1.67-1.18.21-.57.21-1.06.14-1.17-.06-.1-.22-.16-.47-.28z"/></svg>
                  </a>
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
