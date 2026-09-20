import Link from "next/link";
import { Heart, Menu, MessageCircle } from "lucide-react";
import type { SiteSettings } from "@/lib/types";

export function SiteHeader({ settings }: { settings: SiteSettings }) {
  const whatsapp = `https://wa.me/${settings.contact.whatsapp}`;

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="brand">
          <span className="brand-mark">C</span>
          <span className="brand-copy">
            <strong>{settings.brand.store_name}</strong>
            <small>{settings.brand.category}</small>
          </span>
        </Link>

        <nav className="desktop-nav" aria-label="Navegação principal">
          <Link href="/catalogo">Catálogo</Link>
          <Link href="/como-comprar">Como comprar</Link>
          <Link href="/atendimento">Atendimento</Link>
          <Link href="/favoritos">Favoritos</Link>
        </nav>

        <div className="header-actions">
          <Link href="/favoritos" aria-label="Favoritos" className="icon-link">
            <Heart size={20} />
          </Link>
          <a href={whatsapp} target="_blank" rel="noreferrer" className="whatsapp-link">
            <MessageCircle size={18} />
            WhatsApp
          </a>
          <Link href="/catalogo" className="mobile-menu" aria-label="Abrir catálogo">
            <Menu size={22} />
          </Link>
        </div>
      </div>
    </header>
  );
}
