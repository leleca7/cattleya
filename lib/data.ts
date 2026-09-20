import { sql } from "@/lib/db";
import type { Product, SiteSettings } from "@/lib/types";

type ProductRow = Omit<Product, "id" | "price_cents" | "sale_price_cents"> & {
  id: string | number;
  price_cents: string | number;
  sale_price_cents: string | number | null;
};

function normalizeProduct(row: ProductRow): Product {
  return {
    ...row,
    id: Number(row.id),
    price_cents: Number(row.price_cents),
    sale_price_cents:
      row.sale_price_cents === null ? null : Number(row.sale_price_cents),
  };
}

export async function getPublishedProducts(): Promise<Product[]> {
  const rows = (await sql`
    SELECT
      p.id,
      p.code,
      p.slug,
      p.name,
      c.name AS category,
      p.price_cents,
      p.sale_price_cents,
      p.installment_text,
      p.short_description,
      p.description,
      p.material,
      p.availability_type,
      p.lead_time,
      p.featured,
      p.is_new,
      p.status,
      (
        SELECT pi.url
        FROM product_images pi
        WHERE pi.product_id = p.id
        ORDER BY pi.is_primary DESC, pi.sort_order ASC, pi.id ASC
        LIMIT 1
      ) AS image_url
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE p.status = 'published'
    ORDER BY p.sort_order ASC, p.created_at DESC
  `) as ProductRow[];

  return rows.map(normalizeProduct);
}

export async function getProductByIdentifier(identifier: string): Promise<Product | null> {
  const rows = (await sql`
    SELECT
      p.id,
      p.code,
      p.slug,
      p.name,
      c.name AS category,
      p.price_cents,
      p.sale_price_cents,
      p.installment_text,
      p.short_description,
      p.description,
      p.material,
      p.availability_type,
      p.lead_time,
      p.featured,
      p.is_new,
      p.status,
      (
        SELECT pi.url
        FROM product_images pi
        WHERE pi.product_id = p.id
        ORDER BY pi.is_primary DESC, pi.sort_order ASC, pi.id ASC
        LIMIT 1
      ) AS image_url
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE p.status = 'published'
      AND (LOWER(COALESCE(p.code, '')) = LOWER(${identifier}) OR p.slug = ${identifier})
    LIMIT 1
  `) as ProductRow[];

  return rows[0] ? normalizeProduct(rows[0]) : null;
}

export async function getProductImages(productId: number) {
  return (await sql`
    SELECT id, url, alt_text, sort_order, is_primary
    FROM product_images
    WHERE product_id = ${productId}
    ORDER BY is_primary DESC, sort_order ASC, id ASC
  `) as Array<{
    id: number;
    url: string;
    alt_text: string | null;
    sort_order: number;
    is_primary: boolean;
  }>;
}

export async function getCategories() {
  return (await sql`
    SELECT id, name, slug, sort_order
    FROM categories
    WHERE active = TRUE
    ORDER BY sort_order ASC, name ASC
  `) as Array<{ id: number; name: string; slug: string; sort_order: number }>;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const rows = (await sql`
    SELECT key, value
    FROM site_settings
    WHERE key IN ('brand', 'contact')
  `) as Array<{ key: "brand" | "contact"; value: SiteSettings["brand"] | SiteSettings["contact"] }>;

  const map = Object.fromEntries(rows.map((row) => [row.key, row.value])) as Partial<SiteSettings>;

  return {
    brand: map.brand ?? {
      store_name: "Cattleya",
      category: "Bolsas & Calçados",
      slogan: "Mais estilo. Mais você. Sempre.",
      highlight_phrase: "Escolhas que fazem seu estilo florescer",
    },
    contact: map.contact ?? {
      whatsapp: "5571993125721",
      instagram: "clatteya",
      email: "clatteyaoficial@gmail.com",
      city: "Salvador — BA",
      service_hours: "Atendimento pelo WhatsApp de segunda a sábado, das 9h às 18h.",
    },
  };
}


export type SiteContentRow = {
  id: number;
  section_key: string;
  title: string | null;
  body: string | null;
  data: any;
  active: boolean;
};

export async function getSiteContentMap() {
  const rows = (await sql`
    SELECT id, section_key, title, body, data, active
    FROM site_content
    WHERE active = TRUE
    ORDER BY id ASC
  `) as SiteContentRow[];

  return Object.fromEntries(rows.map((row) => [row.section_key, row])) as Record<string, SiteContentRow>;
}

export async function getCommerceSettings() {
  const rows = (await sql`
    SELECT key, value
    FROM site_settings
    WHERE key IN ('payment','delivery')
  `) as Array<{ key: string; value: any }>;

  const map = Object.fromEntries(rows.map((row) => [row.key, row.value]));

  return {
    payment: map.payment ?? {},
    delivery: map.delivery ?? {},
  };
}
