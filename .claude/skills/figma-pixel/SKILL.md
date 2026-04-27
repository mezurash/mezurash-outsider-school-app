---
name: figma-pixel
description: Implementar uma seção do Figma em HTML/CSS pixel perfect via Dev Mode MCP. Use quando o usuário colar um link do Figma e pedir "implementa", "pixel perfect", "essa seção", "esse logo", ou similar. Reduz idas e voltas no handoff e evita estourar context window com nodes grandes.
---

# figma-pixel — playbook v2 (Elementor flex model + filter step)

Skill para implementar seções do Figma em HTML/CSS no projeto `outsider-school-home`. Documenta o que funcionou na prática, o que estoura tokens, e o handoff mínimo necessário do usuário.

## Modelo mental — Elementor / autolayout 1:1 (regra mestra)

**Princípio único e inegociável:** cada **frame autolayout do Figma = um container `<div>` flex no HTML**, com mesma estrutura, mesma profundidade, mesmos paddings e gaps.

- Aninhamento mantido: pai > filho > neto > bisneto. Não achatar.
- `display: flex` + `gap` + `justify-content` + `align-items` é a tradução direta de autolayout.
- Padding do autolayout → `padding` do flex container.
- Gap do autolayout → `gap` do flex container.
- Direção horizontal/vertical → `flex-direction: row/column`.
- Imagens de fundo + overlays vão como **camadas absolute dentro de um container relative pai** (estilo Elementor section background) — ver heurística de backgrounds abaixo.
- `position: absolute` é **exceção** — só pra sobreposição genuína (badge sobre card, info-panel sobre foto, mockup sobre imagem). Nunca pra posicionar elemento sequencial.

Se o `design_context` do Figma vier com classes Tailwind tipo `content-stretch flex flex-col gap-[24px] items-start`, isso É o autolayout — traduzir 1:1 pra CSS flex. Não converter pra absolute.

### Valores são literais — nunca relativos, nunca centralização preguiçosa

**Todos paddings, margins, gaps vêm em pixels exatos do Figma.** Não usar percentuais, não usar `auto`, não usar centralização como atalho pra "posicionar".

- ✅ `padding-top: 294px` (h1 a 294px do topo do container)
- ❌ `justify-content: center` ou `align-items: center` no eixo principal pra "deixar no meio" — isso põe o elemento em "algum lugar no meio", não em 294px exatos.
- ✅ `align-items: center` no **cross-axis** (ex: column flex centralizando filhos horizontalmente) — OK **só** quando o Figma de fato centraliza horizontalmente.
- ✅ `gap: 24px` literal (espaço entre dois irmãos sequenciais)
- ❌ `margin: auto` pra empurrar elemento — o Figma sabe a distância exata, usar.

**Regra de bolso:** pra cada elemento posicionado, perguntar "qual o valor exato em px que o Figma deu pra essa distância?" e usar literal. Se a resposta for "não sei, é meio", o autolayout do Figma tem um valor — ele só não foi lido com cuidado.

**Eixo principal vs cross-axis (column flex):**
- Eixo principal (vertical) → `padding-top` + `gap` literais. **Nunca** `justify-content: center`.
- Cross-axis (horizontal) → `align-items: center/flex-start/flex-end` conforme alinhamento do Figma.
- Em row flex é o inverso: principal=horizontal, cross=vertical.

## Pré-requisitos (1× por sessão)

1. Figma Desktop aberto, arquivo do projeto carregado
2. Plugin `figma@claude-plugins-official` instalado (já feito)
3. Dev Mode MCP habilitado (Preferences → "Enable Dev Mode MCP server")
4. Ferramentas `mcp__figma-devmode__*` disponíveis na sessão Claude Code

Se faltar qualquer item, ler `~/.claude/projects/-Users-merencianno-ai-projects-outsider-school-home/memory/reference_figma_playbook.md`.

## Handoff que o usuário precisa fornecer

**O ideal:** link com node-id específico (não o frame raiz).

```
https://www.figma.com/design/<file>/...?node-id=25-874
                                                ^^^^^^
                                          subnode, não 1-2062
```

Como o usuário extrai o link certo no Figma:
- Selecionar **UM** frame/node (não múltiplos)
- Botão direito → "Copy link to selection"

Se o usuário mandar o frame raiz (ex: `1-2062`) → o `get_design_context` retorna 170k+ chars e é salvo num arquivo. Aí precisa fazer `jq` no arquivo pra achar o subnode certo, gastando tokens à toa.

Se o usuário tem múltiplos selecionados, as tools retornam erro `"Multiple nodes selected. Only selecting a single node is supported."` — aí pedir pra ele selecionar/agrupar em um único node OU mandar o link com node-id específico.

**Bonus que ajuda:**
- Imagens/SVGs já exportados em `imagens-exported/` (do contrário implementar com placeholder e pedir pra exportar depois)
- Indicação se é seção nova ou refactor de algo já existente em `index.html`

## Sequência de tools (ordem importa)

Para um node já identificado (ex: `25:874`):

```
get_screenshot(nodeId="25:874")       # ~1-2k tokens — referência visual
get_design_context(nodeId="25:874",   # ~3-8k tokens em subnode bem escolhido
                   forceCode=true)    #   170k+ se for frame gigante (estourará)
get_variable_defs(nodeId="25:874")    # ~200 tokens (no projeto atual vem vazio)
```

Pode rodar as 3 em paralelo no mesmo turno (são independentes).

`get_metadata` só vale a pena quando precisa caçar um subnode pelo nome dentro de um frame grande — ele retorna XML do tree (id, name, x, y, w, h). Tipicamente também estoura, vai pra arquivo, e aí usa `jq -r '.[].text' <arquivo> | grep -iE "padrão"` pra encontrar o id do node certo. **Foi assim que achei o `1:2440 — s1-logo-mqv-footer` quando o usuário só me deu o frame raiz.**

⚠️ **Não chamar `get_design_context` no frame raiz da página.** É garantido estourar e queimar tokens.

## O que `get_design_context` retorna

Código React + Tailwind com **valores literais em px** — é a fonte de verdade pra translation.

Exemplo do que vem:

```jsx
<div className="-translate-x-1/2 absolute bg-white h-[1216px] left-1/2 top-[17079px] w-[1920px]" />
<div className="content-stretch flex flex-col gap-[24px] items-start
                left-[calc(29.17%+95.5px)] top-[17198px]" />
<p className="font-['SF_Pro_Display:Semibold',sans-serif] leading-[0]
              text-[#0a0a0b] text-[52px] w-[591px]">...</p>
<div className="rounded-[24px]
                shadow-[7.029px_15.815px_38.658px_0px_rgba(0,0,0,0.1),
                        27.236px_64.137px_70.287px_0px_rgba(0,0,0,0.09),...]" />
```

## Filter step — normalizar saída do Figma antes de codar

Entre `get_design_context` (output cru) e o HTML/CSS final, **sempre passar por uma etapa de normalização**. O Figma exporta com ruído (mask groups decorativos, wrappers `bg-clip-text`, containers `contents` sem efeito, drop-shadows com alpha 0). Você precisa filtrar e produzir uma árvore conceitual Elementor-style limpa.

**Procedimento:**

1. **Identificar autolayout frames** no design_context — toda classe Tailwind com `flex`, `gap-[N]`, `items-X` é um autolayout. Cada uma vira `<div>` flex no HTML.
2. **Manter profundidade** sem mesclar. Se Figma tem 4 níveis aninhados, HTML tem 4 níveis. Não otimizar precoce.
3. **Filtrar ruído estrutural:**
   - `bg-clip-text` em texto com gradient → manter como `<span>` com classe específica
   - Mask groups com fade decorativo → camada absolute se a fade for visível, descartar se não
   - Containers `contents` (grupos sem efeito visual) → eliminar e promover children
   - Drop-shadows com `rgba(0,0,0,0)` (alpha 0) → descartar
4. **Classificar backgrounds** (ver heurística abaixo).
5. **Produzir árvore conceitual** antes de codar:
   ```
   section.slice-NN  [autolayout column, padding X, gap Y, items Z]
   └── container__header  [autolayout column, gap A]
       ├── container__kicker-row  [autolayout row, gap B]
       │   ├── icon
       │   └── text
       └── h2.title  [width fixed]
   └── container__body  [autolayout row, justify-between]
       ├── ...
   ```
6. Só **depois** desse esquema, escrever HTML/CSS.

Esse passo é o que evita repetir o erro de traduzir autolayout pra `position: absolute`.

## Conversão Tailwind → CSS (convenções deste projeto)

O canvas é **1920×N**, scaled via `transform: scale(100vw/1920)`. Sections são `width: 1920px; position: relative` e o conteúdo é **flex** (autolayout do Figma).

**Layout — flex default (autolayout 1:1):**

| Tailwind no design_context | CSS equivalente |
|---|---|
| `content-stretch flex flex-col gap-[N] items-X` | `display: flex; flex-direction: column; gap: Npx; align-items: X` |
| `flex gap-[N] items-X justify-between` | `display: flex; gap: Npx; align-items: X; justify-content: space-between` |
| `flex gap-[N] items-X justify-center` | `display: flex; gap: Npx; align-items: X; justify-content: center` |
| `p-[Npx]` ou `pt-[A] pr-[B] pb-[C] pl-[D]` | `padding: Npx` ou `padding: A B C D` (literal em px) |
| `w-[Npx] h-[Npx]` | `width: Npx; height: Npx` (mantém pra pixel-perfect) |
| `top-[abs_y]` no Figma | ❌ **NÃO traduzir literalmente.** Substituir por `padding-top` no pai ou `margin-top` no elemento sequencial |
| `left-[calc(50%+X)] -translate-x-1/2` (centrado) | `align-items: center` no pai (não calcular left) |
| Sobreposição real (badge, info-panel sobre foto) | `position: absolute; inset:` no elemento + `position: relative` no container pai |

**Tipografia:**
- `font-['SF_Pro_Display:Semibold']` → `font-weight: 600`. (Medium=500, Regular=400, Bold=700)
- `text-[52px] leading-[56px]` → `font-size: 52px; line-height: 56px`.
- `tracking-[0.4288px]` → `letter-spacing: 0.4288px` (mantém literal, não converte pra em).
- `text-[rgba(10,10,11,0.56)]` → `color: rgba(10,10,11,0.56)`.
- Texto inline com cores/pesos diferentes → split em `<span class="bloco--strong">...</span><span class="bloco--soft">...</span>` dentro do mesmo h2/p.

**Box-shadow (stack do Figma):**
Tailwind `shadow-[a_b_c_d_color, ...]` (ordem topo→base) → CSS `box-shadow` com a mesma ordem mas **invertida** (a sombra mais próxima primeiro). Camadas com `rgba(0,0,0,0)` (alpha 0) podem ser dropadas — não renderizam nada.

**Border-radius:**
- `rounded-[24px]` → `border-radius: 24px`.
- Cantos diferentes (`rounded-tl-[16] rounded-bl-[17]` etc.) → shorthand `border-radius: tl tr br bl` em px literais.

## Backgrounds — heurística (modelo Elementor)

Para **cada container** que tem background no Figma (incluindo filhos e netos, recursivamente):

| Caso | Implementação CSS |
|---|---|
| Cor sólida igual ao body parent | omitir — herda do pai |
| Cor sólida diferente | `background-color: #X;` no container |
| Gradient (linear/radial simples) | `background: linear-gradient(...);` ou `radial-gradient(...);` no container |
| PNG/JPEG com fundo próprio (foto, ilustração) | container `position: relative`; **child 1** `<img>` com `position: absolute; inset: 0; object-fit: cover; z-index: 0`; **child 2+** = conteúdo com `position: relative; z-index: 1` |
| PNG transparente sobre cor (textura, padrão) | container com `background-color` + `background-image` empilhados; OU camada absolute separada se houver opacity/blend custom |
| Background + overlay (Elementor section pattern) | container relative; **child 1** imagem absolute inset 0; **child 2** overlay absolute inset 0 com gradient/cor; **child 3+** conteúdo relative z-index 1 |

**Regra:** se um container filho tem bg próprio, aplica a mesma heurística nele. Backgrounds são camadas, não acoplados ao container de conteúdo.

**Antipattern:** colocar `background-image` direto no container que já tem conteúdo se houver overlay no design — separar as camadas (image + overlay + conteúdo) garante controle de z-index e blend modes.

## Regra de tamanho de slice

- Cada slice tem **`width` e `height` declarados no Figma** — aplicar literais: `width: 1920px; height: <H>px;`.
- Conteúdo interno **NUNCA ultrapassa** essa altura. Se a soma de paddings + gaps + filhos exceder, é problema de design — perguntar ao usuário antes de improvisar.
- `box-sizing: border-box` sempre, pra padding contar dentro do height.
- Mesma regra recursiva pra containers filhos com altura definida no Figma.

## Imagens / SVGs

`get_design_context` referencia imagens como `imgX from "figma:asset/..."` ou `from "./svg-..."` — esses paths **não são acessíveis** ao Claude Code. Imagens precisam ser exportadas manualmente:

1. Implementar HTML/CSS já cabeado pro caminho final em `./imagens-exported/<nome>.svg`
2. Pedir pro usuário: "selecionar node `X:Y` no Figma, exportar como SVG, salvar em `imagens-exported/<nome>.svg`"
3. Se nome do arquivo tem espaços/colchetes, **percent-encode** no `src`: `MQV [logo].svg` → `MQV%20%5Blogo%5D.svg`

Pra placeholders (quando o user explicitamente pede ou export ainda não chegou): seguir o padrão existente do projeto (`<span class="...mockup-tag">[FALTA ADICIONAR X]</span>` + bg gradient escuro estilizado).

## Padrões deste projeto (`outsider-school-home`)

- **Naming:** `slice-NN-<tipo>` pras sections + BEM `<area>__<elem>--<mod>` pros filhos. Ex: `metodo__title--strong`.
- **Estrutura HTML:** sections diretas em `.canvas`, cada uma com `data-bg="..."` documentando o fundo. Conteúdo de cada section é uma árvore de containers flex aninhados (autolayout 1:1).
- **CSS por slice:** bloco comentado em `styles.css` com a estrutura de autolayout documentada:
  ```css
  /* ============================================================
     Slice-NN — descrição
     Figma autolayout: <column|row>, padding <P>, gap <G>, items <X>, h=<H>
     Containers: header (col gap A) > kicker-row (row gap B) + title
                 body (row justify-between)
     ============================================================ */
  ```
- **Cores:** sempre `rgba(...)` com alpha quando o Figma usa transparência (não converter pra hex).
- **Sem dependências:** zero Tailwind, zero React, vanilla HTML/CSS.

## Antipatterns

1. ❌ **Traduzir autolayout do Figma pra `position: absolute`** — autolayout = flex container 1:1, sempre. Absolute só pra sobreposição genuína.
2. ❌ **Achatar a estrutura aninhada do Figma** — se Figma tem pai > filho > neto > bisneto, HTML também tem. Não consolidar precoce.
3. ❌ **Pular o filter step** — pular pra implementação direto do design_context cru produz código bagunçado com mask-groups e wrappers desnecessários no DOM.
4. ❌ **Acoplar bg-image ao container de conteúdo quando há overlay** — separa em camadas (image + overlay + conteúdo) com z-index controlado.
5. ❌ Chamar `get_design_context` no frame raiz (1:2062 etc.) — estoura context.
6. ❌ Reler arquivo de tool result com `Read` em vez de `jq` — `Read` corta no offset/limit, `jq` filtra direto.
7. ❌ Tentar adivinhar coordenadas a partir do screenshot — o Figma dá os valores exatos no design_context, sempre usar.
8. ❌ Esquecer de chamar `get_screenshot` antes de implementar — sem visual de referência fica fácil errar layout.
9. ❌ Spawn de subagent pra edit de 1 linha — overhead > benefício.

## Subagent Haiku: quando vale

Vale spawn de Haiku **só** pra:
- Edit simples/mecânico em 1 arquivo (ex: trocar `src` de img, renomear classe, percent-encode path)
- Tarefa onde o prompt cabe em ~50 linhas e o output esperado é "ok" ou diff pequeno

Não vale spawn pra:
- Implementação de seção (precisa context do projeto inteiro — gasta mais re-derivando que fazendo direto)
- Pesquisa exploratória
- Qualquer coisa que envolva ler `get_design_context`

Tipicamente um Haiku edit consome ~25-30k tokens (overhead de cold start) — só vale se isolar bem a unidade de trabalho.

## Template de mensagem ideal do usuário (quando invocar `/figma-pixel`)

Front-loading economiza ~10k tokens por task (evita 2-3 rodadas de pergunta). Não substitui as chamadas Figma MCP (essas são piso fixo).

**Template padrão:**

```
/figma-pixel
<link com node-id específico>

contexto:
- alvo: refactor da .slice-XX  |  seção nova
- assets: placeholder  |  exporto tudo  |  mix (descreva)
- bg do slice: herda body  |  cor sólida  |  imagem  |  imagem + overlay
- decisões de design: <flags específicas — ex: "chips com fade", "manter unicode pras estrelas">
- exec: subagent haiku  |  direto opus  |  parallel (várias slices)
- obs: <qualquer detalhe não-óbvio do que tá no Figma vs HTML atual>
```

**Hierarquia de prioridade no handoff** (do que mais importa):

1. 🔴 **Node-id específico na URL** — sem isso, frame raiz queima 50k+ tokens. Vale 10× tudo o resto.
2. 🟡 **Alvo (refactor vs novo) + assets + decisões de design** — eliminam round-trips de pergunta. ~5-10k.
3. 🟢 **Modo de execução** — se omitido, eu escolho (default: subagent haiku pra refactor com diff bem definido; direto opus pra seção nova).

**Exemplo concreto que funciona:**

```
/figma-pixel
https://www.figma.com/design/.../?node-id=30-473

- alvo: refactor da .slice-13-preto-grad-b
- assets: placeholder
- decisões: chips com fade gradient nas bordas
- exec: subagent haiku
```

Com isso eu pulo Phase 1 quase inteira: faço só os 3 calls Figma MCP em paralelo, gero o plano completo, e você só aprova.

## Escolha de modelo

| Cenário | Modelo | Por quê |
|---|---|---|
| Sessão principal (orquestração, Figma→CSS, planning) | **Opus 4.7** | A tradução de design_context (React+Tailwind) pra convenções do projeto tem nuance que Sonnet pode escorregar e Haiku quase certo erra |
| Subagent pra Edit mecânico (diff já escrito) | **Haiku 4.5** | É essencialmente string-replace; Haiku é 10× mais barato e o resultado é binário (funciona ou erra) |
| Subagent pra exploração / "descobre pra mim" | ❌ não usar | Cold start (~30k) re-deriva contexto que o main session já tem; vira desperdício |
| Sonnet 4.6 | Pular nesse fluxo | Fica no awkward middle — ou precisa da nuance do Opus, ou precisa do preço do Haiku |

**Recomendação default:** Opus na main session + Haiku no subagent quando a tarefa for "aplicar esse diff que eu já escrevi".

## Quando subagent vale (e quando não)

| Situação | Subagent? | Custo absoluto | Custo no main context |
|---|---|---|---|
| Aplicar diff pré-escrito em 1-2 arquivos | ✅ Haiku | ~30-60k | só ~1k de resumo |
| Refactor de 1 slice complexa | ✅ Haiku | ~60-80k | ~1k |
| 3 slices independentes em paralelo | ✅ 3× Haiku | 3×60k | ~3k total |
| Fix de 1 linha (trocar `src`) | ❌ direto | ~5k | ~5k |
| Exploração de seção nova | ❌ direto Opus | ~30k | ~30k |
| "Verifica se todos os slices existem" | ✅ Haiku Explore | ~20k | ~500 |

**Regra mental:** subagent vale quando o **resultado é determinístico** (você sabe o que ele vai fazer) e o **trabalho é volumoso** o bastante pra amortizar o cold start de ~30k.

Pra projeto de 15 slices: subagent em todos = main context fica ~15k em vez de ~150k. Sem isso você compacta no meio do caminho e perde nuance.

## Checklist de execução (pra mim, próximo Claude que invocar essa skill)

1. **Confirmar node-id** parseado da URL é específico (não raiz). Se for raiz, pedir refinement OU usar `get_metadata` + `jq` pra achar subnode.
2. **Fetch em paralelo:** `get_screenshot` + `get_design_context(forceCode=true)` + `get_variable_defs` no node-id correto.
3. **Filter step:** mapear o design_context numa árvore conceitual Elementor (autolayout 1:1, profundidade mantida, ruído filtrado, backgrounds classificados). Não pular.
4. **Identificar bloco existente** em `index.html`/`styles.css` se for refactor (grep por classe).
5. **Escrever HTML** com BEM consistente, espelhando a árvore conceitual (containers flex aninhados).
6. **Escrever CSS** no bloco comentado: section flex container + filhos flex + backgrounds em camadas onde aplicável. Width/height literais. Sem `position: absolute` exceto sobreposição.
7. **Listar imagens/SVGs** que precisam de export manual (se houver) com node-id de cada uma.
8. **Reportar ao usuário:** o que foi implementado + o que está com placeholder + próximos passos de export + pedir validação visual antes de seguir.

## v2 — limitações conhecidas

- Não cobre interatividade (animations, hover, click). Foco é layout estático pixel perfect.
- Não cobre design tokens — `get_variable_defs` retorna `{}` neste arquivo Figma. Se um dia popular, atualizar essa skill pra usar variáveis ao invés de hard-coded values.
- Aproximação de gradientes radiais SVG com `radial-gradient` CSS perde fidelidade. Pra fidelidade total, exportar como PNG/SVG.
- Box-shadow stacks longos do Figma têm camadas com alpha 0 que não fazem nada — sempre dropar.
- A heurística de backgrounds cobre os casos comuns (cor sólida, gradient, imagem, imagem+overlay). Se aparecer caso novo (ex: imagem com mix-blend específico, video bg, mask gradient não-decorativo), atualizar a tabela.

## Changelog

- **v2** — Modelo Elementor flex 1:1 (autolayout = container flex), filter step, heurística de backgrounds em camadas, regra de slice sizing, antipatterns atualizados. Substitui v1 que documentava `position: absolute` errado como default.
- **v1** — Versão inicial com pattern de absolute positioning (incorreta — não usar como referência).
