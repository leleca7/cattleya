"use server";

import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/admin-auth";
import { sql } from "@/lib/db";

export async function saveSettings(formData: FormData) {
  const user = await requireAdminUser();

  const brand = {
    store_name: String(formData.get("store_name") ?? "Cattleya"),
    category: String(formData.get("category") ?? "Bolsas & Calçados"),
    slogan: String(formData.get("slogan") ?? ""),
    highlight_phrase: String(formData.get("highlight_phrase") ?? ""),
  };

  const contact = {
    whatsapp: String(formData.get("whatsapp") ?? "").replace(/\D/g, ""),
    instagram: String(formData.get("instagram") ?? "").replace(/^@/, ""),
    email: String(formData.get("email") ?? ""),
    city: String(formData.get("city") ?? ""),
    service_hours: String(formData.get("service_hours") ?? ""),
  };

  const payment = {
    methods: String(formData.get("payment_methods") ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    installment_text: String(formData.get("installment_text") ?? ""),
    exchange_deadline: String(formData.get("exchange_deadline") ?? ""),
    exchange_conditions: String(formData.get("exchange_conditions") ?? ""),
  };

  const delivery = {
    pickup: String(formData.get("pickup") ?? ""),
    local: String(formData.get("local_delivery") ?? ""),
    other_cities: String(formData.get("other_cities") ?? ""),
    lead_time_note: String(formData.get("lead_time_note") ?? ""),
  };

  for (const [key, value] of Object.entries({ brand, contact, payment, delivery })) {
    await sql`
      INSERT INTO site_settings (key,value,updated_at)
      VALUES (${key},${JSON.stringify(value)}::jsonb,NOW())
      ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value, updated_at=NOW()
    `;
  }

  const templateKeys = ["order", "availability", "size", "delivery", "list", "generic"];
  for (const key of templateKeys) {
    const value = String(formData.get("wa_" + key) ?? "").trim();
    if (value) {
      await sql`UPDATE whatsapp_templates SET message=${value}, updated_at=NOW() WHERE template_key=${key}`;
    }
  }

  await sql`
    INSERT INTO audit_logs (actor_user_id,actor_email,action,entity_type,summary,changes)
    VALUES (${user.id},${user.email},'edit','settings','Configurações da loja atualizadas',
      ${JSON.stringify({ brand, contact, payment, delivery })}::jsonb)
  `;

  revalidatePath("/");
  revalidatePath("/atendimento");
  revalidatePath("/politicas");
  revalidatePath("/admin/configuracoes");
}
