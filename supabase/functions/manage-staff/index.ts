// Admin-only staff account management: list, create and delete gate-scanner accounts.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const STAFF_EMAIL_DOMAIN = "staff.otownparty.com";
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const normalizeUsername = (raw: string) =>
  raw.trim().toLowerCase().replace(/[^a-z0-9._-]/g, "");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Unauthorized" }, 401);

    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) return json({ error: "Unauthorized" }, 401);

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: roles } = await admin.from("user_roles")
      .select("role").eq("user_id", userData.user.id);
    const isAdmin = (roles ?? []).some((r: any) => r.role === "admin");
    if (!isAdmin) return json({ error: "Admins only" }, 403);

    const { action, username, password, userId } = await req.json();

    if (action === "list") {
      const { data: scannerRoles } = await admin.from("user_roles")
        .select("user_id, role, created_at").order("created_at", { ascending: true });
      const { data: usersPage } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
      const staff = (scannerRoles ?? []).map((r: any) => {
        const u = usersPage?.users.find((x: any) => x.id === r.user_id);
        const email = u?.email ?? "";
        return {
          userId: r.user_id,
          role: r.role,
          username: email.endsWith(`@${STAFF_EMAIL_DOMAIN}`) ? email.split("@")[0] : email,
          createdAt: r.created_at,
        };
      });
      return json({ staff });
    }

    if (action === "create") {
      const uname = normalizeUsername(String(username ?? ""));
      if (!uname) return json({ error: "Username is required" }, 400);
      if (!password || String(password).length < 6)
        return json({ error: "Password must be at least 6 characters" }, 400);

      const email = `${uname}@${STAFF_EMAIL_DOMAIN}`;
      const { data: created, error: createErr } = await admin.auth.admin.createUser({
        email,
        password: String(password),
        email_confirm: true,
      });
      if (createErr || !created.user) {
        return json({ error: createErr?.message ?? "Could not create account" }, 400);
      }
      const { error: roleErr } = await admin.from("user_roles")
        .insert({ user_id: created.user.id, role: "scanner" });
      if (roleErr) return json({ error: roleErr.message }, 400);
      return json({ ok: true, username: uname, userId: created.user.id });
    }

    if (action === "reset_password") {
      if (!userId || !password || String(password).length < 6)
        return json({ error: "User and a password of 6+ characters are required" }, 400);
      const { error } = await admin.auth.admin.updateUserById(String(userId), {
        password: String(password),
      });
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }

    if (action === "delete") {
      if (!userId) return json({ error: "User is required" }, 400);
      if (userId === userData.user.id) return json({ error: "You cannot delete your own account" }, 400);
      const { data: targetRoles } = await admin.from("user_roles")
        .select("role").eq("user_id", String(userId));
      if ((targetRoles ?? []).some((r: any) => r.role === "admin"))
        return json({ error: "Admin accounts cannot be deleted here" }, 400);
      await admin.from("user_roles").delete().eq("user_id", String(userId));
      const { error } = await admin.auth.admin.deleteUser(String(userId));
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (err) {
    console.error("manage-staff error:", err);
    return json({ error: (err as Error).message }, 500);
  }
});
