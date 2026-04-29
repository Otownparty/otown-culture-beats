import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import QrScanner from "qr-scanner";
import { Loader2, Check, X, AlertTriangle, Camera, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

type ScanResult = {
  valid: boolean;
  alreadyUsed?: boolean;
  usedJustNow?: boolean;
  reason?: string;
  ticket?: {
    id: string; name: string; email: string; ticketType: string;
    amountPaid: number; ticketIndex: number; quantity: number;
    edition: string; usedAt?: string; usedBy?: string;
  };
};

const Scan = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const lockRef = useRef(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [validating, setValidating] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) { navigate("/staff", { replace: true }); return; }
      setAuthChecked(true);
    });
  }, [navigate]);

  const startScanner = async () => {
    if (!videoRef.current) return;
    try {
      const scanner = new QrScanner(
        videoRef.current,
        (res) => handleScan(res.data),
        { highlightScanRegion: true, highlightCodeOutline: true, maxScansPerSecond: 4 }
      );
      scannerRef.current = scanner;
      await scanner.start();
      setScanning(true);
    } catch (err) {
      toast.error("Camera access denied or unavailable");
      console.error(err);
    }
  };

  const stopScanner = () => {
    scannerRef.current?.stop();
    scannerRef.current?.destroy();
    scannerRef.current = null;
    setScanning(false);
  };

  useEffect(() => () => stopScanner(), []);

  const handleScan = async (qrData: string) => {
    if (lockRef.current) return;
    lockRef.current = true;
    setValidating(true);
    try {
      const { data, error } = await supabase.functions.invoke("validate-ticket", {
        body: { qrData, markUsed: true },
      });
      if (error) throw error;
      setResult(data);
      stopScanner();
    } catch (err) {
      toast.error((err as Error).message);
      lockRef.current = false;
    } finally { setValidating(false); }
  };

  const reset = () => { setResult(null); lockRef.current = false; startScanner(); };

  const signOut = async () => { await supabase.auth.signOut(); navigate("/staff"); };

  if (!authChecked) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;
  }

  return (
    <main className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display font-bold text-xl text-foreground">Gate Scanner</h1>
          <button onClick={signOut} className="text-xs text-muted-foreground hover:text-primary inline-flex items-center gap-1">
            <LogOut size={12} /> Sign out
          </button>
        </div>

        {!scanning && !result && (
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <Camera className="mx-auto text-primary mb-4" size={40} />
            <p className="text-sm text-muted-foreground mb-6">Tap below to start scanning tickets at the gate.</p>
            <button onClick={startScanner} className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm">
              Start Camera
            </button>
          </div>
        )}

        {scanning && (
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="aspect-square w-full overflow-hidden rounded-lg bg-black relative">
              <video ref={videoRef} className="w-full h-full object-cover" />
              {validating && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <Loader2 className="animate-spin text-primary" size={32} />
                </div>
              )}
            </div>
            <p className="text-xs text-center text-muted-foreground mt-3">Point camera at the QR code on the ticket email</p>
            <button onClick={stopScanner} className="mt-3 w-full py-2 text-xs text-muted-foreground hover:text-foreground">Cancel</button>
          </div>
        )}

        {result && (
          <div className="bg-card border border-border rounded-xl p-6">
            {!result.valid ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 flex items-center justify-center mb-3">
                  <X className="text-red-500" size={32} />
                </div>
                <h2 className="font-display font-bold text-lg text-foreground mb-1">Invalid Ticket</h2>
                <p className="text-sm text-muted-foreground">{result.reason}</p>
              </div>
            ) : result.alreadyUsed ? (
              <div>
                <div className="text-center mb-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-yellow-500/10 flex items-center justify-center mb-3">
                    <AlertTriangle className="text-yellow-500" size={32} />
                  </div>
                  <h2 className="font-display font-bold text-lg text-foreground">Already Used</h2>
                  <p className="text-xs text-muted-foreground">
                    Scanned at {result.ticket?.usedAt ? new Date(result.ticket.usedAt).toLocaleString() : "earlier"}
                    {result.ticket?.usedBy ? ` by ${result.ticket.usedBy}` : ""}
                  </p>
                </div>
                <TicketDetails t={result.ticket!} />
              </div>
            ) : (
              <div>
                <div className="text-center mb-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-green-500/10 flex items-center justify-center mb-3">
                    <Check className="text-green-500" size={32} />
                  </div>
                  <h2 className="font-display font-bold text-lg text-foreground">Valid — Admit</h2>
                  <p className="text-xs text-green-500/80">Marked as used</p>
                </div>
                <TicketDetails t={result.ticket!} />
              </div>
            )}
            <button onClick={reset} className="mt-6 w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm">
              Scan Next Ticket
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

const TicketDetails = ({ t }: { t: NonNullable<ScanResult["ticket"]> }) => (
  <dl className="text-sm space-y-2 bg-muted/40 rounded-lg p-4">
    <Row label="Name" value={t.name} />
    <Row label="Email" value={t.email} />
    <Row label="Type" value={t.ticketType} />
    <Row label="Ticket" value={`${t.ticketIndex} of ${t.quantity}`} />
    <Row label="Amount" value={`₦${(t.amountPaid / 100).toLocaleString()}`} />
    <Row label="Edition" value={t.edition} />
  </dl>
);
const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between gap-3">
    <dt className="text-muted-foreground">{label}</dt>
    <dd className="text-foreground font-medium text-right">{value}</dd>
  </div>
);

export default Scan;
