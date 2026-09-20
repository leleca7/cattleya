import { AlertCircle, Archive, Eye, EyeOff, Package } from "lucide-react";
import { getAdminStats } from "@/lib/admin-data";

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  const cards = [
    { label: "Produtos", value: stats.total, icon: Package },
    { label: "Publicados", value: stats.published, icon: Eye },
    { label: "Rascunhos", value: stats.drafts, icon: EyeOff },
    { label: "Ocultos", value: stats.hidden, icon: Archive },
  ];

  return (
    <>
      <div className="admin-heading">
        <div>
          <p className="eyebrow">Visão geral do catálogo Cattleya</p>
          <h1>Olá, clatteyaoficial</h1>
        </div>
      </div>

      <div className="admin-stats">
        {cards.map(({ label, value, icon: Icon }) => (
          <div className="admin-stat" key={label}>
            <Icon size={20} color="#e95d67" />
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>

      <section className="admin-card admin-section">
        <h3><AlertCircle size={18} /> Pendências</h3>
        <p className="admin-muted">
          Estrutura migrada para o Neon. Produtos sem código continuam editáveis pelo painel.
        </p>
      </section>

      <section className="admin-card admin-section admin-next-steps">
        <h3>✦ Próximos passos</h3>
        <ol>
          <li>Revise produtos, categorias e imagens.</li>
          <li>Confira contatos, entrega e pagamento em Configurações.</li>
          <li>Edite textos institucionais em Conteúdo.</li>
          <li>Publique o novo site quando a revisão terminar.</li>
        </ol>
      </section>
    </>
  );
}
