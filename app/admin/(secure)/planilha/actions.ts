"use server";

import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/admin-auth";
import { slugify } from "@/lib/format";
import { sql } from "@/lib/db";

function priceToCents(value: string) {
  const cleaned = value.replace(/R\$/gi, "").trim().replace(/\./g, "").replace(",", ".");
  const number = Number(cleaned);
  return Number.isFinite(number) ? Math.round(number * 100) : 0;
}

function normalizeHeader(value: string) {
  return slugify(value).replace(/-/g, "_");
}

export async function importPastedSheet(formData: FormData) {
  const user = await requireAdminUser();
  const raw = String(formData.get("data") ?? "").trim();
  if (!raw) return;

  const lines = raw.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return;
  const delimiter = lines[0].includes("\t") ? "\t" : ";";
  const headers = lines[0].split(delimiter).map(normalizeHeader);

  let imported = 0;

  for (const line of lines.slice(1)) {
    const values = line.split(delimiter);
    const row = Object.fromEntries(headers.map((key, i) => [key, (values[i] ?? "").trim()]));

    const code = row.codigo || row.code || "";
    const name = row.nome || row.name || "";
    const category = row.categoria || row.category || "";
    const price = row.preco || row.preco_venda || row.price || "0";
    if (!name) continue;

    let categoryId: number | null = null;
    if (category) {
      const categoryRows = await sql`
        INSERT INTO categories (name,slug,sort_order,active)
        VALUES (${category},${slugify(category)},999,TRUE)
        ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name
        RETURNING id
      `;
      categoryId = Number(categoryRows[0]?.id ?? 0) || null;
    }

    const slug = code ? slugify(code) : slugify(name);
    const cents = priceToCents(price);

    await sql`
      INSERT INTO products (code,name,slug,category_id,price_cents,status,availability_type,lead_time)
      VALUES (${code || null},${name},${slug},${categoryId},${cents},'published','encomenda','Prazo sob consulta')
      ON CONFLICT (slug) DO UPDATE SET
        name=EXCLUDED.name, category_id=EXCLUDED.category_id, price_cents=EXCLUDED.price_cents, updated_at=NOW()
    `;
    imported++;
  }

  await sql`
    INSERT INTO audit_logs (actor_user_id,actor_email,action,entity_type,summary,changes)
    VALUES (${user.id},${user.email},'import','product',${"Importação por planilha: " + imported + " linhas"},
      ${JSON.stringify({ imported })}::jsonb)
  `;

  revalidatePath("/admin/produtos");
  revalidatePath("/admin/planilha");
  revalidatePath("/catalogo");
}
