import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, LogOut, RefreshCw, Copy, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

type TicketStats = {
  ticketType: string;
  bought: number;
  scanned: number;
};

type BuyerRecord = {
  name: string;
  email: string;
  ticketType: string;
  quantity: number;
  claimedAt: string;
};

const TICKET_TYPES = ["Early Bird", "Regular", "VIP Experience"];

const Record = () => {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<TicketStats[]>([]);
  const [buyers, setBuyers] = useState<BuyerRecord[]>([]);
  const [copied, setCopied] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        navigate("/staff", { replace: true });
        return;
      }
      setAuthChecked(true);
      fetchData();
    });
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all tickets
      const { data: tickets, error: ticketsErr } = await supabase
        .from("tickets")
        .select("ticket_type, used, buyer_name, buyer_email, quantity, payment_reference")
        .order("ticket_type");

      if (ticketsErr) throw ticketsErr;

      // Build stats per ticket type
      const statsMap: Record<string, { bought: number; scanned: number }> = {};
      TICKET_TYPES.forEach((t) => {
        statsMap[t] = { bought: 0, scanned: 0 };
      });

      tickets?.forEach((ticket) => {
        const type = ticket.ticket_type;
        if (!statsMap[type]) statsMap[type] = { bought: 0, scanned: 0 };
        statsMap[type].bought += 1;
        if (ticket.used) statsMap[type].scanned += 1;
      });

      const statsArr = TICKET_TYPES.map((t) => ({
        ticketType: t,
        bought: statsMap[t]?.bought || 0,
        scanned: statsMap[t]?.scanned || 0,
      }));

      setStats(statsArr);

      // Fetch buyer records from payment_intents
      const { data: intents, error: intentsErr } = await supabase
        .from("payment_intents")
        .select("buyer_name, buyer_email, ticket_type, quantity, claimed_at")
        .eq("status", "claimed")
        .order("claimed_at", { ascending: false });

      if (intentsErr) throw intentsErr;

      const buyerArr: BuyerRecord[] = (intents || []).map((i) => ({
        name: i.buyer_name || "—",
        email: i.buyer_email || "—",
        ticketType: i.ticket_type,
        quantity: i.quantity,
        claimedAt: i.claimed_at
          ? new Date(i.claimed_at).toLocaleDateString("en-NG", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "—",
      }));

      setBuyers(buyerArr);
      setLastUpdated(new Date());
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const copyEmails = () => {
    const emails = buyers.map((b) => b.email).join(", ");
    navigator.clipboard.writeText(emails).then(() => {
      setCopied(true);
      toast.success("All emails copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/staff");
  };

  const totalBought = stats.reduce((sum, s) => sum + s.bought, 0);
  const totalScanned = stats.reduce((sum, s) => sum + s.scanned, 0);

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-1">
              Otown Party 11.0
            </p>
            <h1 className="font-display font-bold text-2xl text-foreground">
              Ticket Records
            </h1>
            {lastUpdated && (
              <p className="text-xs text-muted-foreground mt-1">
                Last updated: {lastUpdated.toLocaleTimeString("en-NG")}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary text-xs font-semibold transition disabled:opacity-50"
            >
              <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
            <button
              onClick={signOut}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition"
            >
              <LogOut size={12} /> Sign out
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="bg-card border border-border rounded-xl p-4 text-center">
                <p className="text-3xl font-display font-bold text-primary">{totalBought}</p>
                <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wide">Total Sold</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-4 text-center">
                <p className="text-3xl font-display font-bold text-green-400">{totalScanned}</p>
                <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wide">Total Scanned</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-4 text-center">
                <p className="text-3xl font-display font-bold text-foreground">
                  {totalBought - totalScanned}
                </p>
                <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wide">Not Yet Scanned</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-4 text-center">
                <p className="text-3xl font-display font-bold text-primary">
                  {totalBought > 0 ? Math.round((totalScanned / totalBought) * 100) : 0}%
                </p>
                <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wide">Attendance Rate</p>
              </div>
            </div>

            {/* Tickets Table */}
            <div className="bg-card border border-border rounded-xl overflow-hidden mb-8">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="font-display font-bold text-lg text-foreground">
                  Tickets by Type
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Ticket Type
                      </th>
                      <th className="text-center px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Sold
                      </th>
                      <th className="text-center px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Scanned
                      </th>
                      <th className="text-center px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Remaining
                      </th>
                      <th className="text-center px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Scan Rate
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.map((s, i) => (
                      <tr
                        key={s.ticketType}
                        className={`border-b border-border last:border-0 ${
                          i % 2 === 0 ? "bg-background" : "bg-card"
                        }`}
                      >
                        <td className="px-6 py-4 font-semibold text-foreground">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                s.ticketType === "Early Bird"
                                  ? "bg-primary"
                                  : s.ticketType === "Regular"
                                  ? "bg-blue-400"
                                  : "bg-pink-400"
                              }`}
                            />
                            {s.ticketType}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="font-bold text-foreground text-base">{s.bought}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="font-bold text-green-400 text-base">{s.scanned}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="font-bold text-muted-foreground text-base">
                            {s.bought - s.scanned}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                              s.bought === 0
                                ? "bg-muted text-muted-foreground"
                                : s.scanned / s.bought >= 0.8
                                ? "bg-green-500/15 text-green-400"
                                : s.scanned / s.bought >= 0.5
                                ? "bg-yellow-500/15 text-yellow-400"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {s.bought > 0
                              ? Math.round((s.scanned / s.bought) * 100)
                              : 0}%
                          </span>
                        </td>
                      </tr>
                    ))}
                    {/* Totals row */}
                    <tr className="bg-primary/5 border-t-2 border-primary/20">
                      <td className="px-6 py-4 font-bold text-foreground uppercase text-xs tracking-wide">
                        Total
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-primary text-base">
                        {totalBought}
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-green-400 text-base">
                        {totalScanned}
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-muted-foreground text-base">
                        {totalBought - totalScanned}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-primary/15 text-primary">
                          {totalBought > 0
                            ? Math.round((totalScanned / totalBought) * 100)
                            : 0}%
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Buyer Records */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h2 className="font-display font-bold text-lg text-foreground">
                    Buyer Records
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {buyers.length} ticket{buyers.length !== 1 ? "s" : ""} purchased
                  </p>
                </div>
                <button
                  onClick={copyEmails}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary text-xs font-semibold hover:bg-primary/20 transition"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? "Copied!" : "Copy All Emails"}
                </button>
              </div>
              <div className="overflow-x-auto">
                {buyers.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground text-sm">
                    No tickets purchased yet.
                  </div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Name
                        </th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Email
                        </th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Type
                        </th>
                        <th className="text-center px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Qty
                        </th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {buyers.map((b, i) => (
                        <tr
                          key={i}
                          className={`border-b border-border last:border-0 ${
                            i % 2 === 0 ? "bg-background" : "bg-card"
                          }`}
                        >
                          <td className="px-6 py-3.5 font-medium text-foreground">
                            {b.name}
                          </td>
                          <td className="px-6 py-3.5 text-muted-foreground">
                            {b.email}
                          </td>
                          <td className="px-6 py-3.5">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                b.ticketType === "Early Bird"
                                  ? "bg-primary/15 text-primary"
                                  : b.ticketType === "Regular"
                                  ? "bg-blue-400/15 text-blue-400"
                                  : "bg-pink-400/15 text-pink-400"
                              }`}
                            >
                              {b.ticketType}
                            </span>
                          </td>
                          <td className="px-6 py-3.5 text-center text-foreground font-semibold">
                            {b.quantity}
                          </td>
                          <td className="px-6 py-3.5 text-muted-foreground text-xs">
                            {b.claimedAt}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default Record;
