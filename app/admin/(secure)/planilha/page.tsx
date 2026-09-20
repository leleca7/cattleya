import { FileSpreadsheet } from "lucide-react";
import { importPastedSheet } from "./actions";

export default function AdminSpreadsheetPage() {
  return (
    <>
      <div className="admin-heading">
        <div>
          <p className="eyebrow">Importação local</p>
          <h1>Importar planilha</h1>
          <p className="admin-muted">Sem Google Sheets, IA ou créditos de integração.</p>
        </div>
      </div>

      <section className="admin-card">
        <div className="admin-import-note">
          Esta importação usa apenas o banco Neon. Cole dados do Excel/Google Sheets com a primeira linha contendo os títulos.
        </div>

        <form action={importPastedSheet} className="admin-section">
          <div className="admin-form-group">
            <label>Colar dados da planilha</label>
            <textarea
              className="admin-textarea admin-textarea-import"
              name="data"
              placeholder={"codigo\tnome\tcategoria\tpreco\nCT-200\tSandália Nova\tSandálias\t159,90"}
              required
            />
          </div>
          <p className="admin-muted">
            Colunas aceitas nesta primeira versão: código, nome, categoria e preço. Use colunas separadas por TAB ou ponto e vírgula.
          </p>
          <button className="button button-primary" type="submit"><FileSpreadsheet size={17} /> Processar dados colados</button>
        </form>
      </section>
    </>
  );
}
