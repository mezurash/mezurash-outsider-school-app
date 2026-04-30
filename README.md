# OutsiderSchool / home

Implementação estática de uma landing page para a marca Outsider School.

Este pacote foi preparado para entrega e importação em outra infraestrutura. A página não depende de build, framework ou servidor Node para funcionar: ela é composta por HTML, CSS, JavaScript e arquivos de imagem/fontes locais.

## Estrutura do projeto

```text
.
├── index.html
├── styles.css
├── script.js
└── assets/
    ├── fonts/
    ├── icons/
    ├── images/
    └── logos/
```

## Arquivos principais

- `index.html`: estrutura completa da landing page.
- `styles.css`: estilos, responsividade, fontes e layout desktop/mobile.
- `script.js`: interações da página, animações de entrada e comportamento dos carrosséis.
- `assets/`: imagens, logos, ícones e fontes usados pela implementação.

## Especificações técnicas

- Projeto estático em HTML, CSS e JavaScript puro.
- Não usa React, Vue, Next.js, Vite ou outro framework.
- Não possui etapa obrigatória de build.
- O arquivo de entrada da página é `index.html`.
- As imagens, logos, ícones e fontes precisam permanecer junto do projeto, mantendo os mesmos caminhos relativos.
- O CSS carrega fontes locais em `assets/fonts/`.
- Os carrosséis e interações dependem de `script.js`.

## Como usar em outro projeto ou infraestrutura

### Opção 1: clonar pelo terminal

1. Entre, pelo terminal, na pasta onde você quer salvar o projeto.

Exemplo:

```bash
cd Desktop
```

2. Clone este repositório:

```bash
git clone https://github.com/mezurash/mezurash-outsider-school-app.git
```

Esse comando baixa uma cópia completa deste repositório para a sua máquina.

3. Entre na pasta do projeto:

```bash
cd mezurash-outsider-school-app
```

4. Copie para a infraestrutura de destino os arquivos e pastas abaixo:

```text
index.html
styles.css
script.js
assets/
```

5. Configure o servidor, CMS ou ambiente do cliente para servir `index.html` como página principal.

6. Mantenha a estrutura de pastas exatamente como está no repositório. Se algum caminho for alterado, será necessário atualizar as referências em `index.html` e `styles.css`.

### Opção 2: baixar ZIP pelo GitHub

1. Acesse o repositório público:

```text
https://github.com/mezurash/mezurash-outsider-school-app
```

2. Clique no botão verde `Code`.

3. Clique em `Download ZIP`.

4. Extraia o arquivo ZIP no seu computador.

5. Copie os arquivos `index.html`, `styles.css`, `script.js` e a pasta `assets/` para a infraestrutura de destino.

6. Configure o servidor, CMS ou ambiente do cliente para servir `index.html` como página principal.

## Observações para integração

- Se a landing for importada para WordPress, Webflow, Framer ou outro CMS, mantenha os assets em uma pasta pública e ajuste os caminhos conforme a estrutura do ambiente.
- Se a infraestrutura usar CDN, suba `assets/` para a CDN e atualize os caminhos relativos no HTML/CSS.
- Se o cliente quiser separar seções em componentes, use `index.html` como fonte da estrutura e `styles.css` como fonte visual.
- Evite renomear arquivos de imagem sem atualizar todas as referências.

## Checklist de entrega

- `index.html` presente.
- `styles.css` presente.
- `script.js` presente.
- Pasta `assets/` presente.
- Estrutura de caminhos preservada.
