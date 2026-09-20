import Link from "next/link";
import type { SiteSettings } from "@/lib/types";

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <p className="footer-brand">{settings.brand.store_name}</p>
          <p>{settings.brand.slogan}</p>
        </div>
        <div>
          <strong>Navegue</strong>
          <Link href="/catalogo">Catálogo</Link>
          <Link href="/como-comprar">Como comprar</Link>
          <Link href="/politicas">Políticas</Link>
        </div>
        <div>
          <strong>Atendimento</strong>
          <span>{settings.contact.city}</span>
          <a href={`mailto:${settings.contact.email}`}>{settings.contact.email}</a>
          <a href={`https://instagram.com/${settings.contact.instagram}`} target="_blank" rel="noreferrer">
            @{settings.contact.instagram}
          </a>
        </div>
      </div>
      <div className="footer-bottom">Cada escolha sua nos inspira a florescer.</div>
    </footer>
  );
}
