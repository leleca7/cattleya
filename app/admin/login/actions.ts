"use server";

import { timingSafeEqual } from "crypto";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { setAdminSession } from "@/lib/admin-auth";

function safeEqual(a: string, b: string) {
  const aa = Buffer.from(a);
  const bb = Buffer.from(b);
  if (aa.length !== bb.length) return false;
  return timingSafeEqual(aa, bb);
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected || !safeEqual(password, expected)) {
    redirect("/admin/login?erro=1");
  }

  const rows = await sql`
    SELECT id, email
    FROM admin_users
    WHERE LOWER(email) = LOWER(${email}) AND active = TRUE
    LIMIT 1
  `;

  const user = rows[0] as { id: number; email: string } | undefined;
  if (!user) redirect("/admin/login?erro=1");

  await setAdminSession(user.email);
  await sql`UPDATE admin_users SET last_login_at = NOW() WHERE id = ${user.id}`;
  await sql`
    INSERT INTO audit_logs (actor_user_id, actor_email, action, entity_type, entity_id, summary)
    VALUES (${user.id}, ${user.email}, 'login', 'session', ${String(user.id)}, 'Acesso ao painel administrativo')
  `;

  redirect("/admin");
}
