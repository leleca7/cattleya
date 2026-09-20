import Link from "next/link";

export const metadata = { title: "Como comprar" };

export default function HowToBuyPage() {
  const steps = [
    "Escolha o modelo, a cor e a numeração desejados.",
    "Adicione os produtos à sua lista de interesse ou envie diretamente pelo WhatsApp.",
    "Aguarde a confirmação da disponibilidade, do valor e do prazo do pedido.",
    "Combine a forma de pagamento, a retirada ou a entrega com a nossa equipe.",
  ];

  return (
    <section className="section container content-page">
      <p className="eyebrow">Passo a passo</p>
      <h1>Como comprar</h1>
      <p className="lead">
        A Cattleya não tem pagamento online neste momento. Tudo acontece com atendimento próximo pelo WhatsApp,
        para conferir disponibilidade e prazo antes de qualquer pagamento.
      </p>

      <div className="steps-grid content-steps">
        {steps.map((step, index) => <div className="step-card" key={step}><span>{index + 1}</span><p>{step}</p></div>)}
      </div>

      <div className="info-grid">
        <div><h3>Escolha</h3><p>Navegue pelo catálogo e use os filtros de cor, tamanho e disponibilidade.</p></div>
        <div><h3>Monte sua lista</h3><p>Favorite as peças que você amou para consultar depois.</p></div>
        <div><h3>Confirme</h3><p>Envie pelo WhatsApp e aguarde a confirmação de disponibilidade e prazo.</p></div>
        <div><h3>Pagamento</h3><p>Pix, cartão de crédito e cartão de débito. Condições confirmadas no atendimento.</p></div>
      </div>

      <div className="content-block">
        <h2>Entrega</h2>
        <p>Retirada em Salvador, somente com dia e horário combinados previamente pelo WhatsApp.</p>
        <p>Entrega em Salvador e região por aplicativo ou serviço de transporte, conforme disponibilidade.</p>
        <p>Enviamos para outras cidades por Correios ou transportadora.</p>
      </div>

      <Link href="/catalogo" className="button button-primary">Ir para o catálogo</Link>
    </section>
  );
}
