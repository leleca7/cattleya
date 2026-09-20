import { AdminProductForm } from "@/components/admin-product-form";
import { getAdminCategories, getAdminColors, getAdminSizes } from "@/lib/admin-data";

export default async function AdminNewProductPage() {
  const [categories, colors, sizes] = await Promise.all([
    getAdminCategories(),
    getAdminColors(),
    getAdminSizes(),
  ]);

  return (
    <>
      <div className="admin-heading"><div><p className="eyebrow">Catálogo</p><h1>Novo produto</h1></div></div>
      <AdminProductForm
        product={null}
        categories={categories}
        colors={colors}
        sizes={sizes}
        selectedColors={[]}
        selectedSizes={[]}
        images={[]}
      />
    </>
  );
}
