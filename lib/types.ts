export type Product = {
  id: number;
  code: string | null;
  slug: string | null;
  name: string;
  category: string | null;
  price_cents: number;
  sale_price_cents: number | null;
  installment_text: string | null;
  short_description: string | null;
  description: string | null;
  material: string | null;
  availability_type: "encomenda" | "pronta_entrega" | "indisponivel";
  lead_time: string | null;
  featured: boolean;
  is_new: boolean;
  status: "published" | "draft" | "hidden";
  image_url: string | null;
};

export type SiteSettings = {
  brand: {
    store_name: string;
    category: string;
    slogan: string;
    highlight_phrase: string;
  };
  contact: {
    whatsapp: string;
    instagram: string;
    email: string;
    city: string;
    service_hours: string;
  };
};
