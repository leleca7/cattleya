import { ProductCard } from "@/components/product-card";
import { getCategories, getPublishedProducts } from "@/lib/data";
import { slugify } from "@/lib/format";

export const metadata = { title: "Catálogo" };

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; q?: string }>;
}) {
  const params = await searchParams;
  const [allProducts, categories] = await Promise.all([
    getPublishedProducts(),
    getCategories(),
  ]);

  const categoryParam = params.categoria?.trim();
  const search = params.q?.trim().toLocaleLowerCase("pt-BR");

  const products = allProducts.filter((product) => {
    const categoryMatches =
      !categoryParam ||
      slugify(product.category ?? "") === categoryParam ||
      product.category === categoryParam;

    const searchMatches =
      !search ||
      product.name.toLocaleLowerCase("pt-BR").includes(search) ||
      (product.code ?? "").toLocaleLowerCase("pt-BR").includes(search);

    return categoryMatches && searchMatches;
  });

  return (
    <section className="section container catalog-page">
      <div className="page-heading">
        <p className="eyebrow">Bolsas & Calçados</p>
        <h1>Catálogo</h1>
        <p>{products.length} {products.length === 1 ? "peça" : "peças"}</p>
      </div>

      <form className="catalog-toolbar" action="/catalogo">
        <input
          name="q"
          defaultValue={params.q ?? ""}
          placeholder="Buscar por nome ou código"
          aria-label="Buscar produtos"
        />
        <select name="categoria" defaultValue={categoryParam ?? ""} aria-label="Filtrar categoria">
          <option value="">Todas as categorias</option>
          {categories.map((category) => (
            <option value={category.slug} key={category.id}>{category.name}</option>
          ))}
        </select>
        <button className="button button-primary" type="submit">Filtrar</button>
      </form>

      {products.length ? (
        <div className="product-grid product-grid-four">
          {products.map((product) => <ProductCard product={product} key={product.id} />)}
        </div>
      ) : (
        <div className="empty-state">
          <h2>Nenhuma peça encontrada</h2>
          <p>Tente outro nome ou remova os filtros.</p>
        </div>
      )}
    </section>
  );
}
