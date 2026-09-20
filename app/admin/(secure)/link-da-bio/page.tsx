import { Plus } from "lucide-react";
import { getBioLinks } from "@/lib/admin-data";
import { addBioLink } from "./actions";

export default async function AdminBioPage() {
  const links = await getBioLinks();

  return (
    <>
      <div className="admin-heading">
        <div><p className="eyebrow">Instagram</p><h1>Link da bio</h1><p className="admin-muted">Página exclusiva para a bio. Não aparece no menu principal do site.</p></div>
      </div>

      <form action={addBioLink} className="admin-card admin-grid">
        <div className="admin-form-group"><label>Título</label><input className="admin-input" name="title" placeholder="Novo link" required /></div>
        <div className="admin-form-group"><label>Subtítulo</label><input className="admin-input" name="subtitle" placeholder="Subtítulo (opcional)" /></div>
        <div className="admin-form-group"><label>URL</label><input className="admin-input" name="url" placeholder="https://..." /></div>
        <div className="admin-form-group"><label>Tipo</label><select className="admin-select" name="link_type"><option value="external">Link externo</option><option value="whatsapp">WhatsApp</option><option value="catalog">Catálogo</option><option value="page">Página</option></select></div>
        <div className="admin-form-group"><label>Ordem</label><input className="admin-input" type="number" name="sort_order" defaultValue={0} /></div>
        <div className="admin-form-group admin-form-submit"><button className="button button-primary" type="submit"><Plus size={17} /> Novo link</button></div>
      </form>

      <div className="admin-list admin-section">
        {links.map((link: any) => (
          <div className="admin-list-row" key={link.id}>
            <div><strong>{link.title}</strong><div className="admin-muted">{link.subtitle || link.url || "Sem URL"}</div></div>
            <span className="status-pill">{link.active ? "Ativo" : "Inativo"}</span>
          </div>
        ))}
      </div>
    </>
  );
}
