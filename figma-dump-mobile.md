# Figma Dump Mobile

- Referencia: `https://www.figma.com/design/MPlfwFH8UvahOJ2uaXMat0/Untitled?node-id=92-504`
- Node raiz: `92:504`
- Nome: `pagina vendas [livro] [bruno gomes] [mobile]`
- Data: 2026-04-28
- Uso: guia de traducao mobile para a landing atual da Outsider School, que nao tem prototipo mobile proprio.
- Regra critica: nao alterar regras desktop existentes. Aplicar somente dentro de `@media (max-width: 1080px)` e, quando necessario, refinar em `@media (max-width: 368px)`.

## Leitura Geral

O frame raiz do prototipo mobile tem `1080 x 18051`, mas o conteudo funcional aparece como uma pagina mobile centralizada:

- Viewport logico alvo: `360px`.
- Grid principal: `320px`.
- Margem lateral padrao: `20px` de cada lado em viewport de `360px`.
- No frame Figma, esse grid aparece como `x=380, w=320` dentro do canvas de `1080`.
- Alguns visuais de hero/ornamentos passam de `320px`; isso e intencional. Texto, CTA, cards e containers devem obedecer ao grid.

Na pagina atual, o bloco mobile existente ja usa algo muito proximo:

```css
--mobile-grid: min(calc(100vw - 28px), 368px);
--mobile-section-x: max(14px, calc((100vw - var(--mobile-grid)) / 2));
```

Para aproximar mais do prototipo mobile de referencia, preferir:

```css
--mobile-grid: min(calc(100vw - 40px), 320px);
--mobile-section-x: max(20px, calc((100vw - var(--mobile-grid)) / 2));
```

Se a pagina atual precisar manter cards um pouco mais largos, usar `min(calc(100vw - 28px), 368px)` apenas para componentes ja validados. Para hierarquia nova, usar `320px`.

## Tokens Mobile Recomendados

```css
@media (max-width: 1080px) {
  :root {
    --mobile-shell: 100%;
    --mobile-grid: min(calc(100vw - 40px), 320px);
    --mobile-section-x: max(20px, calc((100vw - var(--mobile-grid)) / 2));

    --mobile-header-h: 72px;
    --mobile-section-y-sm: 56px;
    --mobile-section-y: 72px;
    --mobile-section-y-lg: 88px;

    --mobile-gap-xs: 8px;
    --mobile-gap-sm: 12px;
    --mobile-gap-md: 16px;
    --mobile-gap-lg: 24px;
    --mobile-gap-xl: 32px;
    --mobile-gap-2xl: 48px;
    --mobile-gap-3xl: 64px;

    --mobile-card-r: 16px;
    --mobile-button-r: 12px;
    --mobile-card-bg: #1b1b1b;
    --mobile-page-bg: #0a0a0b;
    --mobile-paper-bg: #f7f7f7;
  }
}
```

## Tipografia

Fonte base do prototipo: `SF Pro Display`. A landing atual ja usa essa familia.

Padroes extraidos do node `92:504`:

| Papel | Tamanho | Linha | Peso | Tracking | Alinhamento | Uso |
|---|---:|---:|---|---:|---|---|
| Hero/H1 mobile | `30px` | `36px` | medio/semibold | `0` | center | Titulo principal de primeira dobra |
| Section title forte | `28-30px` | `32-36px` | medio/semibold | `0-1.5%` | center | Titulos de secoes e cards bonus |
| Texto de apoio destacado | `16px` | `20px` | medium | `1%` | center | Subheadline curta |
| Body mobile | `14px` | `18px` | regular/medium | `2-3%` | center/left | Paragrafos, descricoes |
| Linha de card/lista | `14px` | `18px` | medium | `1%` | left | Tabela/listas comparativas |
| Eyebrow/tag | `12-14px` | `16-18px` | medium/semibold | `3-6%` | center/left | Tags, labels, badges |
| Microcopy | `11-12px` | `15-16px` | regular | `2%` | left | Observacoes em cards |

Aplicacao na landing atual:

- `h1` mobile: reduzir para `30-36px`, linha entre `1.1` e `1.2`.
- `h2` mobile: usar `30px / 36px` como teto. Evitar titulos de `36px` em cards ou containers compactos.
- Paragrafos longos: `14px / 18px`.
- Cards com texto curto podem usar `16px / 20px`.
- Eyebrow atual pode continuar em `14px`, mas com altura de linha `18px` e tracking moderado.

## Header Mobile

No prototipo:

- Header fixo: `1080 x 72`.
- Altura logica: `72px`.
- Conteudo centralizado no grid `320px`.
- Texto promocional a esquerda: `12px / 16px`.
- Cupom/badge a direita: `~12.65px / 19px`, uppercase, tracking alto.
- Fundo escuro com transparencia e borda/gradiente sutil.

Traducao para a landing:

- Manter header com `height: 72px`.
- Usar `padding-inline: var(--mobile-section-x)`.
- Evitar logo/nav grandes; o header mobile deve ocupar pouco espaco visual.
- Se houver CTA ou menu, altura de toque minima `44px`.

## Hero Mobile

Padrao observado:

- Primeira dobra do prototipo vai ate `y=1422`, mas o conteudo de texto fica entre `y=780` e `y=1152`.
- Visual principal pode ser maior que o grid (`~379px` ou mais) e centralizado.
- H1: `x=361, w=359, h=144`, equivalente a largura total de viewport logico.
- Texto abaixo: `x=381, w=319`, container de `320px`.
- CTA: `x=379, w=322, h=74`, raio `12px`, padding vertical `28px`, gap interno `6px`.

Padrao recomendado:

```css
.slice-hero {
  min-height: auto;
  padding: calc(var(--mobile-header-h) + 24px) var(--mobile-section-x) 0;
}

.slice-hero__copy {
  width: var(--mobile-grid);
  margin-inline: auto;
  text-align: center;
}

.slice-hero h1 {
  font-size: 30px;
  line-height: 1.2;
}

.brand-cta {
  width: min(322px, 100%);
  min-height: 74px;
  border-radius: var(--mobile-button-r);
}
```

Para visuais da hero, usar `width: min(379px, calc(100vw + 20px))` quando precisar preservar presenca visual sem quebrar texto.

## Containers E Espacamentos

Padroes recorrentes extraidos:

- Conteudo textual central: `319-320px`.
- Secao introdutoria clara: titulo container `384px`, texto interno `320px`, gap vertical `16px`.
- Blocos de texto empilhados: gaps de `12px`, `16px` ou `24px`.
- Entre titulo/subtitulo e card principal: `48-72px`, dependendo da densidade visual.
- Entre cards repetidos de produto/modulo: `~50px` quando a altura do card e `~510px`.
- Entre grupos/secoes maiores: `72-88px`.

Regras praticas:

- Use `padding-block: 72px` como base.
- Use `56px` para secoes curtas.
- Use `88px` para troca grande de tema/fundo.
- Use `gap: 16px` em heading groups.
- Use `gap: 24px` para texto + CTA ou texto + lista.
- Use `margin-top: 48px` antes de cards visuais grandes.

## Cards

### Card Escuro De Conteudo/Produto

Padrao do prototipo:

- Largura: `320px`.
- Altura recorrente: `509.73px`.
- Raio: `16.99px`, arredondar para `17px` ou `16px`.
- Fundo: `#1b1b1b`.
- Posicao: sempre centralizado no grid.
- Repeticao vertical: cards em `y=2965`, `3559`, `4153`, depois outros grupos; gap visual medio `~84px` entre fim de um card e inicio do proximo.

Traducao:

```css
.mobile-card,
.program-cover,
.video-card {
  width: var(--mobile-grid);
  max-width: var(--mobile-grid);
  border-radius: 16px;
}
```

Para cards escuros com conteudo rico, preferir:

```css
padding: 32px 26px;
min-height: auto;
```

Nao deixar card mobile herdar largura desktop escalada. Se no desktop o card e absoluto/fixo, no mobile ele precisa voltar para fluxo normal.

### Card Bonus/Imagem

Padrao observado no fim do prototipo:

- Cards bonus: `320px` de largura.
- Alturas: `496.55px` e `545px`.
- Raio: `16.05px`.
- Conteudo textual interno: `266.67px` de largura, x interno `26.67px`.
- Padding horizontal efetivo: `26-27px`.
- Titulo: `28.8px / 32.9px`, centralizado.
- Descricao: `13.7px / 19.2px`, centralizada.
- Observacao com icone: `~11.7px / 15px`, alinhada a esquerda.

Traducao:

```css
.bonus-card {
  width: var(--mobile-grid);
  border-radius: 16px;
  padding: 32px 26px;
}

.bonus-card h3 {
  font-size: 29px;
  line-height: 33px;
  text-align: center;
}

.bonus-card p {
  font-size: 14px;
  line-height: 19px;
  text-align: center;
}
```

## Listas E Tabelas Comparativas

Padrao observado:

- Tabela/lista dentro da secao clara:
  - linhas horizontais de `304px`;
  - texto da coluna esquerda em `14px / 18px`;
  - icones/checks em `~13px`;
  - conteudo começa em `x=388`, largura `304px`.
- Container visual da comparacao usa `320px` de largura total.

Traducao:

- Listas mobile devem usar `width: var(--mobile-grid)`.
- Separadores internos: `width: calc(100% - 16px)` ou `304px`.
- Padding horizontal interno: `8px` se for tabela densa; `20-26px` se for card editorial.
- Linha minima: `52px` para itens curtos, `61-70px` para itens com quebra.

## CTAs

Padrao observado:

- CTA principal: `322 x 74`.
- Raio: `12px`.
- Padding: `28px 90px`.
- Texto uppercase `14px`, semibold.
- Gap icone/texto: `6px`.

Traducao:

```css
.brand-cta {
  width: min(322px, 100%);
  min-height: 74px;
  padding: 0 24px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 0.02em;
}
```

Em mobile, evitar CTA com `420px` ou alturas herdadas do desktop (`90px`) sem ajuste.

## Hierarquia De Secao

Modelo sugerido para traduzir a landing sem prototipo mobile:

```html
<section>
  <div class="section-heading">
    <p class="eyebrow">...</p>
    <h2>...</h2>
  </div>
  <div class="section-body">
    ...
  </div>
</section>
```

Regras:

- `.section-heading`: `width: var(--mobile-grid)`, `gap: 16px`, `text-align: center`.
- `.section-heading + .section-body`: `margin-top: 48px`.
- Se a secao tiver imagem/mockup grande: `margin-top: 56-64px`.
- Se a secao tiver apenas texto/lista: `margin-top: 32px`.
- Evitar cards dentro de cards.

## Fundações Visuais

Cores principais vistas no node:

- Fundo geral: `#0a0a0b`.
- Card escuro: `#1b1b1b`.
- Fundo claro: `#f7f7f7`.
- Verde CTA: gradiente de aproximadamente `#279a56` para `#45c579`.
- Dourado/linha: aproximadamente `#f2dcb1`.

Para a landing atual, manter a paleta ja existente:

```css
--black: #0a0a0b;
--paper: #f7f7f7;
--gold: #c6ab78;
--gold-soft: #f2dcb1;
```

Nao transformar a pagina em tema verde. O verde do prototipo e especifico da oferta BlackPass; aqui serve principalmente para dimensoes e hierarquia.

## Mapeamento Para A Landing Atual

Aplicar os padroes assim:

- `.figma-page`: no mobile, largura `100%`, sem escala desktop.
- `.slice`: no mobile, `width: 100%`, altura automatica e fluxo normal.
- `.section-heading`: largura `var(--mobile-grid)`, centralizada.
- `.product-cover`, `.program-cover`, `.metric-card`, `.video-card`, `.feature-card-row article`: limitar a `var(--mobile-grid)`.
- `h1`: `30-36px`, conforme primeira dobra.
- `h2`: preferir `30px / 36px`.
- Paragrafos em cards: `14px / 18px`.
- CTAs: `322 x 74` maximo, raio `12px`.
- Cards editoriais/produtos: `320px`, raio `16px`, padding interno `26-32px`.

## Checklist De Implementacao Mobile

- [ ] Todas as alteracoes ficam dentro de `@media (max-width: 1080px)` ou `@media (max-width: 368px)`.
- [ ] Desktop `1920px` continua pixel perfect e nao recebe novas regras fora do media query.
- [ ] Nenhum bloco mobile usa largura desktop fixa (`1920px`, `1200px`, `1366px`, `420px`) sem override.
- [ ] Texto principal cabe em `320px` sem overlap.
- [ ] Cards repetidos usam `width: var(--mobile-grid)`.
- [ ] CTAs usam `min-height: 74px`, nao `90px`.
- [ ] Secoes usam `padding-block` entre `56px` e `88px`.
- [ ] Headings usam no maximo `30-36px` no mobile.
- [ ] Nao escalar fonte com viewport width.
- [ ] Validar em `360x800`, `390x844` e `320x700`.

