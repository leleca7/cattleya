import Image from "next/image";
import { Save } from "lucide-react";
import { getAdminProducts } from "@/lib/admin-data";
import { updateProductQuick } from "./actions";

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <>
      <div className="admin-heading">
        <div><p className="eyebrow">Catálogo</p><h1>Produtos</h1></div>
        <span className="admin-muted">{products.length} registros únicos</span>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Status</th>
              <th>Preço</th>
              <th>Disponibilidade</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product: any) => (
              <tr key={product.id}>
                <td>
                  <div className="admin-product">
                    <div className="admin-product-thumb">
                      {product.image_url && <Image src={product.image_url} alt={product.name} fill sizes="45px" />}
                    </div>
                    <div>
                      <strong>{product.name}</strong>
                      <div className="admin-muted">{product.code ?? "Sem código"} · {product.category ?? "Sem categoria"}</div>
                    </div>
                  </div>
                </td>
                <td colSpan={4}>
                  <form action={updateProductQuick} className="admin-quick-form">
                    <input type="hidden" name="id" value={product.id} />
                    <select className="admin-select" name="status" defaultValue={product.status}>
                      <option value="published">Publicado</option>
                      <option value="draft">Rascunho</option>
                      <option value="hidden">Oculto</option>
                    </select>
                    <input className="admin-input" name="price" inputMode="decimal" defaultValue={(Number(product.price_cents) / 100).toFixed(2)} />
                    <select className="admin-select" name="availability" defaultValue={product.availability_type}>
                      <option value="encomenda">Encomenda</option>
                      <option value="pronta_entrega">Pronta entrega</option>
                      <option value="indisponivel">Indisponível</option>
                    </select>
                    <button className="admin-icon-button" type="submit" aria-label="Salvar"><Save size={17} /></button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
