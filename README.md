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

## Sugestão de workflow: base escalável em Next/React

Esta versão estática está pronta, funciona bem e cumpre o objetivo imediato: publicar ou importar a landing page com HTML, CSS, JavaScript e assets locais.

A sugestão para uma próxima etapa é transformar esta entrega em uma base **Next/React**. Não porque a versão estática esteja errada, mas porque a versão componentizada resolve melhor o processo de evolução: novas páginas, variações de campanha, reaproveitamento de seções, manutenção contínua e operação assistida por IA.

Em resumo: **a entrega estática resolve a página. A base em Next/React resolve o processo.**

### Por que Next/React

React é uma das bases mais usadas no mercado moderno de frontend, e Next.js é uma evolução natural para produção porque já traz estrutura de aplicação, rotas, otimização de imagens, SEO, build e deploy em um padrão consolidado.

Esse não é apenas um gosto técnico. No [Stack Overflow Developer Survey 2025](https://survey.stackoverflow.co/2025/technology/), React aparece com **44,7%** de uso entre frameworks e tecnologias web, atrás apenas de Node.js, e Next.js aparece com **20,8%**. Entre profissionais que usam IA, React sobe para **48,7%** e Next.js para **23,2%**. No [State of JS 2024](https://2024.stateofjs.com/en-US/libraries/meta-frameworks/), Next.js também aparece muito acima dos outros meta-frameworks em uso bruto.

Ao refatorar a landing para Next/React, a página deixa de ser um arquivo longo de HTML/CSS e passa a ser organizada em componentes reutilizáveis, como `Header`, `Hero`, `ProgramCard`, `ProofSection`, `Testimonials` e `Footer`. Essa estrutura facilita criar novas páginas a partir da mesma fundação, sem recomeçar do zero.

Os principais ganhos são:

- **Escala:** novas páginas e campanhas podem reaproveitar componentes existentes.
- **Consistência:** layout, estilos, assets e padrões visuais ficam mais fáceis de manter.
- **Produtividade:** mudanças passam a ser feitas por seção, com menos retrabalho.
- **Custo menor no longo prazo:** uma base organizada reduz tempo de manutenção e risco de quebrar partes não relacionadas.
- **Padrão profissional:** a estrutura fica alinhada com a forma como equipes modernas de frontend organizam interfaces.

### Por que isso melhora o uso de IA

Ferramentas como Codex, Claude Code e outros agentes de IA conseguem trabalhar com HTML/CSS puro, mas performam melhor quando o projeto tem arquitetura clara, componentes nomeados e responsabilidades separadas.

Para uma IA, um componente chamado `Hero` ou `Testimonials` comunica intenção. Ela entende onde mexer, o que preservar e como reutilizar padrões. Em um arquivo estático grande, a IA precisa inferir mais contexto, ler mais código e correr mais risco de alterar algo fora do escopo.

Na prática, uma base Next/React ajuda a IA a:

- gastar menos contexto/tokens para entender uma alteração;
- localizar a seção correta com mais precisão;
- reaproveitar componentes em novas páginas;
- criar variações de layout com menos risco;
- manter responsividade e padrões visuais de forma mais consistente;
- receber comandos mais claros de quem está orquestrando o trabalho.

Isso é especialmente importante em um workflow onde pessoas coordenam IAs para evoluir o projeto. Em vez de pedir "encontre no HTML a parte dos depoimentos e ajuste sem quebrar o resto", fica possível pedir "ajuste o componente `Testimonials`" ou "crie uma nova variação do `ProgramCard`".

### Como o Figma entra nesse processo

O Figma não precisa ser alterado para que esse workflow funcione. Ele entra como referência visual e linguagem comum entre design, código e IA.

Com uma base em Next/React, o código pode ser organizado em blocos equivalentes ao raciocínio do design: seções, componentes, variações, estados, imagens e padrões de espaçamento. Isso facilita comparar a implementação com o layout aprovado, orientar ajustes futuros e manter consistência visual sem depender de interpretação solta.

Essa organização cria uma base interna mais forte: se no futuro for necessário criar novas páginas para a Outsider School, reaproveitar a identidade visual, gerar variações ou integrar novas ferramentas, o projeto já estará em um padrão mais fácil de evoluir com IA.

### Prompt sugerido para Codex ou Claude Code

Use este prompt dentro da pasta do projeto, depois de clonar ou baixar o repositório:

```text
Você está trabalhando neste projeto de landing page estática da Outsider School.

Objetivo:
Refatorar a página atual, feita em HTML, CSS e JavaScript puro, para uma aplicação Next.js com base React, organizada em componentes reutilizáveis e preparada para futuras páginas, variações e manutenção assistida por IA.

Contexto:
- A versão atual aprovada está em index.html, styles.css, script.js e assets/.
- Esta versão estática deve ser tratada como fonte de verdade visual e funcional.
- O arquivo Figma pode ser usado como referência visual complementar, sem necessidade de alterá-lo.
- A refatoração deve preservar o máximo possível da fidelidade visual, responsividade, imagens, fontes, animações e comportamento atual.

Tarefas:
1. Analisar index.html, styles.css e script.js antes de alterar qualquer coisa.
2. Propor uma arquitetura Next.js simples, clara e componentizada.
3. Separar a página em componentes por seção, como Header, Hero, ProgramCard, ProofSection, Testimonials e Footer.
4. Manter os assets organizados e documentar qualquer mudança de caminho.
5. Preservar a responsividade desktop/mobile.
6. Recriar as interações atuais em React quando necessário.
7. Evitar mudanças visuais desnecessárias.
8. Documentar como rodar, manter e criar novas páginas a partir dessa base.

Antes de implementar, apresente um plano curto com a estrutura de pastas sugerida.
```

### Prompt sugerido para evoluir novas páginas com IA

```text
Use a base Next/React deste projeto como referência para criar uma nova página mantendo o padrão visual da Outsider School.

Objetivo:
Criar uma nova página ou variação reaproveitando componentes, estilos, assets e padrões já existentes.

Fluxo esperado:
1. Identificar quais componentes existentes podem ser reaproveitados.
2. Criar novos componentes somente quando necessário.
3. Manter nomes claros e responsabilidades separadas.
4. Preservar consistência visual com a landing original e com o Figma de referência.
5. Evitar alterações globais que possam quebrar páginas existentes.
6. Documentar qualquer novo padrão criado.

Prioridade:
Usar a arquitetura como base para ganhar velocidade, consistência e previsibilidade em novas entregas operadas com IA.
```
