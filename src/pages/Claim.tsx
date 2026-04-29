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

          {stage === "done" && (
            <div className="bg-card border border-border rounded-xl p-10 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Check className="text-primary" size={32} />
              </div>
              <h1 className="font-display font-bold text-2xl text-foreground mb-2">You're in! 🎉</h1>
              <p className="text-sm text-muted-foreground mb-2">
                Your ticket{info && info.quantity > 1 ? "s have" : " has"} been emailed to <strong className="text-foreground">{email}</strong>.
              </p>
              <p className="text-xs text-muted-foreground mb-6 inline-flex items-center gap-1.5">
                <Mail size={12} /> Don't see it? Check your spam folder.
              </p>
              <Link to="/" className="inline-block px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm">Back to home</Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Claim;
