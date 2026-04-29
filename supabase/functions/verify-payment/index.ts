// Verify a Paystack transaction with the secret key. Marks intent as verified.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { reference } = await req.json();
    if (!reference || typeof reference !== "string") {
      return new Response(JSON.stringify({ error: "Reference required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const secretKey = Deno.env.get("PAYSTACK_SECRET_KEY");
    if (!secretKey) throw new Error("PAYSTACK_SECRET_KEY not configured");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Fetch intent
    const { data: intent, error: intentErr } = await supabase
      .from("payment_intents").select("*").eq("reference", reference).single();
    if (intentErr || !intent) {
      return new Response(JSON.stringify({ error: "Payment intent not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify with Paystack
    const psRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${secretKey}` },
    });
    const psData = await psRes.json();
    if (!psRes.ok || !psData.status || psData.data?.status !== "success") {
      return new Response(JSON.stringify({ error: "Payment not successful", details: psData }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate amount matches
    if (psData.data.amount !== intent.total_amount) {
      return new Response(JSON.stringify({ error: "Amount mismatch" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Mark as verified (only if still pending — idempotent)
    if (intent.status === "pending") {
      await supabase.from("payment_intents")
        .update({ status: "verified", verified_at: new Date().toISOString() })
        .eq("reference", reference);
    }

    return new Response(JSON.stringify({
      success: true,
      reference,
      ticketType: intent.ticket_type,
      quantity: intent.quantity,
      amount: intent.total_amount,
      claimed: intent.status === "claimed",
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    console.error("verify-payment error:", err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
