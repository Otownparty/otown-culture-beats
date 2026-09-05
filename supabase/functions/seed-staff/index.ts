// One-off seeding of staff accounts. Deleted right after use.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

Deno.serve(async () => {
  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const accounts = [
    { email: "otown@staff.otownparty.com", password: "Letsrave1", role: "admin" },
    { email: "faya@staff.otownparty.com", password: "Faya2626", role: "scanner" },
  ];

  const out: unknown[] = [];
  for (const a of accounts) {
    let userId: string | null = null;
    const { data: created, error } = await admin.auth.admin.createUser({
      email: a.email, password: a.password, email_confirm: true,
    });
    if (created?.user) userId = created.user.id;
    if (!userId) {
      const { data: page } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
      const existing = page?.users.find((u) => u.email === a.email);
      if (existing) {
        userId = existing.id;
        await admin.auth.admin.updateUserById(userId, { password: a.password });
      }
    }
    if (!userId) { out.push({ email: a.email, error: error?.message }); continue; }
    const { error: roleErr } = await admin.from("user_roles")
      .upsert({ user_id: userId, role: a.role }, { onConflict: "user_id,role" });
    out.push({ email: a.email, userId, role: a.role, roleError: roleErr?.message ?? null });
  }

  return new Response(JSON.stringify({ out }), { headers: { "Content-Type": "application/json" } });
});
