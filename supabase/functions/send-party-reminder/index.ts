// Send a party reminder email to all ticket buyers for a given edition.
// Requires an authenticated staff session (verify_jwt = true).
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const CURRENT_EDITION = "Otown Party 13.0 - Faaji Extra";
const EVENT_DATE = "Saturday, 1st August 2026";
const EVENT_TIME = "6PM – 4AM";
const EVENT_VENUE = "Durbar Stadium, Oyo";

const escapeHtml = (s: string) =>
  String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c] as string));

// Convert plain-text (with blank lines as paragraph breaks) into safe HTML.
function textToHtml(body: string): string {
  const safe = escapeHtml(body.trim());
  const paragraphs = safe.split(/\n{2,}/).map((p) =>
    `<p style="margin:0 0 16px; font-size:15px; line-height:1.6; color:#333;">${p.replace(/\n/g, "<br/>")}</p>`
  );
  return paragraphs.join("");
}

const defaultSubject = `🔥 It's THIS Saturday — Otown Party 13.0 Faaji Extra`;

const defaultBody = `Hey Raver,

It's finally here — this Saturday, we take over ${EVENT_VENUE} for Otown Party 13.0: Faaji Extra. 🚀

📅 ${EVENT_DATE}
🕕 ${EVENT_TIME}
📍 ${EVENT_VENUE}

Here's how to lock in an unforgettable night:

• Come with the QR code that was sent to this email — screenshot or printed, both work.
• Arrive early to skip the queue and catch the opening vibe.
• Dress the part — Faaji Extra is a whole mood. Come in your freshest.
• Bring a valid ID and stay hydrated between drinks.
• Move in a squad. The energy is always bigger with your people.

Doors don't stop till 4AM. Sound system loaded. DJ lineup ready. Only one thing missing — you. 🌀

See you on the dancefloor.

— The Otown Party Team`;

function buildEmailHtml(subject: string, body: string) {
  const bodyHtml = textToHtml(body);
  return `
    <div style="font-family: Arial, Helvetica, sans-serif; max-width:600px; margin:0 auto; padding:0; background:#ffffff;">
      <div style="background:linear-gradient(135deg,#0a0a0a 0%, #1a1208 100%); padding:32px 24px; text-align:center;">
        <p style="margin:0 0 6px; color:#f5a623; font-size:11px; font-weight:bold; letter-spacing:3px; text-transform:uppercase;">Otown Party 13.0</p>
        <h1 style="margin:0; color:#ffffff; font-size:26px; letter-spacing:1px;">Faaji Extra</h1>
        <p style="margin:8px 0 0; color:#e8728a; font-size:13px;">${EVENT_DATE} · ${EVENT_VENUE}</p>
      </div>
      <div style="padding:32px 28px 24px; background:#ffffff;">
        ${bodyHtml}
      </div>
      <div style="padding:20px 28px; background:#fafafa; border-top:1px solid #eee; text-align:center;">
        <p style="margin:0; font-size:12px; color:#888;">
          You're receiving this because you purchased a ticket for ${escapeHtml(CURRENT_EDITION)}.
        </p>
        <p style="margin:8px 0 0; font-size:12px;">
          <a href="https://otownparty.com" style="color:#f5a623; text-decoration:none;">otownparty.com</a>
        </p>
      </div>
    </div>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) throw new Error("RESEND_API_KEY not configured");
    const fromAddress = Deno.env.get("RESEND_FROM_EMAIL") || "Otown Party <onboarding@resend.dev>";

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const body = await req.json().catch(() => ({}));
    const subject = (typeof body?.subject === "string" && body.subject.trim())
      ? body.subject.trim().slice(0, 200)
      : defaultSubject;
    const messageBody = (typeof body?.message === "string" && body.message.trim())
      ? body.message.trim().slice(0, 8000)
      : defaultBody;
    const edition = (typeof body?.edition === "string" && body.edition.trim())
      ? body.edition.trim()
      : CURRENT_EDITION;
    const dryRun = body?.dryRun === true;

    // Collect unique recipient emails from every source of truth we have.
    const emails = new Set<string>();

    const { data: intents } = await supabase
      .from("payment_intents")
      .select("buyer_email, edition, status")
      .in("status", ["claimed", "verified"]);
    for (const r of intents || []) {
      if (r.buyer_email && (r.edition || CURRENT_EDITION) === edition) {
        emails.add(String(r.buyer_email).trim().toLowerCase());
      }
    }

    const { data: tks } = await supabase
      .from("tickets")
      .select("buyer_email, edition");
    for (const r of tks || []) {
      if (r.buyer_email && (r.edition || CURRENT_EDITION) === edition) {
        emails.add(String(r.buyer_email).trim().toLowerCase());
      }
    }

    const recipientList = Array.from(emails).filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));

    if (dryRun) {
      return new Response(JSON.stringify({
        dryRun: true, count: recipientList.length, sample: recipientList.slice(0, 5),
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const html = buildEmailHtml(subject, messageBody);

    let sent = 0;
    let failed = 0;
    const errors: { email: string; error: string }[] = [];

    for (const to of recipientList) {
      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ from: fromAddress, to: [to], subject, html }),
        });
        if (!res.ok) {
          const t = await res.text();
          failed++;
          errors.push({ email: to, error: `${res.status}: ${t.slice(0, 200)}` });
          console.error("Reminder send failed", to, res.status, t);
        } else {
          sent++;
        }
      } catch (err) {
        failed++;
        errors.push({ email: to, error: (err as Error).message });
      }
      // Gentle throttle to respect Resend's default 2 rps limit.
      await new Promise((r) => setTimeout(r, 550));
    }

    return new Response(JSON.stringify({
      success: true, total: recipientList.length, sent, failed,
      errors: errors.slice(0, 20),
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    console.error("send-party-reminder error:", err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
