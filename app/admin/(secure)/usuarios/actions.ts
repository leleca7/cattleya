"use server";

import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/admin-auth";
import { sql } from "@/lib/db";

export async function addAdminAccess(formData: FormData) {
  const owner = await requireAdminUser();
  if (owner.role !== "owner") return;

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const role = String(formData.get("role") ?? "editor");
  if (!email) return;

  await sql`
    INSERT INTO admin_users (email, role, active, invited_by)
    VALUES (${email}, ${role}, TRUE, ${owner.id})
    ON CONFLICT (email) DO UPDATE SET role=EXCLUDED.role, active=TRUE
  `;

  await sql`
    INSERT INTO audit_logs (actor_user_id,actor_email,action,entity_type,entity_id,summary)
    VALUES (${owner.id},${owner.email},'access-grant','user',${email},${"Acesso administrativo liberado para " + email})
  `;

  revalidatePath("/admin/usuarios");
}
