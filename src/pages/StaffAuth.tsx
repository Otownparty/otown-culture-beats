import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

const STAFF_EMAIL_DOMAIN = "staff.otownparty.com";

// Staff sign in with a username. Emails still work for admin accounts.
const toEmail = (input: string) => {
  const v = input.trim().toLowerCase();
  return v.includes("@") ? v : `${v}@${STAFF_EMAIL_DOMAIN}`;
};

const StaffAuth = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get("next") || "/scan";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate(next, { replace: true });
    });
  }, [navigate, next]);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: toEmail(username),
        password,
      });
      if (error) throw error;
      // Scanner-only accounts always land on the scanner page.
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id);
      const isAdmin = (roles ?? []).some((r) => r.role === "admin");
      navigate(isAdmin ? next : "/scan", { replace: true });
    } catch (err) {
      toast.error("Invalid username or password.");
    } finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-sm bg-card border border-border rounded-xl p-8">
        <h1 className="font-display font-bold text-2xl text-foreground mb-1">Staff Sign In</h1>
        <p className="text-sm text-muted-foreground mb-6">Gate scanner access only.</p>
        <form onSubmit={handle} className="space-y-4">
          <input type="text" required autoCapitalize="none" autoCorrect="off" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          <input type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:brightness-110 transition disabled:opacity-60">
            {loading ? <Loader2 size={14} className="animate-spin inline" /> : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default StaffAuth;
