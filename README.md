# Cattleya

Loja Cattleya reconstruída de forma independente do Base44.

## Stack

- Next.js
- React
- PostgreSQL no Neon
- Painel administrativo próprio
- Catálogo e favoritos
- Atendimento e pedidos via WhatsApp

## Variáveis de ambiente

Crie um arquivo `.env.local` usando `.env.example` como base:

- `DATABASE_URL`: conexão do projeto `cattleya` no Neon.
- `ADMIN_PASSWORD`: senha usada pelos acessos administrativos.
- `AUTH_SECRET`: chave longa e aleatória para assinar a sessão do painel.

Nunca envie o arquivo `.env.local` para o GitHub.

## Rodar localmente

```bash
npm install
npm run dev
```

Acesse:

- Loja: `http://localhost:3000`
- Painel: `http://localhost:3000/admin`
- Link da bio: `http://localhost:3000/bio`

## Banco

O banco principal fica no Neon. Produtos, categorias, imagens, conteúdo institucional, configurações, usuários administrativos e histórico de alterações são armazenados nele.

## Migração

O catálogo público do Base44 foi usado somente como origem para reconstrução. O novo projeto não depende do SDK ou do banco do Base44.
