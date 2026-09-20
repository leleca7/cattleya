import Link from "next/link";
import { Save } from "lucide-react";
import { saveProduct } from "@/app/admin/(secure)/produtos/edit-actions";

export function AdminProductForm({
  product,
  categories,
  colors,
  sizes,
  selectedColors,
  selectedSizes,
  images,
}: {
  product: any;
  categories: any[];
  colors: any[];
  sizes: any[];
  selectedColors: number[];
  selectedSizes: number[];
  images: any[];
}) {
  return (
    <form action={saveProduct} className="admin-settings-form">
      <input type="hidden" name="id" value={product?.id ?? ""} />

      <section className="admin-card">
        <h3>Dados principais</h3>
        <div className="admin-grid admin-section">
          <div className="admin-form-group"><label>Nome</label><input className="admin-input" name="name" required defaultValue={product?.name ?? ""} /></div>
          <div className="admin-form-group"><label>Código</label><input className="admin-input" name="code" defaultValue={product?.code ?? ""} placeholder="CT-000" /></div>
          <div className="admin-form-group"><label>Categoria</label><select className="admin-select" name="category_id" defaultValue={product?.category_id ?? ""}><option value="">Sem categoria</option>{categories.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></div>
          <div className="admin-form-group"><label>Status</label><select className="admin-select" name="status" defaultValue={product?.status ?? "draft"}><option value="published">Publicado</option><option value="draft">Rascunho</option><option value="hidden">Oculto</option></select></div>
          <div className="admin-form-group"><label>Preço</label><input className="admin-input" name="price" defaultValue={product ? (Number(product.price_cents)/100).toFixed(2).replace(".",",") : ""} /></div>
          <div className="admin-form-group"><label>Preço promocional</label><input className="admin-input" name="sale_price" defaultValue={product?.sale_price_cents ? (Number(product.sale_price_cents)/100).toFixed(2).replace(".",",") : ""} /></div>
          <div className="admin-form-group"><label>Disponibilidade</label><select className="admin-select" name="availability_type" defaultValue={product?.availability_type ?? "encomenda"}><option value="encomenda">Encomenda</option><option value="pronta_entrega">Pronta entrega</option><option value="indisponivel">Indisponível</option></select></div>
          <div className="admin-form-group"><label>Prazo</label><input className="admin-input" name="lead_time" defaultValue={product?.lead_time ?? "Prazo sob consulta"} /></div>
        </div>

        <div className="admin-inline-checks admin-section">
          <label className="admin-checkbox"><input type="checkbox" name="featured" defaultChecked={Boolean(product?.featured)} /> Destaque</label>
          <label className="admin-checkbox"><input type="checkbox" name="is_new" defaultChecked={Boolean(product?.is_new)} /> Novidade</label>
        </div>
      </section>

      <section className="admin-card admin-section">
        <h3>Descrição</h3>
        <div className="admin-form-group admin-section"><label>Descrição curta</label><textarea className="admin-textarea" name="short_description" defaultValue={product?.short_description ?? ""} /></div>
        <div className="admin-form-group admin-section"><label>Material</label><textarea className="admin-textarea admin-textarea-small" name="material" defaultValue={product?.material ?? ""} /></div>
        <div className="admin-form-group admin-section"><label>Detalhes</label><textarea className="admin-textarea admin-textarea-large" name="description" defaultValue={product?.description ?? ""} /></div>
      </section>

      <section className="admin-card admin-section">
        <h3>Cores</h3>
        <div className="admin-option-grid admin-section">
          {colors.map((item) => (
            <label className="admin-option-check" key={item.id}>
              <input type="checkbox" name="color_ids" value={item.id} defaultChecked={selectedColors.includes(Number(item.id))} />
              <span>{item.name}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="admin-card admin-section">
        <h3>Tamanhos</h3>
        {sizes.length ? (
          <div className="admin-option-grid admin-section">
            {sizes.map((item) => (
              <label className="admin-option-check" key={item.id}>
                <input type="checkbox" name="size_ids" value={item.id} defaultChecked={selectedSizes.includes(Number(item.id))} />
                <span>{item.name}</span>
              </label>
            ))}
          </div>
        ) : <p className="admin-muted admin-section">Nenhum tamanho cadastrado. Adicione em Cadastros → Tamanhos quando necessário.</p>}
      </section>

      <section className="admin-card admin-section">
        <h3>Imagens</h3>
        <div className="admin-form-group admin-section">
          <label>URLs — uma por linha. A primeira será a principal.</label>
          <textarea className="admin-textarea admin-textarea-large" name="images" defaultValue={images.map((item) => item.url).join("\n")} placeholder="https://..." />
        </div>
      </section>

      <div className="admin-save-bar">
        <Link href="/admin/produtos" className="button button-ghost">Voltar</Link>
        <button className="button button-primary" type="submit"><Save size={17} /> Salvar produto</button>
      </div>
    </form>
  );
}
