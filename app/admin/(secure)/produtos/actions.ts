"use server";

import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/admin-auth";
import { sql } from "@/lib/db";

export async function updateProductQuick(formData: FormData) {
  const user = await requireAdminUser();
  const id = Number(formData.get("id"));
  const status = String(formData.get("status") ?? "draft");
  const availability = String(formData.get("availability") ?? "encomenda");
  const priceRaw = String(formData.get("price") ?? "0").replace(",", ".");
  const priceCents = Math.round(Number(priceRaw) * 100);

  if (!id || !Number.isFinite(priceCents)) return;

  const beforeRows = await sql`
    SELECT code, name, price_cents, status, availability_type
    FROM products WHERE id = ${id} LIMIT 1
  `;
  const before = beforeRows[0];

  await sql`
    UPDATE products
    SET price_cents = ${priceCents},
        status = ${status},
        availability_type = ${availability},
        updated_at = NOW()
    WHERE id = ${id}
  `;

  await sql`
    INSERT INTO audit_logs
      (actor_user_id, actor_email, action, entity_type, entity_id, summary, changes)
    VALUES
      (${user.id}, ${user.email}, 'edit', 'product', ${String(id)},
       ${"Produto atualizado: " + String(before?.name ?? id)},
       ${JSON.stringify({ before, after: { price_cents: priceCents, status, availability_type: availability } })}::jsonb)
  `;

  revalidatePath("/admin/produtos");
  revalidatePath("/catalogo");
}
