"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

type FavoriteProduct = {
  identifier: string;
  name: string;
  price_cents: number;
  image_url: string | null;
  category: string | null;
};

const KEY = "cattleya:favorites";

function readFavorites(): FavoriteProduct[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function FavoriteButton({ product }: { product: FavoriteProduct }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(readFavorites().some((item) => item.identifier === product.identifier));
  }, [product.identifier]);

  function toggle() {
    const current = readFavorites();
    const exists = current.some((item) => item.identifier === product.identifier);
    const next = exists
      ? current.filter((item) => item.identifier !== product.identifier)
      : [...current, product];

    localStorage.setItem(KEY, JSON.stringify(next));
    setActive(!exists);
    window.dispatchEvent(new Event("cattleya:favorites"));
  }

  return (
    <button
      type="button"
      className={`favorite-button ${active ? "is-active" : ""}`}
      onClick={toggle}
      aria-label={active ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      title={active ? "Remover dos favoritos" : "Adicionar aos favoritos"}
    >
      <Heart size={18} fill={active ? "currentColor" : "none"} />
    </button>
  );
}
