import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section container empty-state">
      <h1>Produto não encontrado</h1>
      <p>A peça pode ter sido removida ou ainda não está publicada.</p>
      <Link href="/catalogo" className="button button-primary">Voltar ao catálogo</Link>
    </section>
  );
}
