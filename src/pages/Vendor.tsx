import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";


const loadPaystackScript = () =>
  new Promise<void>((resolve, reject) => {
    if (window.PaystackPop) return resolve();
    const s = document.createElement("script");
    s.src = "https://js.paystack.co/v1/inline.js";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load Paystack"));
    document.head.appendChild(s);
  });

const CONSUMABLE_PRICE = 50000;
const NON_CONSUMABLE_PRICE = 40000;

const consumableCategories = [
  "Food",
  "Healthy Meals",
  "Pastries",
  "Shawarma",
  "Liquids (Fruit/Natural drinks)",
  "Chicken and Chips / Grills",
  "Other",
];

const nonConsumableCategories = [
  "Jewelry / Accessories",
  "Smoke / Shisha",
  "Perfumes / Fragrances",
  "Clothes / Streetwear / Vintage Gear",
  "Other",
];

const Vendor = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [otherConsumable, setOtherConsumable] = useState("");
  const [otherNonConsumable, setOtherNonConsumable] = useState("");

  const [form, setForm] = useState({
    brandName: "",
    brandDescription: "",
    instagram: "",
    city: "",
    phone: "",
    email: "",
    previousVendor: "",
    businessCategory: "",
    consumableCategory: "",
    nonConsumableCategory: "",
  });

  const set = (field: string, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const getPrice = () =>
    form.businessCategory === "Consumable"
      ? CONSUMABLE_PRICE
      : form.businessCategory === "Non-Consumable"
      ? NON_CONSUMABLE_PRICE
      : 0;

  const handleProceed = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.brandName.trim()) return toast.error("Brand name is required");
    if (!form.brandDescription.trim()) return toast.error("Brand description is required");
    if (!form.instagram.trim()) return toast.error("Instagram handle is required");
    if (!form.phone.trim()) return toast.error("Phone number is required");
    if (!form.email.trim()) return toast.error("Email address is required");
    if (!form.previousVendor) return toast.error("Please select vendor history");
    if (!form.businessCategory) return toast.error("Please select a business category");
    if (
      form.businessCategory === "Consumable" &&
      !form.consumableCategory
    ) return toast.error("Please select a consumable category");
    if (
      form.businessCategory === "Non-Consumable" &&
      !form.nonConsumableCategory
    ) return toast.error("Please select a non-consumable category");
    if (!agreed) return toast.error("Please agree to the terms and conditions");

    const price = getPrice();
    if (!price) return toast.error("Invalid category selected");

    setLoading(true);

    try {
      await loadPaystackScript();

      const subCategory =
        form.businessCategory === "Consumable"
          ? form.consumableCategory === "Other"
            ? otherConsumable
            : form.consumableCategory
          : form.nonConsumableCategory === "Other"
          ? otherNonConsumable
          : form.nonConsumableCategory;

      const { data, error } = await supabase.functions.invoke("initialize-vendor-payment", {
        body: {
          brandName: form.brandName.trim(),
          brandDescription: form.brandDescription.trim(),
          instagram: form.instagram.trim(),
          city: form.city.trim(),
          phone: form.phone.trim(),
          email: form.email.trim().toLowerCase(),
          previousVendor: form.previousVendor,
          businessCategory: form.businessCategory,
          subCategory,
        },
      });

      if (error || !data?.reference) {
        throw new Error(error?.message || "Failed to start payment");
      }

      const handler = window.PaystackPop.setup({
        key: data.publicKey,
        email: form.email.trim(),
        amount: data.amount,
        currency: "NGN",
        ref: data.reference,
        metadata: {
          brandName: form.brandName,
          businessCategory: form.businessCategory,
          subCategory,
        },
        channels: ["bank_transfer", "card", "ussd", "mobile_money", "qr", "bank"],
        onClose: () => {
          setLoading(false);
        },
        callback: (response: any) => {
          supabase
            .from("vendor_applications")
            .update({ status: "paid", paid_at: new Date().toISOString() })
            .eq("reference", response.reference)
            .then(() => {
              navigate(
                `/vendor-success?name=${encodeURIComponent(form.brandName)}&email=${encodeURIComponent(form.email)}&category=${encodeURIComponent(form.businessCategory)}`
              );
            });
        },
      });

      handler.openIframe();
    } catch (err) {
      console.error(err);
      toast.error((err as Error).message || "Could not start payment");
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto max-w-2xl px-4">

          {/* Header */}
          <div className="text-center mb-10">
            <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-3">
              Otown Party 11.0 · May 30, 2026
            </p>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-foreground mb-2">
              Vendor Registration
            </h1>
            <p className="text-muted-foreground text-sm">
              Durbar Stadium, Oyo · Saturday, May 30th, 2026
            </p>
          </div>

          {/* Intro Card */}
          <div className="bg-card border border-primary/20 rounded-xl p-6 mb-6">
            <h2 className="font-display font-bold text-lg text-foreground mb-3">
              Become an Otown Party Vendor
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              The Otown Party movement is more than just the music and the energy — it's a full experience. Join our curated lineup of premium vendors and position your brand directly in front of an energetic, high-spending audience looking for top-tier food, drinks, fashion, and lifestyle products.
            </p>

            <div className="space-y-3">
              <p className="text-primary text-[10px] font-bold uppercase tracking-widest mb-2">Vendor Benefits</p>
              {[
                { num: "1", title: "Maximum Visibility", desc: "Showcase your business to an expansive, highly engaged crowd eager to explore new products, fashion, and services." },
                { num: "2", title: "Setup Provided", desc: "We provide a designated space including a tent, a table, a premium table cover, and two chairs." },
                { num: "3", title: "Team Access", desc: "Receive two (2) exclusive vendor tags for your team to ensure smooth entry and mobility throughout the event space." },
                { num: "4", title: "Dedicated Power & Lighting", desc: "A basic power source and lighting are provided to support your equipment (small appliances only)." },
              ].map((b) => (
                <div key={b.num} className="flex gap-3">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {b.num}
                  </span>
                  <p className="text-sm text-muted-foreground">
                    <span className="text-foreground font-semibold">{b.title}: </span>
                    {b.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Rules & Regulations Toggle */}
          <div className="bg-card border border-border rounded-xl mb-6 overflow-hidden">
            <button
              type="button"
              onClick={() => setShowRules(!showRules)}
              className="w-full flex items-center justify-between px-6 py-4 text-left"
            >
              <span className="font-display font-bold text-sm text-foreground uppercase tracking-wide">
                Event Policies & Guidelines
              </span>
              {showRules ? (
                <ChevronUp size={16} className="text-primary" />
              ) : (
                <ChevronDown size={16} className="text-primary" />
              )}
            </button>
            {showRules && (
              <div className="px-6 pb-6 space-y-3 border-t border-border pt-4">
                {[
                  { title: "Arrival & Setup", desc: "All vendors must arrive at the venue and complete their setup no later than 10:00 AM on the day of the event. Late arrivals will be subject to a penalty." },
                  { title: "Exclusive Beverage Policy", desc: "Vendors intending to sell water at the event must purchase it in bulk directly from the event organizers. Bringing in outside water to sell is strictly prohibited." },
                  { title: "Alcohol & External Drinks", desc: "Bringing in outside alcohol or other beverages for sale is completely restricted." },
                  { title: "Assigned Spaces", desc: "Vendors must remain at their allocated space throughout the event. Moving from the assigned location without authorization will result in immediate disqualification and blacklisting." },
                  { title: "Curated Selection", desc: "To maintain premium variety and prevent market saturation, vendor selection is based on product category. Applications are subject to review by the event organizers before final confirmation." },
                ].map((p) => (
                  <div key={p.title} className="flex gap-3">
                    <span className="text-primary mt-1 shrink-0">•</span>
                    <p className="text-sm text-muted-foreground">
                      <span className="text-foreground font-semibold">{p.title}: </span>
                      {p.desc}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Registration Form */}
          <form onSubmit={handleProceed} className="bg-card border border-border rounded-xl p-6 sm:p-8 space-y-5">
            <div>
              <p className="text-primary text-[10px] font-bold uppercase tracking-widest mb-4">
                Vendor Registration Form
              </p>
              <p className="text-xs text-muted-foreground">
                For support: <a href="mailto:pr@otownparty.com" className="text-primary hover:underline">pr@otownparty.com</a>
              </p>
            </div>

            {/* Brand Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Business / Brand Name <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={100}
                value={form.brandName}
                onChange={(e) => set("brandName", e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Your brand or business name"
              />
            </div>

            {/* Brand Description */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Brand Description <span className="text-primary">*</span>
              </label>
              <textarea
                required
                maxLength={500}
                rows={3}
                value={form.brandDescription}
                onChange={(e) => set("brandDescription", e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                placeholder="Provide a short description of the products or services your brand offers"
              />
            </div>

            {/* Instagram */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Business Instagram Handle <span className="text-primary">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">@</span>
                <input
                  type="text"
                  required
                  maxLength={60}
                  value={form.instagram}
                  onChange={(e) => set("instagram", e.target.value.replace("@", ""))}
                  className="w-full pl-8 pr-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="yourbrand"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Ensure your handle is exactly as it appears on Instagram — you'll be tagged in our vendor post.
              </p>
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Business Location (City)
              </label>
              <input
                type="text"
                maxLength={60}
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="e.g. Ibadan, Lagos, Oyo"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Phone Number <span className="text-primary">*</span>
              </label>
              <input
                type="tel"
                required
                maxLength={20}
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Primary contact number"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Email Address <span className="text-primary">*</span>
              </label>
              <input
                type="email"
                required
                maxLength={255}
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="your@email.com"
              />
            </div>

            {/* Previous Vendor */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Have you been a previous vendor at an Otown Party? <span className="text-primary">*</span>
              </label>
              <div className="space-y-2">
                {["First time", "Returning Vendor"].map((opt) => (
                  <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                    <div
                      onClick={() => set("previousVendor", opt)}
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center cursor-pointer transition ${
                        form.previousVendor === opt
                          ? "border-primary bg-primary"
                          : "border-border group-hover:border-primary/50"
                      }`}
                    >
                      {form.previousVendor === opt && (
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Business Category */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Business Category <span className="text-primary">*</span>
              </label>
              <div className="space-y-2">
                {[
                  { label: "Consumable", price: "₦50,000" },
                  { label: "Non-Consumable", price: "₦40,000" },
                ].map((cat) => (
                  <label key={cat.label} className="flex items-center gap-3 cursor-pointer group">
                    <div
                      onClick={() => {
                        set("businessCategory", cat.label);
                        set("consumableCategory", "");
                        set("nonConsumableCategory", "");
                      }}
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center cursor-pointer transition ${
                        form.businessCategory === cat.label
                          ? "border-primary bg-primary"
                          : "border-border group-hover:border-primary/50"
                      }`}
                    >
                      {form.businessCategory === cat.label && (
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {cat.label}{" "}
                      <span className="text-primary font-semibold">{cat.price}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Consumable Sub-category */}
            {form.businessCategory === "Consumable" && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Consumable Category <span className="text-primary">*</span>
                </label>
                <div className="space-y-2">
                  {consumableCategories.map((cat) => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <div
                        onClick={() => set("consumableCategory", cat)}
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center cursor-pointer transition ${
                          form.consumableCategory === cat
                            ? "border-primary bg-primary"
                            : "border-border group-hover:border-primary/50"
                        }`}
                      >
                        {form.consumableCategory === cat && (
                          <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">{cat}</span>
                    </label>
                  ))}
                </div>
                {form.consumableCategory === "Other" && (
                  <input
                    type="text"
                    value={otherConsumable}
                    onChange={(e) => setOtherConsumable(e.target.value)}
                    className="mt-3 w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Please specify your category"
                  />
                )}
              </div>
            )}

            {/* Non-Consumable Sub-category */}
            {form.businessCategory === "Non-Consumable" && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Non-Consumable Category <span className="text-primary">*</span>
                </label>
                <div className="space-y-2">
                  {nonConsumableCategories.map((cat) => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <div
                        onClick={() => set("nonConsumableCategory", cat)}
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center cursor-pointer transition ${
                          form.nonConsumableCategory === cat
                            ? "border-primary bg-primary"
                            : "border-border group-hover:border-primary/50"
                        }`}
                      >
                        {form.nonConsumableCategory === cat && (
                          <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">{cat}</span>
                    </label>
                  ))}
                </div>
                {form.nonConsumableCategory === "Other" && (
                  <input
                    type="text"
                    value={otherNonConsumable}
                    onChange={(e) => setOtherNonConsumable(e.target.value)}
                    className="mt-3 w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Please specify your category"
                  />
                )}
              </div>
            )}

            {/* Price Summary */}
            {form.businessCategory && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg px-4 py-3 flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Registration Fee</span>
                <span className="text-primary font-display font-bold text-lg">
                  ₦{getPrice().toLocaleString()}
                </span>
              </div>
            )}

            {/* Terms */}
            <div className="border-t border-border pt-5">
              <p className="text-primary text-[10px] font-bold uppercase tracking-widest mb-3">
                Terms & Conditions
              </p>
              <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                I have read and agree to the rules and guidelines of the Otown Party vendor registration. I understand that my application will be reviewed and my slot is only confirmed upon approval.
              </p>
              <label className="flex items-start gap-3 cursor-pointer">
                <div
                  onClick={() => setAgreed(!agreed)}
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center cursor-pointer mt-0.5 transition shrink-0 ${
                    agreed ? "border-primary bg-primary" : "border-border"
                  }`}
                >
                  {agreed && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-muted-foreground">I Agree to the terms and conditions</span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !agreed}
              className="w-full py-4 rounded-lg bg-primary text-primary-foreground font-display font-bold text-sm uppercase tracking-wider hover:brightness-110 transition disabled:opacity-50"
            >
              {loading ? "Processing…" : `Proceed to Payment${form.businessCategory ? ` — ₦${getPrice().toLocaleString()}` : ""}`}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Vendor;
