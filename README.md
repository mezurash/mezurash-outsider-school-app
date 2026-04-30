# Outsider School Home

Landing page estatica da Outsider School, pronta para publicar em um repositorio publico ou hospedar como site estatico.

## Como importar o projeto

1. Crie um novo repositorio publico no GitHub.
2. Copie todos os arquivos deste projeto para o novo repositorio.
3. No novo repositorio, instale as dependencias:

```bash
npm install
```

4. Rode o projeto localmente:

```bash
npx http-server . -a 127.0.0.1 -p 4173 -c-1
```

5. Abra no navegador:

```text
http://127.0.0.1:4173
```

## Arquivos principais

- `index.html`: estrutura da landing page.
- `styles.css`: estilos, responsividade e ajustes mobile/desktop.
- `script.js`: interacoes, carrosseis e animacoes.
- `package.json`: scripts e dependencias de desenvolvimento.
- `package-lock.json`: versoes travadas das dependencias.
- `playwright.config.js`: configuracao dos testes visuais.

## Pastas principais

- `assets/`: imagens, logos, icones e fontes usadas pela pagina.
- `assets/images/`: imagens finais da landing page.
- `assets/logos/`: logos dos programas e marcas.
- `assets/icons/`: icones usados nos cards, botoes e secoes.
- `assets/fonts/`: fontes locais SF Pro Display.
- `imagens-exported/`: assets exportados e usados em algumas secoes.
- `tests/`: testes automatizados com Playwright e validacao de assets.
- `docs/`: documentacao auxiliar do processo.

## Arquivos de apoio

Estes arquivos ajudam a documentar o processo de construcao, mas nao sao obrigatorios para a pagina funcionar em producao:

- `CHECKPOINT_TIMELINE.md`
- `MOBILE_ACTION_PLAN.md`
- `context-claude.md`
- `figma-dump.md`
- `figma-dump-mobile.md`
- `figma-slices-full.md`
- `collect-figma-dump.mjs`
- `css-export.css`
- `imagens/`
- `fonts/`
- `os-home-fig-2.fig`

## Comandos uteis

Instalar dependencias:

```bash
npm install
```

Rodar servidor local:

```bash
npx http-server . -a 127.0.0.1 -p 4173 -c-1
```

Rodar testes:

```bash
npm test
```

Rodar apenas validacao de assets:

```bash
npm run test:assets
```

Rodar apenas testes visuais:

```bash
npm run test:visual
```

## Publicacao

Este projeto e estatico. Para publicar, basta hospedar os arquivos do repositorio em qualquer servico que sirva HTML/CSS/JS, como:

- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages
- servidor proprio com Nginx/Apache

O arquivo de entrada e:

```text
index.html
```

## Observacoes de entrega

- O projeto atual esta ajustado para desktop, tablet e mobile.
- Os assets sao locais, sem dependencia de CDN para a interface principal.
- Antes de entregar ou publicar, rode `npm test` para validar assets e smoke tests visuais.
- A branch `done` foi criada a partir da `dev` para concentrar a versao de entrega ao cliente.
