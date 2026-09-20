import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { notFound } from "next/navigation";
import { FavoriteButton } from "@/components/favorite-button";
import { getProductByIdentifier, getProductImages, getSiteSettings } from "@/lib/data";
import { formatBRL } from "@/lib/format";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ identifier: string }>;
}) {
  const { identifier } = await params;
  const product = await getProductByIdentifier(decodeURIComponent(identifier));

  if (!product) notFound();

  const [images, settings] = await Promise.all([
    getProductImages(product.id),
    getSiteSettings(),
  ]);

  const currentIdentifier = product.code ?? product.slug ?? String(product.id);
  const message = encodeURIComponent(
    `Olá! Tenho interesse em encomendar ${product.name}${product.code ? ` (${product.code})` : ""} da Cattleya. Pode me informar as cores, numerações, valor e prazo disponíveis?`
  );
  const whatsapp = `https://wa.me/${settings.contact.whatsapp}?text=${message}`;

  return (
    <section className="section container product-page">
      <Link href="/catalogo" className="back-link"><ArrowLeft size={16} /> Catálogo</Link>

      <div className="product-detail-grid">
        <div className="product-gallery">
          {(images.length ? images : product.image_url ? [{ id: 0, url: product.image_url, alt_text: product.name }] : []).map((image, index) => (
            <div className="gallery-image" key={image.id ?? index}>
              <Image
                src={image.url}
                alt={image.alt_text ?? product.name}
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
                priority={index === 0}
              />
            </div>
          ))}
        </div>

        <div className="product-info">
          <div className="product-info-topline">
            <p className="eyebrow">{product.category ?? "Cattleya"}</p>
            <FavoriteButton
              product={{
                identifier: currentIdentifier,
                name: product.name,
                price_cents: product.price_cents,
                image_url: product.image_url,
                category: product.category,
              }}
            />
          </div>
          <h1>{product.name}</h1>
          {product.code && <p className="product-code">Código: {product.code}</p>}
          <p className="detail-price">{formatBRL(product.sale_price_cents ?? product.price_cents)}</p>
          {product.installment_text && <p>{product.installment_text}</p>}

          {product.short_description && <p className="detail-description">{product.short_description}</p>}

          <div className="detail-boxes">
            <div><span>Disponibilidade</span><strong>{product.availability_type === "pronta_entrega" ? "Pronta entrega" : "Disponível sob encomenda"}</strong></div>
            <div><span>Prazo</span><strong>{product.lead_time ?? "Prazo sob consulta"}</strong></div>
            {product.material && <div><span>Material</span><strong>{product.material}</strong></div>}
          </div>

          <p className="order-note">
            Produto disponível sob encomenda. A cor, a numeração e o prazo serão confirmados antes da finalização do pedido.
          </p>

          <a href={whatsapp} target="_blank" rel="noreferrer" className="button button-primary button-wide">
            <MessageCircle size={18} /> Consultar pelo WhatsApp
          </a>

          {product.description && (
            <div className="detail-long-text">
              <h2>Detalhes</h2>
              <p>{product.description}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
