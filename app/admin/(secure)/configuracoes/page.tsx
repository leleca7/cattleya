import { Save } from "lucide-react";
import { getSiteSetting, getWhatsappTemplates } from "@/lib/admin-data";
import { saveSettings } from "./actions";

export default async function AdminSettingsPage() {
  const [brand, contact, payment, delivery, templates] = await Promise.all([
    getSiteSetting("brand"),
    getSiteSetting("contact"),
    getSiteSetting("payment"),
    getSiteSetting("delivery"),
    getWhatsappTemplates(),
  ]);

  const wa = Object.fromEntries(templates.map((item: any) => [item.template_key, item.message]));

  return (
    <>
      <div className="admin-heading">
        <div><p className="eyebrow">Loja</p><h1>Configurações</h1></div>
      </div>

      <form action={saveSettings} className="admin-settings-form">
        <section className="admin-card">
          <h3>Identidade</h3>
          <div className="admin-grid admin-section">
            <div className="admin-form-group"><label>Nome da loja</label><input className="admin-input" name="store_name" defaultValue={brand.store_name ?? "Cattleya"} /></div>
            <div className="admin-form-group"><label>Categoria</label><input className="admin-input" name="category" defaultValue={brand.category ?? "Bolsas & Calçados"} /></div>
            <div className="admin-form-group"><label>Slogan</label><input className="admin-input" name="slogan" defaultValue={brand.slogan ?? ""} /></div>
            <div className="admin-form-group"><label>Frase de destaque</label><input className="admin-input" name="highlight_phrase" defaultValue={brand.highlight_phrase ?? ""} /></div>
          </div>
        </section>

        <section className="admin-card admin-section">
          <h3>Contatos</h3>
          <div className="admin-grid admin-section">
            <div className="admin-form-group"><label>WhatsApp (com DDI)</label><input className="admin-input" name="whatsapp" defaultValue={contact.whatsapp ?? ""} /></div>
            <div className="admin-form-group"><label>Instagram (sem @)</label><input className="admin-input" name="instagram" defaultValue={contact.instagram ?? ""} /></div>
            <div className="admin-form-group"><label>E-mail</label><input className="admin-input" name="email" type="email" defaultValue={contact.email ?? ""} /></div>
            <div className="admin-form-group"><label>Cidade</label><input className="admin-input" name="city" defaultValue={contact.city ?? ""} /></div>
            <div className="admin-form-group admin-grid-full"><label>Horário de atendimento</label><textarea className="admin-textarea" name="service_hours" defaultValue={contact.service_hours ?? ""} /></div>
          </div>
        </section>

        <section className="admin-card admin-section">
          <h3>Mensagens do WhatsApp</h3>
          <div className="admin-grid admin-section">
            {[
              ["order","Encomendar"],["availability","Disponibilidade"],["size","Tamanho"],
              ["delivery","Entrega"],["list","Pedido"],["generic","Genérico"],
            ].map(([key,label]) => (
              <div className="admin-form-group admin-grid-full" key={key}>
                <label>{label}</label>
                <textarea className="admin-textarea admin-textarea-small" name={`wa_${key}`} defaultValue={wa[key] ?? ""} />
              </div>
            ))}
          </div>
        </section>

        <section className="admin-card admin-section">
          <h3>Entrega</h3>
          <div className="admin-grid admin-section">
            <div className="admin-form-group admin-grid-full"><label>Retirada</label><textarea className="admin-textarea" name="pickup" defaultValue={delivery.pickup ?? ""} /></div>
            <div className="admin-form-group admin-grid-full"><label>Entrega local</label><textarea className="admin-textarea" name="local_delivery" defaultValue={delivery.local ?? ""} /></div>
            <div className="admin-form-group admin-grid-full"><label>Outras cidades</label><textarea className="admin-textarea" name="other_cities" defaultValue={delivery.other_cities ?? ""} /></div>
            <div className="admin-form-group admin-grid-full"><label>Observação de prazo</label><textarea className="admin-textarea" name="lead_time_note" defaultValue={delivery.lead_time_note ?? ""} /></div>
          </div>
        </section>

        <section className="admin-card admin-section">
          <h3>Pagamento e troca</h3>
          <div className="admin-grid admin-section">
            <div className="admin-form-group admin-grid-full"><label>Formas de pagamento (separadas por vírgula)</label><input className="admin-input" name="payment_methods" defaultValue={(payment.methods ?? []).join(", ")} /></div>
            <div className="admin-form-group admin-grid-full"><label>Parcelamento</label><textarea className="admin-textarea" name="installment_text" defaultValue={payment.installment_text ?? ""} /></div>
            <div className="admin-form-group admin-grid-full"><label>Troca — prazo</label><textarea className="admin-textarea" name="exchange_deadline" defaultValue={payment.exchange_deadline ?? "Para compras realizadas pelo site ou WhatsApp, a solicitação de arrependimento poderá ser feita em até 7 dias corridos após o recebimento."} /></div>
            <div className="admin-form-group admin-grid-full"><label>Troca — condições</label><textarea className="admin-textarea" name="exchange_conditions" defaultValue={payment.exchange_conditions ?? ""} /></div>
          </div>
        </section>

        <div className="admin-save-bar">
          <button className="button button-primary" type="submit"><Save size={17} /> Salvar configurações</button>
        </div>
      </form>
    </>
  );
}
