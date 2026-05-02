// Initialize a Paystack payment for vendor application.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PRICES: Record<string, number> = {
  "Consumable": 50000_00,
  "Non-Consumable": 40000_00,
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const {
      brandName, brandDescription, instagram, city, phone, email,
      previousVendor, businessCategory, subCategory,
    } = body ?? {};

    if (!businessCategory || !PRICES[businessCategory]) {
      return new Response(JSON.stringify({ error: "Invalid business category" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!brandName || !email || !phone || !instagram || !brandDescription || !previousVendor) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const amount = PRICES[businessCategory];
    const reference = `VENDOR-${crypto.randomUUID()}`;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { error } = await supabase.from("vendor_applications").insert({
      reference,
      brand_name: String(brandName).trim(),
      brand_description: String(brandDescription).trim(),
      instagram: String(instagram).trim(),
      city: city ? String(city).trim() : null,
      phone: String(phone).trim(),
      email: String(email).trim().toLowerCase(),
      previous_vendor: String(previousVendor),
      business_category: String(businessCategory),
      sub_category: subCategory ? String(subCategory) : null,
      amount,
      status: "pending",
    });
    if (error) throw error;

    const publicKey = Deno.env.get("PAYSTACK_PUBLIC_KEY");
    if (!publicKey) throw new Error("PAYSTACK_PUBLIC_KEY not configured");

    return new Response(JSON.stringify({ reference, amount, publicKey }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("initialize-vendor-payment error:", err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
