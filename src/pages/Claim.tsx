import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Loader2, Check, AlertCircle, Mail } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

type Stage = "verifying" | "form" | "submitting" | "done" | "error";

const Claim = () => {
  const [params] = useSearchParams();
  const reference = params.get("reference") || "";
  const [stage, setStage] = useState<Stage>("verifying");
  const [info, setInfo] = useState<{ ticketType: string; quantity: number; amount: number } | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!reference) { setStage("error"); setErrorMsg("Missing payment reference."); return; }
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke("verify-payment", { body: { reference } });
        if (error || !data?.success) throw new Error(error?.message || data?.error || "Verification failed");
        if (data.claimed) {
          setStage("error");
          setErrorMsg("This payment has already been used to claim tickets. Check your email for the QR codes.");
          return;
        }
        setInfo({ ticketType: data.ticketType, quantity: data.quantity, amount: data.amount });
        setStage("form");
      } catch (err) {
        setStage("error");
        setErrorMsg((err as Error).message);
      }
    })();
  }, [reference]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) return toast.error("Please enter your full name");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return toast.error("Please enter a valid email");
    setStage("submitting");
    try {
      const { data, error } = await supabase.functions.invoke("claim-tickets", {
        body: { reference, name: name.trim(), email: email.trim() },
      });
      if (error || !data?.success) throw new Error(error?.message || data?.error || "Failed to issue tickets");
      setStage("done");
      if (!data.emailSent) toast.error("Tickets created but email failed. Save your reference: " + reference);
    } catch (err) {
      setStage("form");
      toast.error((err as Error).message);
    }
  };

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20 min-h-[80vh]">
        <div className="container mx-auto max-w-lg px-4">
          {stage === "verifying" && (
            <div className="bg-card border border-border rounded-xl p-10 text-center">
              <Loader2 className="mx-auto text-primary animate-spin mb-4" size={36} />
              <h1 className="font-display font-bold text-xl text-foreground mb-2">Confirming your payment…</h1>
              <p className="text-sm text-muted-foreground">This only takes a moment.</p>
            </div>
          )}

          {stage === "error" && (
            <div className="bg-card border border-border rounded-xl p-10 text-center">
              <AlertCircle className="mx-auto text-red-400 mb-4" size={36} />
              <h1 className="font-display font-bold text-xl text-foreground mb-2">Something went wrong</h1>
              <p className="text-sm text-muted-foreground mb-6">{errorMsg}</p>
              <Link to="/tickets" className="inline-block px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm">Back to tickets</Link>
            </div>
          )}

          {(stage === "form" || stage === "submitting") && info && (
            <div className="bg-card border border-border rounded-xl p-8">
              <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-2">Payment confirmed ✓</p>
              <h1 className="font-display font-bold text-2xl text-foreground mb-1">Claim Your Ticket{info.quantity > 1 ? "s" : ""}</h1>
              <p className="text-sm text-muted-foreground mb-6">
                {info.quantity}× {info.ticketType} — ₦{(info.amount / 100).toLocaleString()} paid. Enter your details and we'll email your QR code{info.quantity > 1 ? "s" : ""}.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
                  <input type="text" required maxLength={100} value={name} onChange={(e) => setName(e.target.value)}
                    disabled={stage === "submitting"}
                    className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Your name as you'd like it on the ticket" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Email Address</label>
                  <input type="email" required maxLength={255} value={email} onChange={(e) => setEmail(e.target.value)}
                    disabled={stage === "submitting"}
                    className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="where to send your QR" />
                </div>
                <button type="submit" disabled={stage === "submitting"}
                  className="w-full py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:brightness-110 transition disabled:opacity-60">
                  {stage === "submitting" ? (
                    <span className="inline-flex items-center gap-2"><Loader2 size={14} className="animate-spin" /> Generating tickets…</span>
                  ) : "Get Ticket"}
                </button>
              </form>
            </div>
          )}

          {stage === "done" && (() => {
            const firstName = name.trim().split(/\s+/)[0] || "Raver";
            return (
              <div className="relative bg-card border border-primary/30 rounded-2xl p-8 sm:p-10 overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10">
                  <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mb-5">
                    <Check className="text-primary" size={26} />
                  </div>

                  <p className="text-primary text-xs font-semibold uppercase tracking-[0.2em] mb-3 text-center">
                    Access Granted
                  </p>
                  <h1 className="font-display font-bold text-2xl sm:text-3xl text-foreground text-center leading-tight mb-6">
                    You're in, <span className="text-primary">{firstName}</span>. <span className="text-primary">⚡️</span>
                  </h1>
                  <p className="text-sm text-muted-foreground text-center italic mb-8">
                    Let the countdown to the next Otown movement begin now.
                  </p>

                  <div className="mb-6">
                    <p className="text-primary text-[11px] font-semibold uppercase tracking-[0.2em] mb-2">The Experience</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Buckle up <span className="text-primary font-semibold">{firstName}</span>. You've officially locked into the <span className="text-foreground font-semibold">Otown movement</span> — a space where the music blends with culture and art to dictate the reality. Your unique entry key and digital pass have been sent to <span className="text-primary font-semibold break-all">{email}</span>. From this moment onward, you are part of the movement. Secure your credentials; the vibe is already waiting for you.
                    </p>
                  </div>

                  <div className="mb-8">
                    <p className="text-primary text-[11px] font-semibold uppercase tracking-[0.2em] mb-3">What Next?</p>
                    <ul className="space-y-2.5 text-sm text-muted-foreground leading-relaxed">
                      <li className="flex gap-2.5">
                        <span className="text-primary mt-1.5 w-1 h-1 rounded-full bg-primary shrink-0" />
                        <span><span className="text-foreground font-semibold">Secure the pass:</span> Check your email inbox or spam immediately. Your QR code is your only way past the gates.</span>
                      </li>
                      <li className="flex gap-2.5">
                        <span className="text-primary mt-1.5 w-1 h-1 rounded-full bg-primary shrink-0" />
                        <span><span className="text-foreground font-semibold">Prepare the vibe:</span> Clear your schedule. The movement waits for no one.</span>
                      </li>
                      <li className="flex gap-2.5">
                        <span className="text-primary mt-1.5 w-1 h-1 rounded-full bg-primary shrink-0" />
                        <span><span className="text-foreground font-semibold">Stay locked:</span> Follow our socials for secret location reveals and set times.</span>
                      </li>
                      <li className="flex gap-2.5">
                        <span className="text-primary mt-1.5 w-1 h-1 rounded-full bg-primary shrink-0" />
                        <span><span className="text-foreground font-semibold">Come prepared:</span> You just signed up for the best experience of unfiltered vibes, so come with unfiltered energy.</span>
                      </li>
                    </ul>
                  </div>

                  <p className="text-sm text-foreground font-semibold text-center mb-1">Welcome to the inner circle.</p>
                  <p className="text-xs text-muted-foreground text-center mb-6">— The Otown Party Crew 🛸</p>

                  <p className="text-xs text-muted-foreground inline-flex items-center gap-1.5 justify-center w-full mb-6">
                    <Mail size={12} /> Don't see the email? Check your spam folder.
                  </p>

                  <Link to="/" className="block w-full py-3.5 rounded-lg bg-primary text-primary-foreground text-center font-display font-semibold text-sm hover:brightness-110 transition">
                    Back to home
                  </Link>
                </div>
              </div>
            );
          })()}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Claim;
