"use server";

import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/admin-auth";
import { sql } from "@/lib/db";

async function upsertSection(sectionKey: string, title: string, body: string, data: unknown) {
  await sql`
    INSERT INTO site_content (section_key,title,body,data,active,updated_at)
    VALUES (${sectionKey},${title || null},${body || null},${JSON.stringify(data)}::jsonb,TRUE,NOW())
    ON CONFLICT (section_key) DO UPDATE SET
      title=EXCLUDED.title, body=EXCLUDED.body, data=EXCLUDED.data, active=TRUE, updated_at=NOW()
  `;
}

export async function saveContent(formData: FormData) {
  const user = await requireAdminUser();

  const hero = {
    title: String(formData.get("hero_title") ?? ""),
    body: String(formData.get("hero_body") ?? ""),
    notice: String(formData.get("hero_notice") ?? ""),
  };
  const about = {
    title: String(formData.get("about_title") ?? ""),
    body: String(formData.get("about_body") ?? ""),
  };
  const steps = [1,2,3,4].map((n) => String(formData.get("step_" + n) ?? "")).filter(Boolean);
  const policies = String(formData.get("policies") ?? "");
  const footer = String(formData.get("footer_message") ?? "");

  await upsertSection("hero", hero.title, hero.body, { notice: hero.notice });
  await upsertSection("about", about.title, about.body, {});
  await upsertSection("how_to_buy", "Como comprar", "", { steps });
  await upsertSection("policies", "Políticas e condições", policies, {});
  await upsertSection("footer", "Rodapé", footer, {});

  await sql`
    INSERT INTO audit_logs (actor_user_id,actor_email,action,entity_type,summary)
    VALUES (${user.id},${user.email},'edit','content','Conteúdo institucional atualizado')
  `;

  revalidatePath("/");
  revalidatePath("/como-comprar");
  revalidatePath("/politicas");
  revalidatePath("/admin/conteudo");
}
