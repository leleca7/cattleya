import { notFound } from "next/navigation";
import { AdminProductForm } from "@/components/admin-product-form";
import {
  getAdminCategories,
  getAdminColors,
  getAdminProduct,
  getAdminProductColorIds,
  getAdminProductImages,
  getAdminProductSizeIds,
  getAdminSizes,
} from "@/lib/admin-data";

export default async function AdminProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!id) notFound();

  const [product, categories, colors, sizes, selectedColors, selectedSizes, images] = await Promise.all([
    getAdminProduct(id),
    getAdminCategories(),
    getAdminColors(),
    getAdminSizes(),
    getAdminProductColorIds(id),
    getAdminProductSizeIds(id),
    getAdminProductImages(id),
  ]);

  if (!product) notFound();

  return (
    <>
      <div className="admin-heading"><div><p className="eyebrow">{product.code ?? "Sem código"}</p><h1>Editar produto</h1></div></div>
      <AdminProductForm
        product={product}
        categories={categories}
        colors={colors}
        sizes={sizes}
        selectedColors={selectedColors}
        selectedSizes={selectedSizes}
        images={images}
      />
    </>
  );
}
