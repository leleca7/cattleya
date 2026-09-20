import Link from "next/link";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { getBioLinks } from "@/lib/admin-data";
import { getSiteSettings } from "@/lib/data";

export const metadata = { title: "Links" };

export default async function BioPage() {
  const [links, settings] = await Promise.all([getBioLinks(), getSiteSettings()]);
  const active = links.filter((item: any) => item.active);

  return (
    <section className="bio-page">
      <div className="bio-card">
        <div className="brand-mark bio-mark">C</div>
        <h1>{settings.brand.store_name}</h1>
        <p>{settings.brand.slogan}</p>

        <div className="bio-links">
          {active.map((item: any) => {
            const href =
              item.link_type === "whatsapp"
                ? `https://wa.me/${settings.contact.whatsapp}`
                : item.link_type === "catalog"
                  ? "/catalogo"
                  : item.url || "/";

            const inner = (
              <>
                <div>
                  <strong>{item.title}</strong>
                  {item.subtitle && <span>{item.subtitle}</span>}
                </div>
                {item.link_type === "whatsapp" ? <MessageCircle size={18} /> : <ArrowUpRight size={18} />}
              </>
            );

            return href.startsWith("/") ? (
              <Link href={href} className={`bio-link ${item.featured ? "featured" : ""}`} key={item.id}>{inner}</Link>
            ) : (
              <a href={href} target="_blank" rel="noreferrer" className={`bio-link ${item.featured ? "featured" : ""}`} key={item.id}>{inner}</a>
            );
          })}

          {!active.length && (
            <>
              <Link href="/catalogo" className="bio-link featured"><div><strong>Ver catálogo</strong><span>Bolsas & calçados Cattleya</span></div><ArrowUpRight size={18} /></Link>
              <a href={`https://wa.me/${settings.contact.whatsapp}`} target="_blank" rel="noreferrer" className="bio-link"><div><strong>WhatsApp</strong><span>Fale com a gente</span></div><MessageCircle size={18} /></a>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
