// Initialize a Paystack payment intent. Stores intent in DB and returns reference + public key.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Server-side price source of truth (in kobo). NEVER trust client prices.
const TICKET_PRICES: Record<string, number> = {
  "Early Bird": 4000_00,
  "Regular": 5000_00,
  "VIP Experience": 15000_00,
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { ticketType, quantity } = await req.json();

    if (!ticketType || typeof ticketType !== "string" || !TICKET_PRICES[ticketType]) {
      return new Response(JSON.stringify({ error: "Invalid ticket type" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty < 1 || qty > 10) {
      return new Response(JSON.stringify({ error: "Quantity must be 1-10" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const unitPrice = TICKET_PRICES[ticketType];
    const totalAmount = unitPrice * qty;
    const reference = `OTP-${crypto.randomUUID()}`;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { error } = await supabase.from("payment_intents").insert({
      reference, ticket_type: ticketType, unit_price: unitPrice,
      quantity: qty, total_amount: totalAmount, status: "pending",
    });
    if (error) throw error;

    const publicKey = Deno.env.get("PAYSTACK_PUBLIC_KEY");
    if (!publicKey) throw new Error("PAYSTACK_PUBLIC_KEY not configured");

    return new Response(JSON.stringify({
      reference, amount: totalAmount, publicKey,
      ticketType, quantity: qty,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    console.error("initialize-payment error:", err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
