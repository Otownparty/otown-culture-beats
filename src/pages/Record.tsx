import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Loader2,
  LogOut,
  RefreshCw,
  Copy,
  Check,
  Ticket,
  Store,
  Search,
  Download,
  CheckCircle2,
  Clock,
  XCircle,
  Trash2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

interface TicketPurchaseRecord {
  id: string;
  reference: string;
  name: string;
  email: string;
  phone: string;
  ticket_type: string;
  quantity: number;
  amount: number;
  status: string;
  paid_at: string | null;
  created_at: string;
}

interface VendorRecord {
  id: string;
  reference: string;
  brand_name: string;
  brand_description: string;
  instagram: string;
  city: string;
  phone: string;
  email: string;
  previous_vendor: string;
  business_category: string;
  sub_category: string;
  amount: number;
  status: string;
  paid_at: string | null;
  created_at: string;
  scanned: boolean;
  scanned_at: string | null;
  scanned_by: string | null;
}

const TICKET_TYPES = ["Early Bird", "Regular", "VIP Experience"];

const Record = () => {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);

  // Original ticket stats state
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<TicketStats[]>([]);
  const [buyers, setBuyers] = useState<BuyerRecord[]>([]);
  const [copied, setCopied] = useState(false);
  const [copiedVendors, setCopiedVendors] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [confirmClear, setConfirmClear] = useState<null | "tickets" | "vendors">(null);
  const [clearing, setClearing] = useState(false);

  // New tabbed records state
  const [activeTab, setActiveTab] = useState("overview");
  const [ticketSearch, setTicketSearch] = useState("");
  const [vendorSearch, setVendorSearch] = useState("");
  const [ticketPurchases, setTicketPurchases] = useState<TicketPurchaseRecord[]>([]);
  const [vendors, setVendors] = useState<VendorRecord[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [loadingVendors, setLoadingVendors] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        navigate("/staff?next=/record", { replace: true });
        return;
      }
      setAuthChecked(true);
      fetchAllData();
    });
  }, [navigate]);

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([fetchTicketStats(), fetchTicketPurchases(), fetchVendors()]);
    setLoading(false);
  };

  const fetchTicketStats = async () => {
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
    }
  };

  const fetchTicketPurchases = async () => {
    setLoadingTickets(true);
    const { data, error } = await supabase
      .from("ticket_purchases")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load ticket purchases");
    } else {
      setTicketPurchases(data || []);
    }
    setLoadingTickets(false);
  };

  const fetchVendors = async () => {
    setLoadingVendors(true);
    const { data, error } = await supabase
      .from("vendor_applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load vendors");
    } else {
      setVendors(data || []);
    }
    setLoadingVendors(false);
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

  const exportCSV = (type: "tickets" | "vendors") => {
    const data = type === "tickets" ? filteredTicketPurchases : filteredVendors;
    if (data.length === 0) return toast.error("No data to export");

    const headers =
      type === "tickets"
        ? ["Reference", "Name", "Email", "Phone", "Ticket Type", "Quantity", "Amount (NGN)", "Status", "Paid At", "Created At"]
        : ["Reference", "Brand Name", "Email", "Phone", "Category", "Sub Category", "Previous Vendor", "Instagram", "City", "Amount (NGN)", "Status", "Paid At", "Created At"];

    const rows =
      type === "tickets"
        ? data.map((t) => [
            t.reference,
            t.name,
            t.email,
            t.phone,
            t.ticket_type,
            t.quantity,
            t.amount / 100,
            t.status,
            t.paid_at || "N/A",
            t.created_at,
          ])
        : data.map((v) => [
            v.reference,
            v.brand_name,
            v.email,
            v.phone,
            v.business_category,
            v.sub_category,
            v.previous_vendor,
            v.instagram,
            v.city,
            v.amount / 100,
            v.status,
            v.paid_at || "N/A",
            v.created_at,
          ]);

    const csv = [headers, ...rows].map((r) => r.map((cell) => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `otown-${type}-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`${type} exported successfully`);
  };

  const getStatusBadge = (status: string) => {
    if (status === "paid")
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-medium">
          <CheckCircle2 size={12} /> Paid
        </span>
      );
    if (status === "pending")
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-medium">
          <Clock size={12} /> Pending
        </span>
      );
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-medium">
        <XCircle size={12} /> {status}
      </span>
    );
  };

  const totalBought = stats.reduce((sum, s) => sum + s.bought, 0);
  const totalScanned = stats.reduce((sum, s) => sum + s.scanned, 0);

  const filteredTicketPurchases = ticketPurchases.filter((t) =>
    [t.name, t.email, t.reference, t.ticket_type].some((field) =>
      field?.toLowerCase().includes(ticketSearch.toLowerCase())
    )
  );

  const filteredVendors = vendors.filter((v) =>
    [v.brand_name, v.email, v.reference, v.business_category, v.sub_category, v.instagram].some((field) =>
      field?.toLowerCase().includes(vendorSearch.toLowerCase())
    )
  );

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto">
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
              onClick={fetchAllData}
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
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="overview" className="gap-2">
                <Ticket size={16} />
                Ticket Purchases
              </TabsTrigger>
              <TabsTrigger value="vendors" className="gap-2">
                <Store size={16} />
                Vendors
                <span className="ml-1 text-xs text-muted-foreground">({vendors.length})</span>
              </TabsTrigger>
            </TabsList>

            {/* OVERVIEW TAB (Original Functionality) */}
            <TabsContent value="overview">
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
            </TabsContent>

            {/* VENDORS TAB */}
            <TabsContent value="vendors">
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <input
                    type="text"
                    placeholder="Search vendors by brand, email, category, Instagram..."
                    value={vendorSearch}
                    onChange={(e) => setVendorSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={fetchVendors}
                    className="px-4 py-3 rounded-lg border border-border hover:bg-muted transition"
                  >
                    <RefreshCw size={16} className={loadingVendors ? "animate-spin" : ""} />
                  </button>
                  <button
                    onClick={() => exportCSV("vendors")}
                    className="px-4 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:brightness-110 transition flex items-center gap-2"
                  >
                    <Download size={16} /> Export
                  </button>
                </div>
              </div>

              {loadingVendors ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="animate-spin text-primary" size={28} />
                </div>
              ) : filteredVendors.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                  <Store size={40} className="mx-auto mb-3 opacity-30" />
                  <p>No vendors found</p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-border rounded-xl">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left px-4 py-3 font-semibold text-foreground">Reference</th>
                        <th className="text-left px-4 py-3 font-semibold text-foreground">Brand</th>
                        <th className="text-left px-4 py-3 font-semibold text-foreground">Email</th>
                        <th className="text-left px-4 py-3 font-semibold text-foreground">Category</th>
                        <th className="text-left px-4 py-3 font-semibold text-foreground">Sub-Category</th>
                        <th className="text-left px-4 py-3 font-semibold text-foreground">Amount</th>
                        <th className="text-left px-4 py-3 font-semibold text-foreground">Status</th>
                        <th className="text-left px-4 py-3 font-semibold text-foreground">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredVendors.map((v) => (
                        <tr key={v.id} className="hover:bg-muted/50 transition">
                          <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{v.reference}</td>
                          <td className="px-4 py-3">
                            <p className="text-foreground font-medium">{v.brand_name}</p>
                            <p className="text-xs text-muted-foreground">@{v.instagram}</p>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">{v.email}</td>
                          <td className="px-4 py-3 text-muted-foreground">{v.business_category}</td>
                          <td className="px-4 py-3 text-muted-foreground">{v.sub_category}</td>
                          <td className="px-4 py-3 text-foreground font-semibold">₦{(v.amount / 100).toLocaleString()}</td>
                          <td className="px-4 py-3">{getStatusBadge(v.status)}</td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">
                            {new Date(v.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="mt-4 flex justify-between text-sm text-muted-foreground">
                <span>Total: {filteredVendors.length} records</span>
                <span>
                  Revenue: ₦
                  {(filteredVendors.filter((v) => v.status === "paid").reduce((sum, v) => sum + v.amount, 0) / 100).toLocaleString()}
                </span>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </main>
  );
};

export default Record;
