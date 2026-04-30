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

## Cenário ideal: evolução com React, Figma e IA

Esta entrega está pronta para uso como página estática. Em um cenário ideal de evolução, ela também pode servir como base visual e estrutural para uma versão em React, com componentes reutilizáveis, melhor organização de código e um fluxo mais profissional entre design, desenvolvimento e manutenção.

A ideia é usar este pacote como referência fiel da landing aprovada e, a partir dele, refatorar a interface em componentes como `Header`, `Hero`, `ProgramCard`, `ProofSection`, `Testimonials`, `Footer` e outros blocos reutilizáveis. Isso facilita manutenção, reaproveitamento em novas páginas, ajustes por seção e integração com qualquer infraestrutura moderna.

Com o arquivo Figma enviado junto, o fluxo pode funcionar assim:

- **Design to code:** o Figma orienta espaçamentos, hierarquia visual, imagens, tipografia e estados da interface. A IA pode ler o design e ajudar a transformar as telas em componentes React.
- **Code to design:** depois que a implementação evolui, o código pode voltar a alimentar revisões no Figma, mantendo design e aplicação mais próximos.
- **Ajustes contínuos:** quando houver uma mudança no Figma, a IA pode comparar a intenção visual com o código existente e sugerir alterações pontuais, sem recomeçar do zero.
- **Mais performance e escala:** em React, a página pode ser quebrada em componentes, otimizada por seção, integrada com CMS, conectada a analytics e preparada para crescimento sem perder a base visual aprovada.

### Prompt sugerido para Codex ou Claude Code

Use este prompt dentro da pasta do projeto, depois de clonar ou baixar o repositório:

```text
Você está trabalhando neste projeto de landing page estática da Outsider School.

Objetivo:
Refatorar a página atual, feita em HTML, CSS e JavaScript puro, para uma aplicação React organizada em componentes reutilizáveis, preservando o máximo possível da fidelidade visual, responsividade, imagens, fontes, animações e comportamento atual.

Contexto:
- A versão atual aprovada está em index.html, styles.css, script.js e assets/.
- O arquivo Figma de referência também será enviado como base visual.
- A estrutura atual deve ser tratada como fonte de verdade para a landing já aprovada.

Tarefas:
1. Analisar index.html, styles.css e script.js antes de alterar qualquer coisa.
2. Propor uma arquitetura React simples e clara.
3. Separar a página em componentes por seção.
4. Preservar os caminhos dos assets ou reorganizá-los de forma documentada.
5. Manter a responsividade desktop/mobile.
6. Manter ou recriar as interações atuais em React.
7. Evitar mudanças visuais desnecessárias.
8. Documentar como rodar o projeto depois da refatoração.

Antes de implementar, apresente um plano curto com a estrutura de pastas sugerida.
```

### Prompt sugerido para trabalhar com Figma e React

```text
Use o arquivo Figma enviado como referência visual e compare com a landing implementada neste repositório.

Objetivo:
Criar ou ajustar componentes React a partir do design, mantendo consistência entre Figma e código.

Fluxo esperado:
1. Identificar as principais seções da landing no Figma.
2. Mapear cada seção para um componente React.
3. Comparar espaçamentos, tipografia, cores, imagens e estados com a implementação atual.
4. Ajustar o código para ficar fiel ao design aprovado.
5. Quando houver divergência entre Figma e código, apontar a diferença antes de alterar.
6. Manter a implementação limpa, performática e fácil de evoluir.

Prioridade:
Preservar a identidade visual aprovada e transformar a entrega em uma base mais escalável para futuras páginas, testes e integrações.
```
