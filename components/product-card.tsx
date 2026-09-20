import Image from "next/image";
import Link from "next/link";
import { FavoriteButton } from "@/components/favorite-button";
import { formatBRL } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const identifier = product.code ?? product.slug ?? String(product.id);

  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <Link href={`/produto/${encodeURIComponent(identifier)}`} aria-label={product.name}>
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="product-image"
            />
          ) : (
            <div className="product-image-placeholder">Cattleya</div>
          )}
        </Link>
        <FavoriteButton
          product={{
            identifier,
            name: product.name,
            price_cents: product.price_cents,
            image_url: product.image_url,
            category: product.category,
          }}
        />
        <div className="product-badges">
          {product.is_new && <span>Novidade</span>}
          {product.featured && <span>Destaque</span>}
        </div>
      </div>

      <div className="product-card-body">
        <p className="product-category">{product.category ?? "Cattleya"}</p>
        <Link href={`/produto/${encodeURIComponent(identifier)}`} className="product-name">
          {product.name}
        </Link>
        {product.code && <p className="product-code">Cód. {product.code}</p>}
        <p className="product-price">
          {formatBRL(product.sale_price_cents ?? product.price_cents)}
        </p>
        <p className="product-availability">
          {product.availability_type === "pronta_entrega"
            ? "Pronta entrega"
            : product.availability_type === "indisponivel"
              ? "Indisponível"
              : "Disponível sob encomenda"}
        </p>
      </div>
    </article>
  );
}
