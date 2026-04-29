import { useState } from "react";
import { Check, Mail, MapPin, Loader2, Minus, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

const tickets = [
  { name: "Early Bird", badge: "Best Value", price: 4000, features: ["Full event access"], accent: "primary" as const, featured: true },
  { name: "Regular", price: 5000, features: ["Full event access"], accent: "foreground" as const, featured: false },
  { name: "VIP Experience", price: 15000, features: ["Full stage access", "Premium visibility", "Priority entry", "Access to merch"], accent: "pink" as const, featured: false },
];

declare global { interface Window { PaystackPop?: any } }

const loadPaystackScript = () => new Promise<void>((resolve, reject) => {
  if (window.PaystackPop) return resolve();
  const s = document.createElement("script");
  s.src = "https://js.paystack.co/v1/inline.js";
  s.onload = () => resolve();
  s.onerror = () => reject(new Error("Failed to load Paystack"));
  document.head.appendChild(s);
});

const Tickets = () => {
  const navigate = useNavigate();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const getQty = (name: string) => quantities[name] ?? 1;
  const setQty = (name: string, qty: number) =>
    setQuantities((q) => ({ ...q, [name]: Math.max(1, Math.min(10, qty)) }));

  const handleBuy = async (ticketName: string) => {
    const quantity = getQty(ticketName);
    setLoading(ticketName);
    try {
      await loadPaystackScript();
      const { data, error } = await supabase.functions.invoke("initialize-payment", {
        body: { ticketType: ticketName, quantity },
      });
      if (error || !data?.reference) throw new Error(error?.message || "Failed to start payment");

      const handler = window.PaystackPop.setup({
        key: data.publicKey,
        email: `guest+${data.reference}@otownparty.com`, // placeholder; collected after payment
        amount: data.amount,
        currency: "NGN",
        ref: data.reference,
        metadata: { ticketType: ticketName, quantity },
        onClose: () => setLoading(null),
        callback: (response: any) => {
          // Paystack succeeded — redirect to claim page; verification happens there.
          navigate(`/claim?reference=${encodeURIComponent(response.reference)}`);
        },
      });
      handler.openIframe();
    } catch (err) {
      console.error(err);
      toast.error((err as Error).message || "Could not start payment");
      setLoading(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSent(true); };

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
            <div className="space-y-6">
              {tickets.map((t) => {
                const qty = getQty(t.name);
                const total = t.price * qty;
                const isLoading = loading === t.name;
                return (
                  <ScrollReveal key={t.name}>
                    <div className={`bg-card border rounded-xl p-6 transition-all hover:-translate-y-1 ${
                      t.featured ? "border-primary border-l-4" : t.accent === "pink" ? "border-pink-400/40" : "border-border"
                    }`}>
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-display font-bold text-lg text-foreground">{t.name}</h3>
                        {t.badge && (
                          <span className="bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">{t.badge}</span>
                        )}
                      </div>
                      <p className="text-2xl font-display font-bold text-foreground mb-4">₦{t.price.toLocaleString()}</p>
                      <ul className="space-y-2 mb-5">
                        {t.features.map((f) => (
                          <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Check size={14} className="text-primary flex-shrink-0" /> {f}
                          </li>
                        ))}
                      </ul>

                      <div className="flex items-center justify-between mb-4 bg-muted/40 rounded-lg p-2">
                        <span className="text-sm text-muted-foreground pl-2">Quantity</span>
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => setQty(t.name, qty - 1)} disabled={qty <= 1 || isLoading}
                            className="w-8 h-8 rounded-md bg-background border border-border flex items-center justify-center text-foreground hover:border-primary disabled:opacity-40">
                            <Minus size={14} />
                          </button>
                          <span className="w-6 text-center font-semibold text-foreground">{qty}</span>
                          <button type="button" onClick={() => setQty(t.name, qty + 1)} disabled={qty >= 10 || isLoading}
                            className="w-8 h-8 rounded-md bg-background border border-border flex items-center justify-center text-foreground hover:border-primary disabled:opacity-40">
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      <button onClick={() => handleBuy(t.name)} disabled={isLoading}
                        className={`block w-full py-3 rounded-lg font-semibold text-sm transition text-center disabled:opacity-60 ${
                          t.featured ? "bg-primary text-primary-foreground hover:brightness-110"
                          : t.accent === "pink" ? "border border-pink-400 text-pink-400 hover:bg-pink-400/10"
                          : "border border-foreground/30 text-foreground hover:border-primary hover:text-primary"
                        }`}>
                        {isLoading ? (
                          <span className="inline-flex items-center gap-2"><Loader2 size={14} className="animate-spin" /> Opening payment…</span>
                        ) : (
                          <>Get {t.name} — Pay ₦{total.toLocaleString()}</>
                        )}
                      </button>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>

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
                      <input type="text" required maxLength={100} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Your name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Email Address</label>
                      <input type="email" required maxLength={255} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="your@email.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Message</label>
                      <textarea required maxLength={1000} rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" placeholder="Your message..." />
                    </div>
                    <button type="submit" className="w-full py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:brightness-110 transition">Send Message</button>
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
