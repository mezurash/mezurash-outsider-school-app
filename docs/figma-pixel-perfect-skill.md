# Skill: Figma Pixel Perfect para Outsider School Home

Use esta skill quando precisar revisar ou implementar uma secao/componente do Figma nesta landing page com fidelidade visual alta.

## Principio

O projeto segue um modelo Elementor-like:

- Cada slice grande do Figma vira uma secao HTML.
- Frames com Auto Layout viram containers flex.
- `gap`, largura, altura, padding, alinhamento e ordem dos filhos devem vir do Figma.
- `position: absolute` fica reservado para overlays, imagens soltas, mockups, camadas decorativas e elementos que realmente estao sobrepostos no design.
- Nao achatar a estrutura do Figma quando a hierarquia do design explicar o layout.

## Fontes de verdade

Use nesta ordem:

1. Figma MCP para o node especifico quando houver URL ou node id.
2. Screenshot do node via Figma MCP.
3. `figma-slices-full.md` como dump local principal.
4. Assets locais em `imagens-exported/`.
5. CSS exportado em `css-export.css` apenas como apoio, nao como codigo final.

## Fluxo usado nos ajustes pixel perfect

1. Identificar o node ou slice exato.

Exemplo: o componente de depoimento textual era `5:1197`.

2. Buscar contexto no Figma MCP.

Coletar:

- dimensoes do frame;
- largura do container interno;
- gaps;
- fontes, pesos e line-height;
- cores com alpha;
- assets reais usados pelo node.

3. Capturar screenshot do mesmo node.

O screenshot serve para validar:

- quebra de linha;
- alinhamento horizontal;
- relacao entre label, texto e rating;
- presenca ou ausencia de setas, botoes e estados.

4. Comparar com a implementacao atual.

Procure no HTML/CSS por:

- `data-node`;
- texto visivel;
- classes do componente;
- classes globais herdadas que possam estar distorcendo o resultado;
- classes JS como `.js-drag-scroll` quando o bloco nao deve se comportar como carrossel.

5. Fazer ajuste pequeno e isolado.

Preferir:

- classe especifica para o bloco quando o estilo global nao bate com o Figma;
- preservar assets exportados;
- trocar texto desenhado manualmente por SVG quando o Figma usa asset;
- remover wrappers/efeitos que nao existem no design.

6. Validar.

Rodar:

```bash
node --check script.js
```

Rodar checagem de assets para garantir que todo `src`, `href` e `url(...)` existe localmente.

7. Commitar por rodada.

Cada bloco visual corrigido deve ter commit pequeno e legivel.

## Casos aplicados neste projeto

### Navbar

Foi refinado contra o Figma mantendo:

- fundo escuro translucido;
- blur;
- marca azul;
- espaçamento e altura fixos do header.

### Primeiras secoes

Hero, Outsider School, estatua e blocos de autoridade foram ajustados mantendo o canvas de `1920px` e a escala via `--page-scale`.

### Ring da estatua

O asset visual estava ancorado no `bottom`, mas o Figma posicionava no topo direito. A correcao foi reposicionar pelo `top/right` relativo ao container visual, sem alterar a estrutura da secao.

### Botao divisor

O botao "Conheca nossos programas" estava sendo coberto pela secao seguinte. A solucao foi ajustar stacking context:

- secao anterior com `overflow: visible`;
- z-index maior no botao;
- z-index controlado na secao seguinte.

### CTAs `SAIBA MAIS`

Os icones SVG nao apareciam de forma confiavel porque o CSS usava `mask` sem prefixo WebKit. A correcao foi adicionar `-webkit-mask` junto do `mask` e preservar o botao como estrutura `logo + CTA`.

### Cards Master/Chave

O HTML renderizava um SVG composto e outro avatar separado, duplicando icones. A correcao foi usar apenas o asset composto exportado do Figma.

### Secao Chave Benefits

O fundo estava branco, mas o Figma indicava fundo escuro. Foram corrigidos:

- background;
- tag dourada;
- headline com parte clara e parte opaca;
- icones maiores com glow vindo do SVG;
- texto com peso dividido entre palavra principal e complemento;
- barra de progresso nas cores corretas.

### Depoimentos visuais

O CSS estava forçando todos os prints para altura unica. O Figma usa imagens com dimensoes diferentes. A correcao foi aplicar dimensoes individuais por item no carrossel `proof-carousel--deps`.

### Video final

O bloco final nao deveria usar imagem aleatoria. Foi recriado como placeholder de video com play central, fundo escuro e overlays visuais.

### Componente `5:1197`

Revisao feita via Figma MCP:

- frame principal: `1201px` de largura;
- miolo: `727px`;
- texto: largura `657px`, `36px`, line-height `46px`;
- label: `21.439px`, cor `rgba(247, 247, 247, 0.2)`;
- gap principal: `42px`;
- gap interno entre texto e rating: `39px`;
- rating: asset `asset-5-stars.svg`.

Decisao de implementacao:

- remover as setas por requisito do cliente;
- manter o comentario textual estatico, sem `.js-drag-scroll`;
- criar `.testimonial-quote` em vez de reaproveitar `.quote`, porque `.quote` era generico e nao batia com o node;
- usar SVG de rating em vez de texto `★★★★★ 5.0`;
- separar o trecho forte do texto com `<strong>` para reproduzir peso e cor do Figma.

## Checklist antes de concluir uma secao

- O node/slice correto foi conferido no Figma MCP?
- Existe screenshot ou dump local da referencia?
- As dimensoes principais batem com o Figma?
- Font family, font size, weight e line-height foram conferidos?
- Cores com alpha foram copiadas corretamente?
- Assets reais foram usados, sem placeholder indevido?
- O bloco herdou alguma classe global que distorce o resultado?
- O comportamento JS existe no Figma ou foi adicionado por engano?
- `node --check script.js` passou?
- Assets locais foram validados?
- O ajuste foi commitado isoladamente?

## Anti-padroes

- Usar `absolute` para tudo.
- Forcar todos os itens de um carrossel para a mesma dimensao quando o Figma usa tamanhos diferentes.
- Recriar asset SVG com texto ou CSS quando o export ja existe.
- Deixar componente textual dentro de classe global de quote quando o node tem especificacao propria.
- Adicionar efeito de carrossel em texto estatico.
- Corrigir uma secao mexendo em estilos globais sem checar impacto nas outras.
