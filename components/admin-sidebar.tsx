import Link from "next/link";
import {
  Boxes,
  ClipboardList,
  FileSpreadsheet,
  History,
  Home,
  Link2,
  Settings,
  Tags,
  Users,
} from "lucide-react";

const items = [
  { href: "/admin", label: "Início", icon: Home },
  { href: "/admin/produtos", label: "Produtos", icon: Boxes },
  { href: "/admin/planilha", label: "Planilha", icon: FileSpreadsheet },
  { href: "/admin/cadastros", label: "Cadastros", icon: Tags },
  { href: "/admin/conteudo", label: "Conteúdo", icon: ClipboardList },
  { href: "/admin/link-da-bio", label: "Link da bio", icon: Link2 },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
  { href: "/admin/usuarios", label: "Usuários", icon: Users },
  { href: "/admin/historico", label: "Histórico", icon: History },
];

export function AdminSidebar({ email }: { email: string }) {
  return (
    <aside className="admin-sidebar">
      <div className="admin-logo">
        <strong>Cattleya</strong>
        <small>Painel administrativo</small>
      </div>

      <nav className="admin-nav">
        {items.map(({ href, label, icon: Icon }) => (
          <Link href={href} key={href}>
            <Icon size={18} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <div className="admin-sidebar-footer">{email}</div>
    </aside>
  );
}
