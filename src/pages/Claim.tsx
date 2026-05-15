import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Loader2, Check, AlertCircle, Mail } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

type Stage = "claiming" | "form" | "submitting" | "done" | "error";

const Claim = () => {
  const [params] = useSearchParams();
  const reference = params.get("reference") || "";
  const [stage, setStage] = useState<Stage>("claiming");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!reference) {
      setStage("error");
      setErrorMsg("Missing payment reference. Please contact pr@otownparty.com");
      return;
    }

    // Pull buyer details stashed before Paystack opened
    let prefName = "";
    let prefEmail = "";
    try {
      const stash = localStorage.getItem(`otp_buyer_${reference}`);
      if (stash) {
        const b = JSON.parse(stash);
        prefName = b?.name || "";
        prefEmail = b?.email || "";
      }
    } catch {}

    if (prefName) setName(prefName);
    if (prefEmail) setEmail(prefEmail);

    const hasValidDetails =
      prefName.trim().length >= 2 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(prefEmail.trim());

    if (hasValidDetails) {
      autoClaim(prefName.trim(), prefEmail.trim());
    } else {
      // Buyer details missing from localStorage (different browser/device)
      setStage("form");
    }
  }, [reference]);

  const autoClaim = async (buyerName: string, buyerEmail: string) => {
    setStage("claiming");
    try {
      const { data, error } = await supabase.functions.invoke("claim-tickets", {
        body: { reference, name: buyerName, email: buyerEmail },
      });

      if (error) {
        throw new Error(
          error.message ||
          "Failed to issue tickets. Contact pr@otownparty.com with ref: " + reference
        );
      }

      if (!data?.success) {
        // Already claimed — still show success, it's their payment
        if (
          data?.error?.includes("already claimed") ||
          data?.error?.includes("Tickets already")
        ) {
          setName(buyerName);
          setEmail(buyerEmail);
          setStage("done");
          toast.info("Tickets were already issued — check your email including spam.");
          return;
        }
        throw new Error(data?.error || "Failed to issue tickets");
      }

      try { localStorage.removeItem(`otp_buyer_${reference}`); } catch {}

      setName(buyerName);
      setEmail(buyerEmail);
      setStage("done");

      if (!data.emailSent) {
        toast.error(
          "Tickets saved but email failed. Contact pr@otownparty.com with ref: " + reference
        );
      }
    } catch (err) {
      const msg = (err as Error).message;

      // If payment not yet marked verified, wait 3s and retry once
      if (msg.includes("not yet verified") || msg.includes("pending")) {
        await new Promise((r) => setTimeout(r, 3000));
        try {
          const { data, error } = await supabase.functions.invoke("claim-tickets", {
            body: { reference, name: buyerName, email: buyerEmail },
          });
          if (!error && data?.success) {
            try { localStorage.removeItem(`otp_buyer_${reference}`); } catch {}
            setName(buyerName);
            setEmail(buyerEmail);
            setStage("done");
            return;
          }
        } catch {}
      }

      // Fall back to pre-filled manual form
      setName(buyerName);
      setEmail(buyerEmail);
      setStage("form");
      toast.error("Auto-issue failed — please confirm your details below.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) return toast.error("Please enter your full name");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return toast.error("Please enter a valid email address");

    setStage("submitting");
    try {
      const { data, error } = await supabase.functions.invoke("claim-tickets", {
        body: { reference, name: name.trim(), email: email.trim() },
      });

      if (error || !data?.success) {
        throw new Error(error?.message || data?.error || "Failed to issue tickets");
      }

      setStage("done");
      if (!data.emailSent) {
        toast.error("Tickets created but email failed. Save your reference: " + reference);
      }
    } catch (err) {
      setStage("form");
      toast.error((err as Error).message);
    }
  };

  // Confetti on success
  useEffect(() => {
    if (stage !== "done") return;

    const duration = 7000;
    const colors = ["#f5a623", "#e8728a", "#7fb8e8", "#ffffff", "#ffd700", "#ff6b6b", "#a8e6cf"];
    const end = Date.now() + duration;
    let animFrame: number;

    const runConfetti = () => {
      const confetti = (window as any).confetti;
      if (!confetti) return;
      const frame = () => {
        if (Date.now() > end) return;
        confetti({ particleCount: 8, angle: 60, spread: 90, origin: { x: 0, y: 0.1 }, colors, zIndex: 9999, gravity: 0.8, scalar: 1.1 });
        confetti({ particleCount: 8, angle: 120, spread: 90, origin: { x: 1, y: 0.1 }, colors, zIndex: 9999, gravity: 0.8, scalar: 1.1 });
        confetti({ particleCount: 6, angle: 90, spread: 130, origin: { x: 0.5, y: 0 }, colors, zIndex: 9999, gravity: 0.7, scalar: 1.2 });
        animFrame = requestAnimationFrame(frame);
      };
      confetti({ particleCount: 120, spread: 160, origin: { x: 0.5, y: 0.3 }, colors, zIndex: 9999, gravity: 0.9, scalar: 1.2 });
      frame();
    };

    const existing = document.getElementById("confetti-script");
    if (existing) {
      runConfetti();
    } else {
      const script = document.createElement("script");
      script.id = "confetti-script";
      script.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js";
      script.onload = () => {
        try {
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain); gain.connect(audioCtx.destination);
          osc.frequency.setValueAtTime(523, audioCtx.currentTime);
          osc.frequency.setValueAtTime(659, audioCtx.currentTime + 0.1);
          osc.frequency.setValueAtTime(784, audioCtx.currentTime + 0.2);
          osc.frequency.setValueAtTime(1047, audioCtx.currentTime + 0.3);
          gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
          osc.start(audioCtx.currentTime); osc.stop(audioCtx.currentTime + 0.8);
        } catch {}
        runConfetti();
      };
      document.head.appendChild(script);
    }
    return () => { if (animFrame) cancelAnimationFrame(animFrame); };
  }, [stage]);

  const firstName = name.trim().split(/\s+/)[0] || "Raver";

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20 min-h-[80vh]">
        <div className="container mx-auto max-w-lg px-4">

          {/* Auto-claiming spinner */}
          {stage === "claiming" && (
            <div className="bg-card border border-border rounded-xl p-10 text-center">
              <Loader2 className="mx-auto text-primary animate-spin mb-4" size={36} />
              <h1 className="font-display font-bold text-xl text-foreground mb-2">
                Confirming payment &amp; issuing your tickets…
              </h1>
              <p className="text-sm text-muted-foreground">
                {email ? `Sending QR code to ${email}` : "This only takes a moment."}
              </p>
            </div>
          )}

          {/* Manual submit spinner */}
          {stage === "submitting" && (
            <div className="bg-card border border-border rounded-xl p-10 text-center">
              <Loader2 className="mx-auto text-primary animate-spin mb-4" size={36} />
              <h1 className="font-display font-bold text-xl text-foreground mb-2">
                Generating your tickets…
              </h1>
              <p className="text-sm text-muted-foreground">
                Sending QR code to <span className="text-primary">{email}</span>
              </p>
            </div>
          )}

          {/* Error state */}
          {stage === "error" && (
            <div className="bg-card border border-border rounded-xl p-10 text-center">
              <AlertCircle className="mx-auto text-red-400 mb-4" size={36} />
              <h1 className="font-display font-bold text-xl text-foreground mb-2">
                Something went wrong
              </h1>
              <p className="text-sm text-muted-foreground mb-2">{errorMsg}</p>
              {reference && (
                <p className="text-xs text-muted-foreground/60 font-mono break-all mb-6">
                  Ref: {reference}
                </p>
              )}
              <div className="flex flex-col gap-3">
                <a
                  href={`mailto:pr@otownparty.com?subject=Ticket%20Issue&body=Reference%3A%20${reference}`}
                  className="inline-block px-6 py-3 rounded-lg border border-primary text-primary font-semibold text-sm hover:bg-primary/10 transition"
                >
                  Email Support
                </a>
                <Link
                  to="/tickets"
                  className="inline-block px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm"
                >
                  Back to tickets
                </Link>
              </div>
            </div>
          )}

          {/* Fallback manual form */}
          {stage === "form" && (
            <div className="bg-card border border-border rounded-xl p-8">
              <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-2">
                Payment confirmed ✓
              </p>
              <h1 className="font-display font-bold text-2xl text-foreground mb-1">
                Almost there — confirm your details
              </h1>
              <p className="text-sm text-muted-foreground mb-6">
                We'll send your QR code to the email below right away.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={100}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Your name as you'd like it on the ticket"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    maxLength={255}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="where to send your QR"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:brightness-110 transition"
                >
                  Send My Tickets
                </button>
              </form>
            </div>
          )}

          {/* SUCCESS — Congratulatory page */}
          {stage === "done" && (
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

                <h1 className="font-display font-bold text-2xl sm:text-3xl text-foreground text-center leading-tight mb-2">
                  YOU'RE IN,{" "}
                  <span className="text-primary uppercase">{firstName}</span>.{" "}
                  <span>⚡️</span>
                </h1>

                <p className="text-sm text-muted-foreground text-center italic mb-8">
                  Let the countdown to the next Otown movement begin now.
                </p>

                <div className="border-t border-border/50 pt-6 mb-6">
                  <p className="text-primary text-[10px] font-bold uppercase tracking-[0.25em] mb-3">
                    The Experience
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Buckle up{" "}
                    <span className="text-primary font-semibold">{firstName}</span>. You've
                    officially locked into the{" "}
                    <span className="text-foreground font-semibold">Otown movement</span> — a space
                    where the music blends with culture and art to dictate the reality. Your unique
                    entry key and digital pass have been sent to{" "}
                    <span className="text-primary font-semibold break-all">{email}</span>. From
                    this moment onward, you are part of the movement.
                  </p>
                </div>

                <div className="border-t border-border/50 pt-6 mb-8">
                  <p className="text-primary text-[10px] font-bold uppercase tracking-[0.25em] mb-4">
                    What Next?
                  </p>
                  <ul className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                    <li className="flex gap-3">
                      <span className="text-primary font-bold shrink-0">•</span>
                      <span>
                        <span className="text-foreground font-semibold uppercase text-xs tracking-wide">
                          Secure the pass:{" "}
                        </span>
                        Check your email inbox or spam immediately. Your QR code is your only way
                        past the gates.
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-bold shrink-0">•</span>
                      <span>
                        <span className="text-foreground font-semibold uppercase text-xs tracking-wide">
                          Prepare the vibe:{" "}
                        </span>
                        Clear your schedule. The movement waits for no one.
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-bold shrink-0">•</span>
                      <span>
                        <span className="text-foreground font-semibold uppercase text-xs tracking-wide">
                          Stay locked:{" "}
                        </span>
                        Follow our socials for secret location reveals and set times.
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-bold shrink-0">•</span>
                      <span>
                        <span className="text-foreground font-semibold uppercase text-xs tracking-wide">
                          Come prepared:{" "}
                        </span>
                        Unfiltered vibes require unfiltered energy.
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="border-t border-border/50 pt-6 mb-6 text-center">
                  <p className="text-sm text-foreground font-semibold mb-1">
                    Welcome to the inner circle.
                  </p>
                  <p className="text-xs text-muted-foreground">— The Otown Party Crew 🛸</p>
                </div>

                <p className="text-xs text-muted-foreground inline-flex items-center gap-1.5 justify-center w-full mb-6">
                  <Mail size={12} /> Don't see the email? Check your spam folder.
                </p>

                <Link
                  to="/"
                  className="block w-full py-3.5 rounded-lg bg-primary text-primary-foreground text-center font-display font-semibold text-sm hover:brightness-110 transition"
                >
                  Back to home
                </Link>
              </div>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
};

export default Claim;
