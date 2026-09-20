"use server";

import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/admin-auth";
import { sql } from "@/lib/db";

export async function addBioLink(formData: FormData) {
  const user = await requireAdminUser();
  const title = String(formData.get("title") ?? "").trim();
  const subtitle = String(formData.get("subtitle") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();
  const linkType = String(formData.get("link_type") ?? "external");
  const sortOrder = Number(formData.get("sort_order") ?? 0);
  if (!title) return;

  await sql`
    INSERT INTO bio_links (title,subtitle,url,link_type,sort_order,active)
    VALUES (${title},${subtitle || null},${url || null},${linkType},${sortOrder},TRUE)
  `;
  await sql`
    INSERT INTO audit_logs (actor_user_id,actor_email,action,entity_type,summary)
    VALUES (${user.id},${user.email},'create','bio_link',${"Link da bio criado: " + title})
  `;
  revalidatePath("/admin/link-da-bio");
}
