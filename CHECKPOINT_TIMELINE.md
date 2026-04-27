# Checkpoint Timeline - Outsider School Home

Data: 2026-04-26
Projeto: `/Users/merencianno/ai-projects/outsider-school-home`

## Contexto

O projeto estava inconsistente porque uma implementação anterior traduziu muito do Figma como layout absoluto e detectou apenas `s1..s7`. Isso estava errado: o frame raiz `5:890` contém mais blocos visuais, alguns nomeados como grupos ou elementos soltos, não apenas frames `sN`.

A documentação usada como contrato foi:

- `.claude/skills/figma-pixel/SKILL.md`
- Skill Figma oficial `figma-implement-design`

Regra principal assumida:

- Figma autolayout = container HTML flex.
- Manter profundidade de containers quando o design context indicar flex/gap/padding.
- `position: absolute` só para camadas visuais, overlays, mockups e sobreposições reais.
- Canvas base do Figma = `1920px`, escalado no browser via CSS/JS.
- Não remendar o HTML/CSS antigo. Recriar estrutura principal do zero.

## Linha Do Tempo

### 1. Dump inicial do Figma

Foi criado o script:

- `collect-figma-dump.mjs`

Ele conversa com o Figma Dev Mode MCP local:

- endpoint: `http://127.0.0.1:3845/mcp`
- root node: `5:890`

Primeiro output:

- `figma-dump.md`

Problema identificado: esse dump detectava apenas frames nomeados `s1..s7`, o que era incompleto.

### 2. Leitura da documentacao local

Foi lida a skill local:

- `.claude/skills/figma-pixel/SKILL.md`

Decisões importantes extraídas:

- usar modelo Elementor/Flexbox;
- não achatar árvore de containers;
- passar por um filter step conceitual antes de codar;
- não usar absolute como padrão;
- usar alturas literais de slices do Figma;
- vanilla HTML/CSS, sem Tailwind/React.

Também foi verificado:

- `context-claude.md` existe, mas está vazio;
- não havia resumo/hash útil de conversa anterior recuperável na pasta `.claude`.

### 3. Correção do mapa de slices

Foi constatado pelo XML raiz que os blocos reais incluem:

- `header` / `5:1407`
- `slice01-hero` / `5:891`
- `slice02-about` / `5:1416`
- `slice03-estrutura` / `5:1274`
- `slice03-divider` / `5:1294`
- `slice04-codigo-cover` / `5:1284`
- `slice05-codigo-visual` / `5:1444`
- `slice06-codigo-cards` / `5:1491`
- `slice07-master-cover` / `5:1522`
- `slice07-master-cta` / `5:905`
- `slice08-chave-cover` / `5:986`
- `slice09-chave-benefits-head` / `5:1010`
- `slice09-chave-icons` / `5:1021`
- `slice09-chave-progress` / `5:1018`
- `slice10-chave-team-head` / `5:1006`
- `slice10-chave-team-visual` / `5:934`
- `slice11-time-head` / `5:910`
- `slice11-time-cards-a` / `5:913`
- `slice11-time-cards-b` / `5:924`
- `slice11-time-cta` / `5:931`
- `slice12-premiacao` / `33:1101`
- `slice13-chave-deps` / `25:955`
- `slice14-alunos` / `25:947`
- `slice15-deps` / `30:473`
- `slice16-video-final` / `25:874`
- `footer-logo` / `5:1271`
- `footer-tagline` / `5:1272`

Foi criado o dump complementar correto:

- `figma-slices-full.md`

Tamanho aproximado:

- `313784` bytes

Esse arquivo é a referência local mais importante para próximas iterações.

### 4. Recriação dos arquivos principais

Arquivos recriados do zero:

- `index.html`
- `styles.css`
- `script.js`

Arquivos auxiliares criados/modificados:

- `collect-figma-dump.mjs`
- `figma-dump.md`
- `figma-slices-full.md`
- `CHECKPOINT_TIMELINE.md`

Decisão: tratar o HTML/CSS anterior como descartável, mantendo apenas os assets existentes em `imagens-exported/`.

### 5. Estrutura nova implementada

Nova estrutura:

- `.page-viewport`
- `.figma-page`
- slices em ordem visual do Figma
- `site-header`
- hero
- about
- estrutura
- covers de programas
- blocos de Código
- Master
- Chave
- Time Outsider
- proof/depoimentos/alunos
- video final
- footer

CSS:

- canvas fixo `1920px`;
- altura total aproximada `18614px`;
- escala responsiva via `--page-scale`;
- fontes SF Pro carregadas de `fonts/`;
- sections com altura literal inspirada no Figma;
- flex para estrutura sequencial;
- absolute para mockups, carrosséis e overlays.

JS:

- calcula escala responsiva;
- ajusta altura do viewport conforme escala;
- mantém drag/auto-scroll em carrosséis `.js-drag-scroll`.

### 6. Validação feita

Validado:

- `node --check script.js` passou.

Servidor local iniciado:

- `http://localhost:5501`

Comando usado:

```bash
python3 -m http.server 5501
```

Observação: a sandbox exigiu permissão para bind de porta. O servidor ficou rodando em sessão de terminal.

## Pendências Conhecidas

- Fazer validação visual manual no navegador.
- Conferir visualmente assets trocados, principalmente nomes com acentos, espaços e arquivos exportados do Figma.
- Ajustar fidelidade fina de espaçamentos, alturas e sombras usando `figma-slices-full.md`.
- Possível correção de alguns conteúdos dos cards de alunos, porque alguns dados em Figma aparecem duplicados/inconsistentes.
- Se precisar de pixel-perfect de verdade, o próximo passo é iterar slice por slice, comparando visualmente contra Figma/screenshot e consultando só a seção correspondente em `figma-slices-full.md`.

## Atualizacao - 2026-04-26

Continuidade feita nesta retomada:

- Corrigido o header para voltar ao fundo escuro/translucido do Figma (`rgba(0, 8, 24, 0.82)`) com blur de `26px` e marca azul.
- Corrigido o CTA padrao para seguir a estrutura do Figma como `logo + botao`, em vez de colocar logo e texto dentro do mesmo botao.
- Corrigido o asset quebrado `Group 1171275970.svg`: no Figma/export CSS ele era apenas dois circulos sobrepostos, entao foi reconstruido em CSS como `.feature-icon-validate`.
- Ajustadas as alturas das secoes principais para que a soma dos blocos bata exatamente com a altura do canvas Figma: `18614px`.
- Validado que todos os assets locais referenciados por HTML/CSS existem.
- Validado `node --check script.js`.
- Servidor local iniciado em `http://localhost:5501`.

Observacao: tentativa de usar Playwright via `npx playwright --version` falhou porque o pacote nao estava instalado e a rede para `registry.npmjs.org` nao esta disponivel no sandbox.

## Proximo Passo Recomendado

1. Abrir `http://localhost:5501`.
2. Anotar os primeiros problemas visuais por ordem de cima para baixo.
3. Corrigir em blocos pequenos, sempre consultando:
   - `figma-slices-full.md`
   - `.claude/skills/figma-pixel/SKILL.md`

Não voltar ao modelo antigo de remendar absolute positioning global.

## Atualizacao - 2026-04-27

Rodada de refinamento pixel perfect feita depois do primeiro commit:

- Criado historico Git do projeto e commits incrementais para cada rodada de ajuste visual.
- Refinadas as primeiras secoes: navbar, hero/Outsider School, estatua, bloco "OutsiderSchool e a escola...", "Bruno ja deu aula..." e estrutura.
- Corrigido navbar para bater com o Figma.
- Revisado o slice 11 usando logica Elementor-like: containers flex preservando hierarquia, `gap`, largura e alinhamento do Figma em vez de posicionamento absoluto global.
- Corrigido o ring/asset da secao da estatua para ficar no topo direito conforme Figma.
- Corrigido z-index do botao divisor "Conheca nossos programas" para ele ficar acima da secao seguinte.
- Corrigidos CTAs `SAIBA MAIS` adicionando suporte a `-webkit-mask` nos SVGs, para os icones aparecerem corretamente no browser.
- Corrigidos os cards de prova/micro-proof do Master e da Chave removendo avatar duplicado; o asset composto do Figma passou a ser usado como unidade.
- Corrigida a secao "Programa de aceleracao / Aqui, voce vai alem da operacao" com fundo escuro, tipografia, pesos, cores, icones e barra de progresso alinhados ao dump do Figma.
- Corrigido o carrossel de depoimentos visuais para respeitar as dimensoes reais dos exports (`dep1..dep5`, `image 512`, `image 508`) em vez de forcar todos para a mesma altura.

## Atualizacao - 2026-04-27 19:37 BRT

Rodada de ajustes finos na home:

- Corrigida a secao "Aqui, voce aprende o que realmente constroi um negocio de verdade": o botao `Modo Outsider` deixou de usar posicionamento absoluto solto e passou a participar do flex do cabecalho, evitando quebra no desktop. No mobile, a margem extra foi zerada.
- Corrigida a imagem da secao de premiacao/prova do Master. A imagem nova exportada em `imagens-exported/bg-v2-section.png` foi copiada para `assets/images/proof/master-background.png` e o HTML passou a apontar para ela.
- Removida a dependencia da imagem antiga `master-background.jpg` nessa secao, que tinha uma faixa branca/gradiente indesejada na base.
- Mantido apenas `overflow: hidden` e fundo preto em `.proof__background`, sem overlay preto extra, porque a imagem nova ja vem com a base correta.
- Corrigido o texto duplicado do headline: `+100 milhões milhões faturados` virou `+100 milhões faturados`.
- Reduzido o espaco entre os cards `+R$65 Milhões` / `+R$26 Milhões` e a area de depoimentos visuais: `.proof-carousel--master` subiu de `1573.103px` para `1374px`.
- Ajustado o bloco textual do testimonial `Master Outsider by OutsiderSchool©` para acompanhar a nova compactacao: `.proof-testimonial--master` subiu para `1966.884px`.
- Reduzida a altura da secao `.proof--master` de `2475px` para `2276px`, evitando sobra grande antes da proxima secao.

Validacao:

- `npm test` passou antes dos ultimos ajustes de espaco e troca definitiva da imagem.
- A pedido do usuario, nao foi rodado Playwright depois dos ultimos ajustes.

## Checkpoint - 2026-04-27

Rodada de organizacao para preparar a `dev` antes da futura branch `deliverables`:

- Mantida a decisao de nao criar `deliverables` ainda; todo o trabalho continua na `dev`.
- Reorganizados os assets usados pela landing em `assets/`, com nomes limpos e categorias:
  - `assets/fonts`
  - `assets/icons`
  - `assets/logos`
  - `assets/images/hero`
  - `assets/images/codigo`
  - `assets/images/master`
  - `assets/images/chave`
  - `assets/images/proof`
  - `assets/images/students`
  - `assets/images/testimonials`
- Atualizadas todas as referencias de `index.html` e `styles.css` para os novos caminhos.
- Mantidos arquivos internos/processo fora da limpeza final por enquanto, conforme decisao de trabalhar primeiro na `dev`.
- Implementado mobile real sem quebrar o desktop pixel perfect:
  - desktop continua com canvas Figma `1920px` e escala via `--page-scale`;
  - mobile desliga a escala fixa via `script.js`;
  - grid mobile central com shell de `431px`;
  - coluna interna de `368px`;
  - breakpoint adicional em `368px`;
  - imagens/carrosseis no mobile preservam proporcao em vez de forcar crop;
  - bloco placeholder `master-mockup` permanece oculto no mobile;
  - setas/quote mobile ajustados para nao cortar texto.
- JSON `imagens/a-chave.json` foi usado como referencia de convencao mobile:
  - containers `431px`/`368px`;
  - padding lateral recorrente de `30px`;
  - titulos mobile/tablet em torno de `26px` a `32px`;
  - textos auxiliares em torno de `16px` a `20px`.
- Adicionado setup de testes:
  - `package.json`
  - `package-lock.json`
  - `playwright.config.js`
  - `tests/check-assets.mjs`
  - `tests/landing.spec.js`
- `.gitignore` atualizado para ignorar `test-results/` e `playwright-report/`.

Validacao feita:

- `npm run test:assets` passou com `100` referencias locais verificadas.
- `npm test` passou com `5 passed`, `1 skipped`.
- Screenshots manuais gerados e revisados em `431px` e `368px`.

Observacao:

- O mobile agora esta estruturalmente pronto e sem overflow horizontal, mas ainda pode receber refinamento visual fino caso novas imagens especificas sejam exportadas do Figma.
- Corrigido o bloco final de video para voltar a ser placeholder de video, nao imagem aleatoria.
- Revisado o componente Figma `5:1197` via MCP e convertido para um bloco textual estatico, sem setas e sem efeito de carrossel:
  - label `Oferecido by OutsiderSchool©`;
  - texto em duas linhas com pesos/cores diferentes;
  - avaliacao usando `asset-5-stars.svg`;
  - classe propria `.testimonial-quote`, sem herdar `.quote` generico.

Commits relevantes desta rodada:

- `6f480bf` - Refine first landing sections
- `a27838c` - Refine navbar fidelity
- `c7c6c4f` - Refine slice 11 time section
- `26f3d43` - Use flex containers for slice 11
- `3b5ac82` - Polish top section feedback
- `7fafb5d` - Fix program cards and chave benefits
- `b392531` - Fix testimonials and final video placeholder
- `c831655` - Refine testimonial quote component

Validacoes executadas durante as rodadas:

- `node --check script.js`
- checagem local de referencias `src`, `href` e `url(...)` em `index.html`, `styles.css` e `script.js`
- `git status --short` ao final de cada rodada
- consulta direta ao Figma MCP para o node `5:1197`

Estado atual:

- Working tree limpo antes deste checkpoint.
- A pagina continua sendo HTML/CSS/JS estatico, com canvas base de `1920px` escalado por `script.js`.
- O comportamento de carrossel continua apenas nos elementos com `.js-drag-scroll`; o depoimento textual `5:1197` ficou estatico por requisito.

Proximos pontos provaveis de revisao:

1. Validacao visual manual no navegador apos os ultimos commits.
2. Continuar revisao secao por secao de baixo para cima ou no ponto indicado pelo cliente.
3. Para qualquer bloco novo, repetir o processo: MCP/screenshot, leitura do dump local, implementacao pequena, validacao e commit.

## Atualizacao - 2026-04-27 - Checkpoint Cards Proof Master

Retomada feita a partir da referencia local, sem chamar o MCP do Figma, conforme solicitado.

Referencia usada:

- Figma URL informada pelo usuario: `https://www.figma.com/design/MPlfwFH8UvahOJ2uaXMat0/Untitled?node-id=58-1475&t=07XmzHwthFur0wqO-4`
- Referencia local efetiva: `figma-slices-full.md`, especialmente o trecho em torno da linha `491` e o slice `slice12-premiacao` / `33:1101`.

Problema observado:

- A secao de cards de premiacao/proof do Master nao estava pixel perfect.
- O card Master estava usando o PNG composto `icone-master-bruno.png` em escala/crop diferente do dump local.
- O card Chave vinha de uma composicao manual simbolo + avatar, mas o dump local ja tinha um SVG composto fiel ao slice.

Correcoes aplicadas:

- `index.html`
  - Card Master passou a usar `imagens-exported/Frame%201171275423.svg`.
  - Card Chave passou a usar `imagens-exported/icone-master-bruno.svg`.
  - Removida a montagem manual do icone da Chave no HTML.
- `styles.css`
  - Cards mantidos em `584px x 320px`.
  - Linha dos cards mantida em `1200px` com `gap: 32px`, `left: 360px`, `top: 934px`.
  - Icones ajustados para dimensoes do export local:
    - Master: wrapper `113.309px`, imagem `115px x 67px`.
    - Chave: wrapper `106.354px`, imagem `108px x 67px`.
  - Textos dos subtitulos ajustados para larguras do dump:
    - Master: `306px`.
    - Chave: `278px`.
  - Removido CSS morto da composicao manual antiga (`stats-icon__mark`, `stats-icon__avatar`).

Validacoes feitas:

- `node --check script.js` passou.
- Confirmado que os assets locais referenciados existem:
  - `imagens-exported/Frame 1171275423.svg`
  - `imagens-exported/icone-master-bruno.svg`

Limitacoes da validacao:

- Nao foi feita captura visual/headless porque o ambiente nao possui `chromium`, `google-chrome` ou `playwright` instalado.
- Nao foi chamado MCP do Figma nesta rodada; a correcao foi baseada exclusivamente no `.md` local.

Estado do working tree neste checkpoint:

- Arquivos modificados:
  - `index.html`
  - `styles.css`
- Arquivos novos ainda nao versionados que ja apareciam no estado atual:
  - `imagens-exported/award-03.svg`
  - `imagens-exported/proof-outsider-mark.svg`

Proximo passo recomendado:

1. Abrir o HTML local no browser.
2. Comparar visualmente a secao de cards contra o Figma.
3. Se ainda houver desvio, consultar o MCP do Figma apenas depois de esgotar a referencia local do `figma-slices-full.md`.

## Atualizacao - 2026-04-27 - Program Sections Layout

Commit criado:

- `f07050c` - `fix: adjust program sections layout`

Resumo:

- Foi usado o dump local (`figma-dump.md`) como referencia principal, sem chamar MCP do Figma.
- O carrossel da secao "A Chave" foi ajustado para respeitar dimensoes individuais do dump.
- Ratings dos depoimentos foram padronizados com `imagens-exported/asset-5-stars.svg` e classe `testimonial-rating`.
- Novo asset adicionado e versionado: `imagens-exported/outsider-school-logo-dourado.svg`.
- Cards `Master Outsider` e `A Chave` passaram a usar o logo dourado como `program-cover__mark`.
- Card `O Codigo` permaneceu com o asset original `imagens-exported/s1-icon-logo.svg`.
- Removido `.codigo-visual::after`, que criava uma linha horizontal de `2px`.
- Adicionado `margin-top: -1px` em `.product-cover--chave` para cobrir o encontro visual entre secoes.
- `.codigo-cards` recebeu `padding-top: 120px` e `padding-bottom: 120px`, com altura ajustada para `878px`.
- `.chave-benefits` recebeu `padding-bottom: 120px`, com altura ajustada para `790px`.
- Footer real manteve `height: 319px`; problema de footer gigante vinha da altura fixa do canvas.
- `.figma-page` passou de `height: 18614px` para `height: auto`.
- `script.js` agora calcula altura pelo `page.scrollHeight * scale`, com recalculo em `resize`, `load` e `ResizeObserver`.

Validacoes:

- `git diff --check -- index.html styles.css script.js imagens-exported/outsider-school-logo-dourado.svg` sem saida.
- `git status --short` limpo apos o commit.

Nota:

- `git add` e `git commit` precisaram de permissao elevada porque o sandbox bloqueou escrita no indice Git.
