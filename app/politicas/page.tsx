import { getCommerceSettings, getSiteContentMap } from "@/lib/data";

export const metadata = { title: "Políticas e condições" };

export default async function PoliciesPage() {
  const [content, commerce] = await Promise.all([
    getSiteContentMap(),
    getCommerceSettings(),
  ]);

  const custom = content.policies?.body;
  const payment = commerce.payment;
  const delivery = commerce.delivery;

  return (
    <section className="section container content-page policies">
      <p className="eyebrow">Informações</p>
      <h1>Políticas e condições</h1>
      <p className="lead">As condições são confirmadas antes da finalização de cada pedido.</p>

      {custom ? (
        <div className="policy-custom-text">{custom}</div>
      ) : (
        <>
          <h2>Encomendas</h2>
          <p>Nossos produtos estão sujeitos à disponibilidade do fornecedor. Antes da confirmação do pedido, informaremos as cores, numerações, valores e o prazo estimado.</p>

          <h2>Entrega e retirada</h2>
          {delivery.pickup && <p>{delivery.pickup}</p>}
          {delivery.local && <p>{delivery.local}</p>}
          {delivery.other_cities && <p>{delivery.other_cities}</p>}
          {delivery.lead_time_note && <p>{delivery.lead_time_note}</p>}

          <h2>Pagamento</h2>
          <p>{(payment.methods ?? ["Pix", "cartão de crédito", "cartão de débito"]).join(", ")}.</p>
          {payment.installment_text && <p>{payment.installment_text}</p>}

          <h2>Troca e devolução</h2>
          <p>{payment.exchange_deadline ?? "Para compras realizadas pelo site ou WhatsApp, a solicitação de arrependimento poderá ser feita em até 7 dias corridos após o recebimento, conforme a legislação aplicável."}</p>
          {payment.exchange_conditions && <p>{payment.exchange_conditions}</p>}

          <h2>Cancelamento</h2>
          <p>Caso precise cancelar ou alterar um pedido, entre em contato conosco o mais rápido possível. As condições serão avaliadas conforme a etapa em que a encomenda estiver.</p>

          <h2>Privacidade</h2>
          <p>As informações fornecidas durante o atendimento serão utilizadas somente para responder às solicitações, organizar pedidos e facilitar a entrega ou retirada.</p>
        </>
      )}
    </section>
  );
}
