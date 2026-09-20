# Migração Cattleya

Estado atual:

- Código independente no GitHub.
- Banco PostgreSQL no Neon.
- 89 produtos únicos migrados.
- 6 registros duplicados sem código do catálogo antigo foram identificados e não duplicados no novo banco.
- 376 imagens de produtos associadas no Neon.
- Painel administrativo próprio em desenvolvimento.
- Nenhuma chave ou senha é armazenada no repositório.

A publicação deve usar variáveis de ambiente para `DATABASE_URL`, `ADMIN_PASSWORD` e `AUTH_SECRET`.
