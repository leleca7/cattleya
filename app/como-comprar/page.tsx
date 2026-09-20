import Link from "next/link";
import { getCommerceSettings, getSiteContentMap } from "@/lib/data";

export const metadata = { title: "Como comprar" };

export default async function HowToBuyPage() {
  const [content, commerce] = await Promise.all([
    getSiteContentMap(),
    getCommerceSettings(),
  ]);

  const steps = content.how_to_buy?.data?.steps ?? [
    "Escolha o modelo, a cor e a numeração desejados.",
    "Adicione os produtos à sua lista de interesse ou envie diretamente pelo WhatsApp.",
    "Aguarde a confirmação da disponibilidade, do valor e do prazo do pedido.",
    "Combine a forma de pagamento, a retirada ou a entrega com a nossa equipe.",
  ];

  const payment = commerce.payment;
  const delivery = commerce.delivery;

  return (
    <section className="section container content-page">
      <p className="eyebrow">Passo a passo</p>
      <h1>Como comprar</h1>
      <p className="lead">
        A Cattleya não tem pagamento online neste momento. Tudo acontece com atendimento próximo pelo WhatsApp,
        para conferir disponibilidade e prazo antes de qualquer pagamento.
      </p>

      <div className="steps-grid content-steps">
        {steps.slice(0, 4).map((step: string, index: number) => (
          <div className="step-card" key={step}><span>{index + 1}</span><p>{step}</p></div>
        ))}
      </div>

      <div className="info-grid">
        <div><h3>Escolha</h3><p>Navegue pelo catálogo e use os filtros para encontrar suas peças.</p></div>
        <div><h3>Monte sua lista</h3><p>Favorite as peças que você amou para consultar depois.</p></div>
        <div><h3>Confirme</h3><p>Envie pelo WhatsApp e aguarde a confirmação de disponibilidade e prazo.</p></div>
        <div><h3>Pagamento</h3><p>{(payment.methods ?? ["Pix", "cartão de crédito", "cartão de débito"]).join(", ")}. {payment.installment_text ?? ""}</p></div>
      </div>

      <div className="content-block">
        <h2>Entrega</h2>
        {delivery.pickup && <p>{delivery.pickup}</p>}
        {delivery.local && <p>{delivery.local}</p>}
        {delivery.other_cities && <p>{delivery.other_cities}</p>}
        {delivery.lead_time_note && <p>{delivery.lead_time_note}</p>}
      </div>

      <Link href="/catalogo" className="button button-primary">Ir para o catálogo</Link>
    </section>
  );
}
