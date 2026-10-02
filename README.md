# Ethos Tribo — melhoria fiel ao produto original

Reimplementação **isolada**, inspirada pela arquitetura de conteúdo do produto original (Início, Agenda, Grupos, Manifesto e Sobre). Os componentes não carregam nem alteram o CSS da plataforma original: toda estilização fica sob o contêiner `.et` e todas as classes usam o prefixo `et-`. A versão é uma proposta visual estática com páginas em português e inglês e temas claro/escuro.

## Execução e hospedagem

Para desenvolvimento: `python3 -m http.server 8080` na raiz e abra `http://localhost:8080`. Publicação: deploy da raiz como site estático, sem comando de build. A primeira página redireciona a `/pt/index.html`; idiomas ficam em `/pt/` e `/en/`.

## Integração ao aplicativo real

- Não substitua CSS global nem configure este pacote como se fosse a aplicação Next.js real. Para integrá-lo, envolva os componentes do frontend original em `className="et"` e importe **somente** `ethos-layout.css` na área correspondente; migre os blocos por partes mantendo as rotas e componentes de dados reais da aplicação original. Valide as demais telas antes de fazer merge.
- As imagens tentam carregar de URLs públicas do próprio `www.ethostribo.com.br` e usam cópias locais em caso de falha. Para deploy permanente, hospede os assets autorizados no mesmo projeto, substitua o domínio nas referências e evite hotlink. O pacote inclui imagens locais de contingência, não necessariamente as fotografias originais.
- Agenda e Grupos são visuais. A agenda dinâmica, inscrições, favoritos e perfil continuam exclusivos da **plataforma original**; os botões principais apontam para lá. Não inventamos disponibilidade ou login neste microsite.
- Para exibir foto e nome **reais** no cabeçalho, integre este layout dentro do projeto original e leia a sessão já autenticada pelo backend/Supabase. Como alternativa, configure `auth-config.js` com um endpoint seguro de sessão (`{ authenticated: true, user: { name, picture } }`) e configure cookies e CORS conforme a arquitetura do seu aplicativo. Não use tokens no JavaScript público; o site estático isolado não consegue herdar cookies do domínio original. O avatar nunca aparece sem confirmação do backend.
- O evento de vôlei listado em Agenda é um exemplo estático obtido na consulta de outubro de 2026. O botão leva à agenda ao vivo; remova o exemplo quando conectar o endpoint real. Não represente o exemplo como disponibilidade atual.

## Layout

- Preservados os blocos de conteúdo originais: hero, explicação, quatro dimensões, manifesto, código de convivência, CTA, além de páginas internas com a estrutura funcional correspondente.
- Design com verdes equilibrados, fundos sólidos, profundidade discreta, responsividade e movimento reduzido.
- Compatibilidade: HTML, CSS e JS; nenhum framework, dependências externas nem estilos globais que afetem a aplicação original.
