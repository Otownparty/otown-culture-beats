import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

const StaffAuth = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/scan", { replace: true });
    });
  }, [navigate]);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/scan");
      } else {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/scan` },
        });
        if (error) throw error;
        toast.success("Account created. Ask an admin to grant you scanner access.");
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-sm bg-card border border-border rounded-xl p-8">
        <h1 className="font-display font-bold text-2xl text-foreground mb-1">Staff {mode === "signin" ? "Sign In" : "Sign Up"}</h1>
        <p className="text-sm text-muted-foreground mb-6">Gate scanner access only.</p>
        <form onSubmit={handle} className="space-y-4">
          <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          <input type="password" required minLength={6} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:brightness-110 transition disabled:opacity-60">
            {loading ? <Loader2 size={14} className="animate-spin inline" /> : mode === "signin" ? "Sign In" : "Sign Up"}
          </button>
        </form>
        <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-4 text-xs text-muted-foreground hover:text-primary w-full text-center">
          {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </div>
    </main>
  );
};

export default StaffAuth;
