# Outsider School Landing Page

Implementacao estatica da landing page da Outsider School.

Este pacote foi preparado para entrega e importacao em outra infraestrutura. A pagina nao depende de build, framework ou servidor Node para funcionar: ela e composta por HTML, CSS, JavaScript e arquivos de imagem/fontes locais.

## Estrutura do projeto

```text
.
├── index.html
├── styles.css
├── script.js
├── assets/
│   ├── fonts/
│   ├── icons/
│   ├── images/
│   └── logos/
└── imagens-exported/
    ├── chevron-left.svg
    ├── chevron-right.svg
    └── circle-box.svg
```

## Arquivos principais

- `index.html`: estrutura completa da landing page.
- `styles.css`: estilos, responsividade, fontes e layout desktop/mobile.
- `script.js`: interacoes da pagina, animacoes de entrada e comportamento dos carrosseis.
- `assets/`: imagens, logos, icones e fontes usados pela implementacao.
- `imagens-exported/`: pequenos assets adicionais referenciados pelo HTML/CSS.

## Especificacoes tecnicas

- Projeto estatico em HTML, CSS e JavaScript puro.
- Nao usa React, Vue, Next.js, Vite ou outro framework.
- Nao possui etapa obrigatoria de build.
- O arquivo de entrada da pagina e `index.html`.
- As imagens, logos, icones e fontes precisam permanecer junto do projeto, mantendo os mesmos caminhos relativos.
- O CSS carrega fontes locais em `assets/fonts/`.
- Os carrosseis e interacoes dependem de `script.js`.

## Como usar em outro projeto ou infraestrutura

1. Clone o repositorio publico:

```bash
git clone <URL_DO_REPOSITORIO_PUBLICO>
```

2. Copie para a infraestrutura de destino os arquivos e pastas abaixo:

```text
index.html
styles.css
script.js
assets/
imagens-exported/
```

3. Configure o servidor, CMS ou ambiente do cliente para servir `index.html` como pagina principal.

4. Mantenha a estrutura de pastas exatamente como esta no repositorio. Se algum caminho for alterado, sera necessario atualizar as referencias em `index.html` e `styles.css`.

## Observacoes para integracao

- Se a landing for importada para WordPress, Webflow, Framer ou outro CMS, mantenha os assets em uma pasta publica e ajuste os caminhos conforme a estrutura do ambiente.
- Se a infraestrutura usar CDN, suba `assets/` e `imagens-exported/` para a CDN e atualize os caminhos relativos no HTML/CSS.
- Se o cliente quiser separar secoes em componentes, use `index.html` como fonte da estrutura e `styles.css` como fonte visual.
- Evite renomear arquivos de imagem sem atualizar todas as referencias.

## Checklist de entrega

- `index.html` presente.
- `styles.css` presente.
- `script.js` presente.
- Pasta `assets/` presente.
- Pasta `imagens-exported/` presente com os SVGs usados.
- Estrutura de caminhos preservada.
