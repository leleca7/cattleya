import { sql } from "@/lib/db";

export async function getAdminStats() {
  const rows = await sql`
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE status = 'published')::int AS published,
      COUNT(*) FILTER (WHERE status = 'draft')::int AS drafts,
      COUNT(*) FILTER (WHERE status = 'hidden')::int AS hidden
    FROM products
  `;
  return rows[0] as { total: number; published: number; drafts: number; hidden: number };
}

export async function getAdminProducts() {
  return await sql`
    SELECT
      p.id, p.code, p.name, p.slug, p.price_cents, p.status, p.availability_type,
      c.name AS category,
      (
        SELECT pi.url FROM product_images pi
        WHERE pi.product_id = p.id
        ORDER BY pi.is_primary DESC, pi.sort_order ASC, pi.id ASC
        LIMIT 1
      ) AS image_url
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    ORDER BY p.updated_at DESC, p.id DESC
  `;
}

export async function getAdminCategories() {
  return await sql`
    SELECT id, name, slug, sort_order, active
    FROM categories
    ORDER BY sort_order ASC, name ASC
  `;
}

export async function getAdminUsers() {
  return await sql`
    SELECT id, email, name, role, active, created_at, last_login_at
    FROM admin_users
    ORDER BY CASE WHEN role='owner' THEN 0 ELSE 1 END, created_at ASC
  `;
}

export async function getAuditLogs(limit = 100) {
  return await sql`
    SELECT id, actor_email, action, entity_type, entity_id, record_ids, summary, changes, created_at
    FROM audit_logs
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;
}

export async function getSiteSetting(key: string) {
  const rows = await sql`SELECT value FROM site_settings WHERE key = ${key} LIMIT 1`;
  return rows[0]?.value ?? {};
}

export async function getSiteContents() {
  return await sql`
    SELECT id, section_key, title, body, data, active
    FROM site_content
    ORDER BY id ASC
  `;
}

export async function getWhatsappTemplates() {
  return await sql`
    SELECT id, template_key, label, message, active
    FROM whatsapp_templates
    ORDER BY id ASC
  `;
}

export async function getBioLinks() {
  return await sql`
    SELECT id, title, subtitle, url, link_type, icon_key, sort_order, featured, active
    FROM bio_links
    ORDER BY sort_order ASC, id ASC
  `;
}


export async function getAdminColors() {
  return await sql`
    SELECT id, name, slug, sort_order, active
    FROM colors
    ORDER BY sort_order ASC, name ASC
  `;
}

export async function getAdminSizes() {
  return await sql`
    SELECT id, name, slug, sort_order, active
    FROM sizes
    ORDER BY sort_order ASC, name ASC
  `;
}


export async function getAdminProduct(id: number) {
  const rows = await sql`
    SELECT p.*, c.name AS category_name
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE p.id = ${id}
    LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function getAdminProductImages(id: number) {
  return await sql`
    SELECT id, url, alt_text, sort_order, is_primary
    FROM product_images
    WHERE product_id = ${id}
    ORDER BY is_primary DESC, sort_order ASC, id ASC
  `;
}

export async function getAdminProductColorIds(id: number) {
  const rows = await sql`SELECT color_id FROM product_colors WHERE product_id=${id}`;
  return rows.map((row: any) => Number(row.color_id));
}

export async function getAdminProductSizeIds(id: number) {
  const rows = await sql`SELECT size_id FROM product_sizes WHERE product_id=${id}`;
  return rows.map((row: any) => Number(row.size_id));
}
