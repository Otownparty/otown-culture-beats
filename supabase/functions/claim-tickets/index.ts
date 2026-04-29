// After payment verified, accept buyer name+email, create N tickets with signed QR codes,
// generate QR images and email them via Resend.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const enc = new TextEncoder();

async function hmacSign(secret: string, payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw", enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function emailRegex(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { reference, name, email } = await req.json();

    if (!reference || typeof reference !== "string") {
      return new Response(JSON.stringify({ error: "Reference required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!name || typeof name !== "string" || name.trim().length < 2 || name.length > 100) {
      return new Response(JSON.stringify({ error: "Valid name required (2-100 chars)" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!email || typeof email !== "string" || !emailRegex(email) || email.length > 255) {
      return new Response(JSON.stringify({ error: "Valid email required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const signingSecret = Deno.env.get("QR_SIGNING_SECRET");
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!signingSecret) throw new Error("QR_SIGNING_SECRET not configured");
    if (!resendKey) throw new Error("RESEND_API_KEY not configured");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Load and validate intent
    const { data: intent, error: intentErr } = await supabase
      .from("payment_intents").select("*").eq("reference", reference).single();
    if (intentErr || !intent) {
      return new Response(JSON.stringify({ error: "Payment not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (intent.status === "pending") {
      return new Response(JSON.stringify({ error: "Payment not yet verified" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (intent.status === "claimed") {
      return new Response(JSON.stringify({ error: "Tickets already claimed for this payment" }), {
        status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const edition = "Otown Party 11.0 - Glow in the 90s";
    const unitPrice = intent.unit_price;
    const ticketType = intent.ticket_type;
    const quantity = intent.quantity;

    // Generate tickets
    const ticketRows: any[] = [];
    const qrPayloads: { ticketId: string; payload: string; ticketIndex: number }[] = [];

    for (let i = 1; i <= quantity; i++) {
      const ticketId = crypto.randomUUID();
      const payloadObj = {
        tid: ticketId,
        n: cleanName,
        e: cleanEmail,
        t: ticketType,
        a: unitPrice, // amount per ticket (kobo)
        q: quantity,
        i: i,
        ed: edition,
        r: reference,
      };
      const payloadJson = JSON.stringify(payloadObj);
      const sig = await hmacSign(signingSecret, payloadJson);
      const fullPayload = JSON.stringify({ ...payloadObj, sig });

      ticketRows.push({
        id: ticketId,
        payment_reference: reference,
        ticket_type: ticketType,
        amount_paid: unitPrice,
        quantity, ticket_index: i,
        buyer_name: cleanName,
        buyer_email: cleanEmail,
        edition,
        qr_signature: sig,
      });
      qrPayloads.push({ ticketId, payload: fullPayload, ticketIndex: i });
    }

    const { error: insertErr } = await supabase.from("tickets").insert(ticketRows);
    if (insertErr) throw insertErr;

    await supabase.from("payment_intents").update({
      status: "claimed",
      buyer_name: cleanName,
      buyer_email: cleanEmail,
      claimed_at: new Date().toISOString(),
    }).eq("reference", reference);

    // Build email with QR images (use external QR-as-PNG generator for inline images)
    // Use api.qrserver.com — free, no key required, returns PNG
    const ticketHtml = qrPayloads.map(({ payload, ticketIndex }) => {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=10&data=${encodeURIComponent(payload)}`;
      return `
        <div style="border:1px solid #eee; border-radius:12px; padding:20px; margin:16px 0; text-align:center; background:#fafafa;">
          <p style="margin:0 0 8px; color:#666; font-size:13px;">Ticket ${ticketIndex} of ${quantity}</p>
          <h3 style="margin:0 0 12px; color:#0a0a0a;">${ticketType}</h3>
          <img src="${qrUrl}" alt="QR Code" width="280" height="280" style="display:block; margin:0 auto; max-width:280px;" />
          <p style="margin:12px 0 0; font-size:12px; color:#888;">Show this QR at the gate</p>
        </div>`;
    }).join("");

    const emailHtml = `
      <div style="font-family:Arial,sans-serif; max-width:600px; margin:0 auto; padding:24px; color:#0a0a0a;">
        <h1 style="color:#f5a623; margin:0 0 4px;">Otown Party 11.0</h1>
        <p style="margin:0 0 24px; color:#666;">Glow in the 90s — May 30, 2026 · Oyo Durbar Stadium</p>
        <p>Hi ${cleanName.replace(/[<>]/g, "")},</p>
        <p>Your payment has been confirmed. Below ${quantity > 1 ? `are your ${quantity} tickets` : "is your ticket"}. Each QR code is unique — present it at the gate for scanning.</p>
        ${ticketHtml}
        <p style="margin-top:24px; font-size:13px; color:#666;">
          Total paid: ₦${(intent.total_amount / 100).toLocaleString()}<br/>
          Payment reference: ${reference}
        </p>
        <p style="margin-top:24px; font-size:12px; color:#999;">If you didn't make this purchase, reply to this email immediately.</p>
      </div>`;
    
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Otown Party <tickets@otownparty.com>",
        to: [cleanEmail],
        subject: `Your Otown Party 11.0 Ticket${quantity > 1 ? "s" : ""} 🎉`,
        html: emailHtml,
      }),
    });

    if (!resendRes.ok) {
      const errText = await resendRes.text();
      console.error("Resend error:", errText);
      // Don't fail the whole request — tickets are saved. Tell user we'll retry.
      return new Response(JSON.stringify({
        success: true,
        emailSent: false,
        emailError: "Email delivery failed. Please contact support with your reference.",
        reference,
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({
      success: true, emailSent: true, reference, quantity,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    console.error("claim-tickets error:", err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
