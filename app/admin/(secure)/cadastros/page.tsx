import { Save } from "lucide-react";
import { getAdminCategories } from "@/lib/admin-data";
import { saveCategory } from "./actions";

export default async function AdminRegistriesPage() {
  const categories = await getAdminCategories();

  return (
    <>
      <div className="admin-heading"><div><p className="eyebrow">Organização</p><h1>Cadastros</h1></div></div>

      <div className="admin-tabs">
        <span className="active">Categorias</span>
        <span>Cores</span>
        <span>Tamanhos</span>
      </div>

      <section className="admin-card">
        <div className="admin-list">
          {categories.map((category: any) => (
            <form action={saveCategory} className="admin-registry-row" key={category.id}>
              <input type="hidden" name="id" value={category.id} />
              <input className="admin-input" name="name" defaultValue={category.name} />
              <input className="admin-input" name="slug" defaultValue={category.slug} />
              <input className="admin-input admin-order-input" name="sort_order" type="number" defaultValue={category.sort_order} />
              <label className="admin-checkbox"><input name="active" type="checkbox" defaultChecked={category.active} /> Ativo</label>
              <button className="admin-icon-button" type="submit" aria-label="Salvar"><Save size={16} /></button>
            </form>
          ))}

          <form action={saveCategory} className="admin-registry-row admin-new-row">
            <input className="admin-input" name="name" placeholder="Nova categoria" required />
            <input className="admin-input" name="slug" placeholder="slug" required />
            <input className="admin-input admin-order-input" name="sort_order" type="number" defaultValue={120} />
            <label className="admin-checkbox"><input name="active" type="checkbox" defaultChecked /> Ativo</label>
            <button className="button button-primary" type="submit">Adicionar</button>
          </form>
        </div>
      </section>
    </>
  );
}
