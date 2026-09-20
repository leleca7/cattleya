"use server";

import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/admin-auth";
import { sql } from "@/lib/db";

export async function saveCategory(formData: FormData) {
  const user = await requireAdminUser();
  const id = Number(formData.get("id") ?? 0);
  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const sortOrder = Number(formData.get("sort_order") ?? 0);
  const active = formData.get("active") === "on";
  if (!name || !slug) return;

  if (id) {
    await sql`UPDATE categories SET name=${name}, slug=${slug}, sort_order=${sortOrder}, active=${active}, updated_at=NOW() WHERE id=${id}`;
  } else {
    await sql`INSERT INTO categories (name,slug,sort_order,active) VALUES (${name},${slug},${sortOrder},${active})`;
  }

  await sql`
    INSERT INTO audit_logs (actor_user_id,actor_email,action,entity_type,entity_id,summary)
    VALUES (${user.id},${user.email},${id ? "edit" : "create"},'category',${id ? String(id) : slug},${"Categoria salva: " + name})
  `;

  revalidatePath("/admin/cadastros");
  revalidatePath("/catalogo");
}
