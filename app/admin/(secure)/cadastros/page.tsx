import Link from "next/link";
import { Save } from "lucide-react";
import { getAdminCategories, getAdminColors, getAdminSizes } from "@/lib/admin-data";
import { saveRegistry } from "./actions";

const options = {
  categorias: { label: "Categorias", type: "category" },
  cores: { label: "Cores", type: "color" },
  tamanhos: { label: "Tamanhos", type: "size" },
} as const;

export default async function AdminRegistriesPage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string }>;
}) {
  const params = await searchParams;
  const selected = (params.tipo && params.tipo in options ? params.tipo : "categorias") as keyof typeof options;
  const config = options[selected];

  const items =
    selected === "cores"
      ? await getAdminColors()
      : selected === "tamanhos"
        ? await getAdminSizes()
        : await getAdminCategories();

  return (
    <>
      <div className="admin-heading"><div><p className="eyebrow">Organização</p><h1>Cadastros</h1></div></div>

      <div className="admin-tabs">
        {Object.entries(options).map(([key, item]) => (
          <Link className={selected === key ? "active" : ""} href={`/admin/cadastros?tipo=${key}`} key={key}>
            {item.label}
          </Link>
        ))}
      </div>

      <section className="admin-card">
        <div className="admin-list">
          {items.map((item: any) => (
            <form action={saveRegistry} className="admin-registry-row" key={item.id}>
              <input type="hidden" name="type" value={config.type} />
              <input type="hidden" name="id" value={item.id} />
              <input className="admin-input" name="name" defaultValue={item.name} />
              <input className="admin-input" name="slug" defaultValue={item.slug} />
              <input className="admin-input admin-order-input" name="sort_order" type="number" defaultValue={item.sort_order} />
              <label className="admin-checkbox"><input name="active" type="checkbox" defaultChecked={item.active} /> Ativo</label>
              <button className="admin-icon-button" type="submit" aria-label="Salvar"><Save size={16} /></button>
            </form>
          ))}

          <form action={saveRegistry} className="admin-registry-row admin-new-row">
            <input type="hidden" name="type" value={config.type} />
            <input className="admin-input" name="name" placeholder={`Novo: ${config.label.toLowerCase()}`} required />
            <input className="admin-input" name="slug" placeholder="slug" required />
            <input className="admin-input admin-order-input" name="sort_order" type="number" defaultValue={items.length * 10 + 10} />
            <label className="admin-checkbox"><input name="active" type="checkbox" defaultChecked /> Ativo</label>
            <button className="button button-primary" type="submit">Adicionar</button>
          </form>
        </div>

        {selected === "tamanhos" && items.length === 0 && (
          <p className="admin-muted admin-section">
            Ainda não há tamanhos cadastrados. Como o catálogo atual trabalha com numeração sob consulta, não inventamos tamanhos durante a migração.
          </p>
        )}
      </section>
    </>
  );
}
