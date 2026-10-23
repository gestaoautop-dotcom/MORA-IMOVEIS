# MORA — Imóveis com sentido

Site estático de imobiliária inspirado na composição visual da referência enviada: fotografia arquitetônica ampla, azul-céu, branco, preto e verde suave. O texto, o nome e as imagens foram criados para este conceito. A fonte usa Arial/Helvetica e alternativas do sistema, aproximando a referência, cuja fonte exata não pode ser identificada pela imagem.

## Abrir

Abra `index.html` no navegador. Não precisa instalar dependências. Para desenvolvimento, pode usar `python3 -m http.server 8080` nesta pasta e abrir `http://localhost:8080`.

## Publicar no GitHub Pages

1. Crie um repositório e envie **todo o conteúdo desta pasta**, incluindo `assets` e `.github`.
2. Em **Settings → Pages → Build and deployment**, selecione **GitHub Actions**.
3. O fluxo incluso publica o site a cada envio para `main`. Também pode ser executado manualmente em Actions.

Outra opção: em Pages, escolha **Deploy from a branch**, branch `main`, pasta `/ (root)`. Todos os caminhos são relativos e funcionam em subpastas do GitHub Pages.

## Personalizar

- `index.html`: textos, marca e seções.
- `styles.css`: cores, fontes, responsividade e espaçamentos.
- `script.js`: lista de imóveis, valores, características e comportamento.
- `config.js`: número real do WhatsApp com país e DDD, somente dígitos. Sem número configurado, o formulário prepara/copia uma mensagem local e explica que nada é enviado.
- `assets/`: fotografias WebP otimizadas. As versões PNG de origem estão em `originais/`.

## O que funciona

Filtros por compra/aluguel, tipo e texto (ignora acentos); favoritos salvos no navegador; detalhes em janela; menu mobile; preparação de mensagem e integração opcional com WhatsApp. Não há banco de dados, login, captação remota ou envio automático. Os dados digitados no formulário não são persistidos pelo site; somente os IDs dos favoritos são guardados no navegador.

## Antes de usar comercialmente

Este é um site demonstrativo: nome de marca proposto, anúncios, endereços, características e preços ilustrativos; fotografias geradas por IA e sem correspondência comprovada com imóveis reais. Substitua por fotos e anúncios autorizados, informações reais da imobiliária e identificação profissional aplicável. Verifique disponibilidade do nome e domínio. Sem avaliações ou números de desempenho inventados.

## Arquivos

`index.html`, `styles.css`, `script.js`, `config.js`, `assets/`, `originais/`, `PROMPTS.md` e `.github/workflows/pages.yml`.
