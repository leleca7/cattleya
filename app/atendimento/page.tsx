import { getSiteSettings } from "@/lib/data";

export const metadata = { title: "Atendimento" };

export default async function AtendimentoPage() {
  const settings = await getSiteSettings();
  const { contact } = settings;

  return (
    <section className="section container content-page">
      <p className="eyebrow">Estamos aqui</p>
      <h1>Atendimento</h1>
      <p className="lead">
        Nosso atendimento é realizado pelo WhatsApp. Estamos disponíveis para esclarecer dúvidas sobre modelos,
        cores, numerações, disponibilidade, pagamento, retirada e entrega.
      </p>

      <div className="contact-grid">
        <div><span>Horário</span><strong>{contact.service_hours}</strong></div>
        <div><span>E-mail</span><a href={`mailto:${contact.email}`}>{contact.email}</a></div>
        <div><span>Local</span><strong>{contact.city}</strong></div>
        <div><span>Instagram</span><a href={`https://instagram.com/${contact.instagram}`} target="_blank" rel="noreferrer">@{contact.instagram}</a></div>
      </div>

      <a
        href={`https://wa.me/${contact.whatsapp}`}
        target="_blank"
        rel="noreferrer"
        className="button button-primary"
      >
        Falar no WhatsApp
      </a>
    </section>
  );
}
