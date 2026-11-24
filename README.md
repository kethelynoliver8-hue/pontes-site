# Pontes Encanador e Caça Vazamento

Site estático em português para atendimento em Maringá e região. O formulário monta a mensagem no navegador e abre o WhatsApp.

## Estrutura

- `index.html` reúne as seções, os metadados e o JSON-LD.
- `styles.css` contém as cores, o layout e a responsividade.
- `script.js` controla o menu, a galeria, o formulário e o comportamento do botão flutuante.
- `404.html`, `robots.txt`, `sitemap.xml` e `.nojekyll` ficam na raiz.
- `assets/images/` contém os banners e as fotos. Use essa pasta também para a imagem de compartilhamento e eventuais prints das avaliações.
- `assets/icons/` contém os SVGs e favicons. A logo original está em `assets/logo/logo.png`. As versões transparentes estão na mesma pasta.

## Como rodar localmente

Abra `index.html` ou execute `python -m http.server 8000` na pasta `pontes` e acesse `http://localhost:8000/`. O servidor simples também permite conferir caminhos e a página `404.html`.

## Como publicar no GitHub Pages

1. Crie um repositório e envie o conteúdo da pasta `pontes` para a raiz da branch `main`, incluindo `.nojekyll`.
2. Em **Settings → Pages**, escolha **Deploy from a branch**, selecione **main** e **/ (root)**. Salve e abra o endereço de publicação indicado pelo GitHub.
3. Para domínio próprio, cadastre o hostname em **Settings → Pages → Custom domain**. Numa publicação por branch, o GitHub registra o hostname no arquivo `CNAME` na raiz. No provedor DNS, configure o destino indicado pelo GitHub Pages. Para um subdomínio, use um registro CNAME apontando para `<usuario>.github.io`, sem o nome do repositório. Para um domínio raiz, use os registros descritos na documentação oficial. Depois de validar o DNS, habilite **Enforce HTTPS**.
4. Se o site for publicado em `usuario.github.io/repositorio/`, inclua `/repositorio/` nas URLs absolutas de SEO. O link relativo da página 404 atende ao nível da raiz do projeto. Confira o comportamento em URLs inexistentes com vários níveis.

[Publicação por branch](https://docs.github.com/pt/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) · [Domínio próprio e DNS](https://docs.github.com/pt/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)

## TROCAR ANTES DE PUBLICAR

- [ ] Substituir `https://SEU-DOMINIO/` no canonical, em `og:url`, `og:image`, `twitter:image` e no `sitemap.xml`. Em `robots.txt`, trocar o endereço da linha `Sitemap:`. Confirmar também os placeholders `url` e `image` do JSON-LD.
- [ ] Criar `assets/images/og-pontes-1200x630.jpg` com 1200 × 630 px e até 200 KB. Usar a logo e o texto “Caça Vazamento em Maringá e região”. O arquivo fica pendente de criação.
- [ ] Revisar as fotos da galeria e os depoimentos. Os cartões de serviços usam imagens ilustrativas, e a galeria usa as fotos enviadas para o projeto.
- [ ] Confirmar os trechos do cliente listados abaixo.

## Como trocar fotos, logo e avaliações

- **Logo:** para atualizar a marca exibida no cabeçalho, no rodapé e na página 404, substitua `assets/logo/logo-transparente.png`. Atualize os atributos de dimensão das ocorrências que os usam se a proporção da imagem mudar.
- **Fotos:** preserve os nomes dos banners em `assets/images/` ou atualize os caminhos no HTML. Para a galeria, atualize o `href` e o `src` do slide, as dimensões reais e o `alt`. Use WebP e `loading="lazy"`. Ao adicionar fotos, copie um `figure.gallery-slide` e atualize a numeração e o contador inicial no HTML.
- **Avaliações:** em `#avaliacoes`, troque o conteúdo de `blockquote`, a inicial, o nome e, se necessário, as estrelas e a descrição acessível. Preserve a grafia original. Guarde eventuais prints em `assets/images/`. Para trocar o endereço do Google, edite o `href` do botão “Ver avaliações no Google” em `index.html`, na seção `#avaliacoes`.

## Como editar perguntas do FAQ

Copie um bloco `<details>` de `#perguntas`, troque a pergunta e a resposta e mantenha `name="faq"`. Use `open` apenas na pergunta inicial.

## Como trocar telefone, e-mail, horário e mapa

- **Telefone:** procure `5544999897808` em `index.html` e atualize os links do hero, cabeçalho, botão flutuante, demais botões, formulário e rodapé. O formulário lê o número do atributo `action` no JavaScript. Troque o telefone exibido no FAQ e no rodapé, e o campo `telephone` do JSON-LD.
- **E-mail:** altere o texto e o `mailto:` do rodapé e o campo `email` do JSON-LD.
- **Horário:** revise o hero, as chamadas de emergência, Como funciona, Sobre, FAQ, rodapé e o horário normal no JSON-LD.
- **Mapa:** em `#contato`, ajuste o `src` do iframe e o link “Abrir no Google Maps”. O embed atual aponta para a área de Maringá. Use o Perfil da Empresa se houver endereço público confirmado.

## Trechos a confirmar com o cliente

- `index.html:216` — Confirmar o serviço “Rede de incêndio (bombeiro)”.
- `index.html:225` — Confirmar o serviço “Alarme de incêndio”.
- `index.html:234` — Confirmar o serviço “Vazamento em piscina com técnica de mergulho”.
- `index.html:272` — abrangência da emergência (noite, fim de semana, feriado)
- `index.html:281` — lista real de equipamentos
- `index.html:367` — equipamentos reais e a frase "sem quebrar mais do que o necessário"
- `index.html:369` — abrangência da emergência (noite, fim de semana, feriado)
- `index.html:552` — lista real de equipamentos
- `index.html:560` — se a afirmação vale na maioria dos casos
- `index.html:568` — abrangência da emergência (noite, fim de semana, feriado)
- `index.html:583` — detalhes do procedimento
- `index.html:591` — lista de cidades atendidas
- `index.html:606` — horário e abrangência da emergência
- `index.html:654` — se a empresa tem endereço público e quer o pino no perfil do Google. Se tiver, trocar o src pelo embed do Perfil da Empresa. Se atende sem endereço público, manter a área de Maringá.
- `index.html:710` — dias úteis e abrangência da emergência (noite, fim de semana, feriado)
- `index.html:713` — lista de cidades atendidas

## Checklist final

- [ ] Conferir em um celular real o menu, o formulário, a galeria, o rodapé e o retorno do WhatsApp flutuante ao subir.
- [ ] Rodar PageSpeed Insights na URL publicada.
- [ ] Validar o JSON-LD no Teste de Rich Results e revisar eventuais avisos.
- [ ] Testar a prévia do link no WhatsApp com a imagem OG já publicada.
- [ ] Cadastrar a URL no Google Search Console e enviar o sitemap.
