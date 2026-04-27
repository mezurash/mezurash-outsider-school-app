## Contexto Atual - 2026-04-27

Projeto: landing page estatica da Outsider School em `index.html`, `styles.css` e `script.js`.

Ultimo commit criado nesta sessao:

- `f07050c fix: adjust program sections layout`

Resumo das alteracoes recentes:

- Depoimentos/carrosseis:
  - Usado `figma-dump.md` como referencia, sem chamar MCP do Figma.
  - Carrossel da secao "A Chave" corrigido para usar dimensoes individuais do dump.
  - Rating `★★★★★ 5.0` substituido pelo SVG `imagens-exported/asset-5-stars.svg`.
  - Ratings padronizados com classe `testimonial-rating` em `151.9px x 22.116px`.
- Cards Master/A Chave:
  - Novo asset versionado: `imagens-exported/outsider-school-logo-dourado.svg`.
  - Cards `Master Outsider` e `A Chave` usam esse logo dourado como `program-cover__mark`.
  - Card `O Codigo` continua com `imagens-exported/s1-icon-logo.svg`.
- Linha acima de A Chave:
  - Removido o pseudo-elemento `.codigo-visual::after`, que desenhava uma faixa horizontal de `2px`.
  - Adicionado `margin-top: -1px` em `.product-cover--chave` para cobrir o encontro visual entre secoes.
- Espacamentos:
  - `.codigo-cards` ajustado para `padding-top: 120px` e `padding-bottom: 120px`; altura alterada para `878px`.
  - `.chave-benefits` recebeu `padding-bottom: 120px`; altura alterada para `790px`.
- Canvas/footer:
  - Footer real manteve altura `319px`, conforme proto.
  - Sobra preta no fim vinha do canvas fixo `.figma-page { height: 18614px; }`.
  - `.figma-page` agora usa `height: auto`.
  - `script.js` calcula a altura do viewport a partir de `page.scrollHeight * scale`.
  - Adicionados `load` e `ResizeObserver` para recalcular altura apos imagens/fontes mudarem o layout.

Validacoes feitas:

- `git diff --check -- index.html styles.css script.js imagens-exported/outsider-school-logo-dourado.svg` passou sem saida.
- `git status --short` apos commit ficou limpo.

Observacao operacional:

- `git add` precisou de permissao elevada porque o sandbox bloqueou escrita em `.git/index.lock`.
