import Link from "next/link";
import { ArrowRight, Clock3, HeartHandshake, Sparkles } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { getPublishedProducts, getSiteContentMap, getSiteSettings } from "@/lib/data";

export default async function HomePage() {
  const [products, settings, content] = await Promise.all([
    getPublishedProducts(),
    getSiteSettings(),
    getSiteContentMap(),
  ]);

  const hero = content.hero ?? {};
  const about = content.about ?? {};
  const steps = content.how_to_buy?.data?.steps ?? [
    "Escolha o modelo, a cor e a numeração desejados.",
    "Adicione os produtos à sua lista de interesse ou envie diretamente pelo WhatsApp.",
    "Aguarde a confirmação da disponibilidade, do valor e do prazo do pedido.",
    "Combine a forma de pagamento, a retirada ou a entrega com a nossa equipe.",
  ];

  const featured = products.filter((item) => item.featured).slice(0, 3);
  const highlights = featured.length >= 3 ? featured : products.slice(0, 3);
  const news = products.filter((item) => item.is_new).slice(0, 8);
  const newProducts = news.length ? news : products.slice(0, 8);

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">{settings.brand.category}</p>
            <h1>{hero.title ?? settings.brand.highlight_phrase}</h1>
            <p className="hero-text">
              {hero.body ?? "Descubra bolsas e calçados selecionados para acompanhar o seu estilo. Consulte cores, numerações, disponibilidade e prazo antes de finalizar seu pedido."}
            </p>
            {hero.data?.notice && <p className="hero-notice">{hero.data.notice}</p>}
            <div className="hero-actions">
              <Link href="/catalogo" className="button button-primary">
                Ver catálogo <ArrowRight size={17} />
              </Link>
              <Link href="/como-comprar" className="button button-ghost">
                Como comprar
              </Link>
            </div>
          </div>
          <div className="hero-panel">
            <div className="hero-orchid">C</div>
            <p>Mais estilo.</p>
            <p>Mais você.</p>
            <strong>Sempre.</strong>
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Seleção Cattleya</p>
            <h2>Destaques</h2>
          </div>
          <Link href="/catalogo">Ver tudo <ArrowRight size={15} /></Link>
        </div>
        <div className="product-grid">
          {highlights.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Chegaram agora</p>
              <h2>✦ Novidades</h2>
            </div>
            <Link href="/catalogo">Ver tudo <ArrowRight size={15} /></Link>
          </div>
          <div className="product-grid product-grid-four">
            {newProducts.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Sem complicação</p>
            <h2>Como comprar</h2>
          </div>
          <Link href="/como-comprar">Ver passo a passo <ArrowRight size={15} /></Link>
        </div>
        <div className="steps-grid">
          {steps.slice(0, 4).map((step: string, index: number) => (
            <div className="step-card" key={step}>
              <span>{index + 1}</span>
              <p>{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="benefits">
        <div className="container benefits-grid">
          <div><HeartHandshake /><h3>Atendimento próximo</h3><p>Cada cliente é única — falamos com você antes de confirmar qualquer pedido.</p></div>
          <div><Clock3 /><h3>Prazo sob consulta</h3><p>Disponibilidade e prazo confirmados antes do pagamento.</p></div>
          <div><Sparkles /><h3>Curadoria autoral</h3><p>Peças selecionadas com cuidado, sem pressa e sem exageros.</p></div>
        </div>
      </section>

      <section className="section container about-strip">
        <p className="eyebrow">Encomendas</p>
        <h2>{about.title ?? "Feito para destacar você."}</h2>
        <p>
          {about.body ?? "Na Cattleya, cada peça é escolhida com carinho para unir estilo, variedade e praticidade. Trabalhamos com bolsas e calçados sob encomenda, oferecendo atendimento próximo para ajudar você a encontrar o modelo, a cor e a numeração ideais."}
        </p>
      </section>
    </>
  );
}
