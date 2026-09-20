import { Save } from "lucide-react";
import { getSiteContents } from "@/lib/admin-data";
import { saveContent } from "./actions";

export default async function AdminContentPage() {
  const rows = await getSiteContents();
  const content = Object.fromEntries(rows.map((row: any) => [row.section_key, row]));

  const hero = content.hero ?? {};
  const about = content.about ?? {};
  const how = content.how_to_buy ?? {};
  const policies = content.policies ?? {};
  const footer = content.footer ?? {};
  const steps = how.data?.steps ?? [];

  return (
    <>
      <div className="admin-heading"><div><p className="eyebrow">Textos editáveis</p><h1>Conteúdo do Site</h1></div></div>

      <form action={saveContent}>
        <section className="admin-card">
          <h3>Banner principal</h3>
          <div className="admin-form-group admin-section"><label>Título do banner</label><input className="admin-input" name="hero_title" defaultValue={hero.title ?? "Escolhas que fazem seu estilo florescer."} /></div>
          <div className="admin-form-group admin-section"><label>Texto do banner</label><textarea className="admin-textarea" name="hero_body" defaultValue={hero.body ?? ""} /></div>
          <div className="admin-form-group admin-section"><label>Aviso temporário (opcional)</label><input className="admin-input" name="hero_notice" defaultValue={hero.data?.notice ?? ""} /></div>
        </section>

        <section className="admin-card admin-section">
          <h3>Sobre / encomendas</h3>
          <div className="admin-form-group admin-section"><label>Título</label><input className="admin-input" name="about_title" defaultValue={about.title ?? "Feito para destacar você."} /></div>
          <div className="admin-form-group admin-section"><label>Texto</label><textarea className="admin-textarea" name="about_body" defaultValue={about.body ?? ""} /></div>
        </section>

        <section className="admin-card admin-section">
          <h3>Como comprar</h3>
          {[1,2,3,4].map((n) => (
            <div className="admin-form-group admin-section" key={n}>
              <label>Passo {n}</label>
              <input className="admin-input" name={`step_${n}`} defaultValue={steps[n-1] ?? ""} />
            </div>
          ))}
        </section>

        <section className="admin-card admin-section">
          <h3>Textos de políticas</h3>
          <div className="admin-form-group admin-section"><label>Políticas e condições</label><textarea className="admin-textarea admin-textarea-large" name="policies" defaultValue={policies.body ?? ""} /></div>
          <div className="admin-form-group admin-section"><label>Mensagem do rodapé</label><input className="admin-input" name="footer_message" defaultValue={footer.body ?? "Cada escolha sua nos inspira a florescer."} /></div>
        </section>

        <div className="admin-save-bar">
          <button className="button button-primary" type="submit"><Save size={17} /> Salvar conteúdo</button>
        </div>
      </form>
    </>
  );
}
