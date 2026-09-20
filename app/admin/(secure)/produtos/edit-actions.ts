"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminUser } from "@/lib/admin-auth";
import { sql } from "@/lib/db";
import { slugify } from "@/lib/format";

function moneyToCents(value: string) {
  const normalized = value.trim().replace(/R\$/gi, "").replace(/\./g, "").replace(",", ".");
  const number = Number(normalized);
  return Number.isFinite(number) ? Math.round(number * 100) : 0;
}

export async function saveProduct(formData: FormData) {
  const user = await requireAdminUser();
  const existingId = Number(formData.get("id") ?? 0);
  const code = String(formData.get("code") ?? "").trim() || null;
  const name = String(formData.get("name") ?? "").trim();
  const categoryId = Number(formData.get("category_id") ?? 0) || null;
  const priceCents = moneyToCents(String(formData.get("price") ?? "0"));
  const saleRaw = String(formData.get("sale_price") ?? "").trim();
  const salePriceCents = saleRaw ? moneyToCents(saleRaw) : null;
  const status = String(formData.get("status") ?? "draft");
  const availability = String(formData.get("availability_type") ?? "encomenda");
  const leadTime = String(formData.get("lead_time") ?? "").trim();
  const shortDescription = String(formData.get("short_description") ?? "").trim();
  const material = String(formData.get("material") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const featured = formData.get("featured") === "on";
  const isNew = formData.get("is_new") === "on";
  const colorIds = formData.getAll("color_ids").map(Number).filter(Boolean);
  const sizeIds = formData.getAll("size_ids").map(Number).filter(Boolean);
  const imageUrls = String(formData.get("images") ?? "")
    .split(/\r?\n/)
    .map((url) => url.trim())
    .filter(Boolean);

  if (!name) return;

  let id = existingId;
  if (id) {
    const existingRows = await sql`SELECT slug FROM products WHERE id=${id} LIMIT 1`;
    const currentSlug = String(existingRows[0]?.slug ?? "");
    const nextSlug = code ? slugify(code) : currentSlug || `${slugify(name)}-${id}`;

    await sql`
      UPDATE products SET
        code=${code}, name=${name}, slug=${nextSlug}, category_id=${categoryId},
        price_cents=${priceCents}, sale_price_cents=${salePriceCents},
        short_description=${shortDescription || null}, description=${description || null},
        material=${material || null}, availability_type=${availability},
        lead_time=${leadTime || "Prazo sob consulta"}, status=${status},
        featured=${featured}, is_new=${isNew}, updated_at=NOW()
      WHERE id=${id}
    `;
  } else {
    const slug = code ? slugify(code) : `${slugify(name)}-${randomUUID().slice(0,8)}`;
    const rows = await sql`
      INSERT INTO products
        (code,name,slug,category_id,price_cents,sale_price_cents,short_description,description,material,
         availability_type,lead_time,status,featured,is_new)
      VALUES
        (${code},${name},${slug},${categoryId},${priceCents},${salePriceCents},
         ${shortDescription || null},${description || null},${material || null},
         ${availability},${leadTime || "Prazo sob consulta"},${status},${featured},${isNew})
      RETURNING id
    `;
    id = Number(rows[0].id);
  }

  await sql`DELETE FROM product_colors WHERE product_id=${id}`;
  for (const colorId of colorIds) {
    await sql`INSERT INTO product_colors (product_id,color_id) VALUES (${id},${colorId}) ON CONFLICT DO NOTHING`;
  }

  await sql`DELETE FROM product_sizes WHERE product_id=${id}`;
  for (const sizeId of sizeIds) {
    await sql`INSERT INTO product_sizes (product_id,size_id) VALUES (${id},${sizeId}) ON CONFLICT DO NOTHING`;
  }

  if (imageUrls.length) {
    await sql`DELETE FROM product_images WHERE product_id=${id}`;
    for (let i = 0; i < imageUrls.length; i++) {
      await sql`
        INSERT INTO product_images (product_id,url,alt_text,sort_order,is_primary)
        VALUES (${id},${imageUrls[i]},${name},${i * 10},${i === 0})
      `;
    }
  }

  await sql`
    INSERT INTO audit_logs (actor_user_id,actor_email,action,entity_type,entity_id,summary,changes)
    VALUES (${user.id},${user.email},${existingId ? "edit" : "create"},'product',${String(id)},
      ${(existingId ? "Produto atualizado: " : "Produto criado: ") + name},
      ${JSON.stringify({ code, name, categoryId, priceCents, status, availability, featured, isNew, colors: colorIds, sizes: sizeIds })}::jsonb)
  `;

  revalidatePath("/admin/produtos");
  revalidatePath("/catalogo");
  revalidatePath("/");
  redirect(`/admin/produtos/${id}`);
}
