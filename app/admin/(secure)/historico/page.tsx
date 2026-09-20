import { History } from "lucide-react";
import { getAuditLogs } from "@/lib/admin-data";

export default async function AdminHistoryPage() {
  const logs = await getAuditLogs();

  return (
    <>
      <div className="admin-heading">
        <div><p className="eyebrow">Auditoria</p><h1><History size={30} /> Histórico de alterações</h1></div>
      </div>

      <div className="admin-history-list">
        {logs.length ? logs.map((log: any) => (
          <article className="admin-history-entry" key={log.id}>
            <div className="admin-history-meta">
              <strong>{log.summary ?? log.action}</strong>
              <span>{log.actor_email ?? "Sistema"} · {new Date(log.created_at).toLocaleString("pt-BR")}</span>
            </div>
            <div className="admin-muted">{log.action} · {log.entity_type}{log.entity_id ? ` · ${log.entity_id}` : ""}</div>
            {log.changes && Object.keys(log.changes).length > 0 && (
              <details>
                <summary>Ver detalhes</summary>
                <pre>{JSON.stringify(log.changes, null, 2)}</pre>
              </details>
            )}
          </article>
        )) : (
          <div className="admin-card"><p className="admin-muted">Ainda não há alterações registradas.</p></div>
        )}
      </div>
    </>
  );
}
