"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

type Favorite = {
  identifier: string;
  name: string;
  price_cents: number;
  image_url: string | null;
  category: string | null;
};

const KEY = "cattleya:favorites";

function formatBRL(cents: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  useEffect(() => {
    try {
      setFavorites(JSON.parse(localStorage.getItem(KEY) ?? "[]"));
    } catch {
      setFavorites([]);
    }
  }, []);

  function remove(identifier: string) {
    const next = favorites.filter((item) => item.identifier !== identifier);
    localStorage.setItem(KEY, JSON.stringify(next));
    setFavorites(next);
  }

  return (
    <section className="section container catalog-page">
      <div className="page-heading">
        <p className="eyebrow">Sua seleção</p>
        <h1>Favoritos e lista de interesse</h1>
        <p>Favoritos ({favorites.length})</p>
      </div>

      {!favorites.length ? (
        <div className="empty-state">
          <Heart size={32} />
          <h2>Nenhum favorito ainda.</h2>
          <p>Toque no coração das peças que você amou.</p>
          <Link href="/catalogo" className="button button-primary">Explorar catálogo</Link>
        </div>
      ) : (
        <div className="favorite-list">
          {favorites.map((item) => (
            <article key={item.identifier} className="favorite-row">
              <Link href={`/produto/${encodeURIComponent(item.identifier)}`} className="favorite-thumb">
                {item.image_url && <Image src={item.image_url} alt={item.name} fill sizes="96px" />}
              </Link>
              <div>
                <span>{item.category}</span>
                <Link href={`/produto/${encodeURIComponent(item.identifier)}`}><strong>{item.name}</strong></Link>
                <p>{formatBRL(item.price_cents)}</p>
              </div>
              <button type="button" onClick={() => remove(item.identifier)}>Remover</button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
