"use server";

import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/admin-auth";
import { sql } from "@/lib/db";

type RegistryType = "category" | "color" | "size";

function tableFor(type: RegistryType) {
  if (type === "color") return "colors";
  if (type === "size") return "sizes";
  return "categories";
}

export async function saveRegistry(formData: FormData) {
  const user = await requireAdminUser();
  const type = String(formData.get("type") ?? "category") as RegistryType;
  const table = tableFor(type);
  const id = Number(formData.get("id") ?? 0);
  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const sortOrder = Number(formData.get("sort_order") ?? 0);
  const active = formData.get("active") === "on";
  if (!name || !slug) return;

  if (table === "categories") {
    if (id) await sql`UPDATE categories SET name=${name}, slug=${slug}, sort_order=${sortOrder}, active=${active}, updated_at=NOW() WHERE id=${id}`;
    else await sql`INSERT INTO categories (name,slug,sort_order,active) VALUES (${name},${slug},${sortOrder},${active})`;
  } else if (table === "colors") {
    if (id) await sql`UPDATE colors SET name=${name}, slug=${slug}, sort_order=${sortOrder}, active=${active}, updated_at=NOW() WHERE id=${id}`;
    else await sql`INSERT INTO colors (name,slug,sort_order,active) VALUES (${name},${slug},${sortOrder},${active})`;
  } else {
    if (id) await sql`UPDATE sizes SET name=${name}, slug=${slug}, sort_order=${sortOrder}, active=${active}, updated_at=NOW() WHERE id=${id}`;
    else await sql`INSERT INTO sizes (name,slug,sort_order,active) VALUES (${name},${slug},${sortOrder},${active})`;
  }

  await sql`
    INSERT INTO audit_logs (actor_user_id,actor_email,action,entity_type,entity_id,summary)
    VALUES (${user.id},${user.email},${id ? "edit" : "create"},${type},${id ? String(id) : slug},${name + " salvo em " + table})
  `;

  revalidatePath("/admin/cadastros");
  revalidatePath("/catalogo");
}
