import { loginAction } from "./actions";

export const metadata = { title: "Acesso administrativo" };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="admin-login-page">
      <form action={loginAction} className="admin-login-card">
        <div className="brand-mark">C</div>
        <p className="eyebrow">Cattleya</p>
        <h1>Painel administrativo</h1>
        <p className="admin-muted">Entre com um e-mail autorizado e a senha administrativa.</p>

        <div className="admin-form-group">
          <label htmlFor="email">E-mail</label>
          <input className="admin-input" id="email" name="email" type="email" required defaultValue="clatteyaoficial@gmail.com" />
        </div>

        <div className="admin-form-group">
          <label htmlFor="password">Senha</label>
          <input className="admin-input" id="password" name="password" type="password" required />
        </div>

        {params.erro && <p className="admin-error">E-mail ou senha inválidos.</p>}

        <button className="button button-primary button-wide" type="submit">Entrar</button>
      </form>
    </div>
  );
}
