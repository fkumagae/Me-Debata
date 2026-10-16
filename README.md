# ME DEBATA 🎰

Jogo de debates improvisados para festas e repúblicas. Três roletas combinam **sujeito + verbo + complemento** para gerar uma tese; os jogadores recebem lados opostos e o mediador decide quem venceu.

## Requisitos

- Navegador moderno (Chrome, Firefox, Edge ou Safari).
- Não precisa instalar dependências nem configurar servidor ou banco de dados para a versão local.

## Executar

1. Extraia o ZIP.
2. Abra `index.html` no navegador.

Opcional: para executar por um servidor local, entre na pasta e rode:

```bash
python -m http.server 8000
```

Acesse `http://localhost:8000`.

## Funcionalidades

- Sorteio de teses usando três roletas.
- Sorteio dos lados **A FAVOR** e **CONTRA**.
- Temporizador de preparação e debate.
- Placar de jogadores, registro de vencedores e histórico de rodadas.
- Gerenciamento de listas de sujeitos, verbos e complementos.
- Cadastro de temas personalizados.
- Exportação e importação de temas em JSON.
- Persistência local no navegador usando `localStorage`.
- Esquema SQL e dados iniciais de exemplo para uma futura integração com banco relacional.

## Estrutura do projeto

```text
me-debata/
├── index.html
├── README.md
├── LICENSE
├── .gitignore
├── .nojekyll
├── assets/
│   ├── css/styles.css
│   └── js/app.js
├── data/
│   └── themes.json
├── database/
│   ├── schema.sql
│   └── seed.sql
├── docs/
│   └── DATABASE.md
└── .github/workflows/
    └── static.yml
```

## Dados e banco

A versão atual é um aplicativo estático: temas e placar ficam no armazenamento local (`localStorage`) do navegador. Isso permite jogar imediatamente, mas os dados não são sincronizados entre dispositivos e podem ser perdidos ao limpar os dados do navegador.

O arquivo `data/themes.json` contém os temas iniciais. O arquivo `database/schema.sql` define uma estrutura PostgreSQL preparada para persistir categorias de roleta, temas, jogadores e rodadas. Consulte `docs/DATABASE.md` para o caminho de integração.

> Não há credenciais, chaves ou serviços externos embutidos no projeto.

## Publicar no GitHub Pages

1. Crie um repositório e envie todos os arquivos desta pasta.
2. No GitHub, abra **Settings → Pages**.
3. Em **Build and deployment**, selecione **Deploy from a branch**.
4. Escolha a branch principal e a pasta `/ (root)`.
5. Salve. O workflow incluído também valida a presença dos arquivos estáticos.

## Personalizar

- Edite as listas na seção **Editar roletas** dentro do app; ou
- edite `data/themes.json` e use **Importar JSON** na aplicação.
- Ajuste cores, espaçamentos e tipografia em `assets/css/styles.css`.

## Licença

MIT — veja `LICENSE`.
