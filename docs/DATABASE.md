# Banco de dados e persistência

## Situação atual

O jogo funciona sem backend. A aplicação lê temas de `data/themes.json` (cópia inicial) e guarda alterações, placar e histórico em `localStorage`. Não é um banco compartilhado: cada navegador/dispositivo mantém seus próprios dados.

## Preparação para banco relacional

`database/schema.sql` fornece um esquema PostgreSQL para:

- `wheel_categories`: categorias das roletas.
- `wheel_items`: opções dentro de cada roleta.
- `players`: participantes e estatísticas.
- `rounds`: teses sorteadas, jogadores, vencedor, duração e observações.

`database/seed.sql` cria as categorias básicas.

### Exemplo de inicialização PostgreSQL

```bash
createdb me_debata
psql -d me_debata -f database/schema.sql
psql -d me_debata -f database/seed.sql
```

## Próxima etapa para usar PostgreSQL de verdade

1. Criar uma API (por exemplo, Node.js + Express).
2. Guardar a URL e credenciais do banco somente no servidor, nunca no HTML/JavaScript público.
3. Implementar endpoints para listar/criar/editar itens, jogadores e rodadas.
4. Substituir a camada `localStorage` do `assets/js/app.js` por chamadas à API.
5. Validar e limitar os dados no servidor.

Não coloque senha de banco, token ou string de conexão no repositório.
