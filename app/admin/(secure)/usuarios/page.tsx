import { Shield, UserPlus } from "lucide-react";
import { getAdminUsers } from "@/lib/admin-data";
import { addAdminAccess } from "./actions";

export default async function AdminUsersPage() {
  const users = await getAdminUsers();

  return (
    <>
      <div className="admin-heading"><div><p className="eyebrow">Acessos</p><h1>Usuários</h1></div></div>

      <form action={addAdminAccess} className="admin-card admin-user-add">
        <div className="admin-form-group">
          <label>E-mail do novo acesso</label>
          <input className="admin-input" name="email" type="email" placeholder="email@exemplo.com" required />
        </div>
        <div className="admin-form-group">
          <label>Perfil</label>
          <select className="admin-select" name="role" defaultValue="editor">
            <option value="editor">Editora</option>
            <option value="owner">Proprietária</option>
          </select>
        </div>
        <button className="button button-primary" type="submit"><UserPlus size={17} /> Adicionar</button>
      </form>

      <div className="admin-list admin-section">
        {users.map((user: any) => (
          <div className="admin-list-row" key={user.id}>
            <div>
              <strong>{user.email}</strong>
              {user.name && <div className="admin-muted">{user.name}</div>}
            </div>
            <span className="status-pill"><Shield size={13} /> {user.role === "owner" ? "Proprietária" : "Editora"}</span>
          </div>
        ))}
      </div>

      <p className="admin-muted admin-section">
        Os usuários autorizados entram com o próprio e-mail e a senha administrativa definida no ambiente do site.
      </p>
    </>
  );
}
