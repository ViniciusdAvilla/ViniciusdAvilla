# Ethos Tribo — Espelho público de referência

Recriação estática das cinco rotas públicas do site de referência consultadas em 02/10/2026. Estrutura, títulos e conteúdo público acompanham a referência. Não é cópia pixel-perfect: o CSS e o código original não estão disponíveis. Os caminhos de imagem apontam ao site original quando acessíveis e incluem fotografias locais alternativas.

## Páginas
- `/`: Início
- `/agenda/`: agenda com prévia datada (os dados atuais estão no domínio oficial)
- `/grupos/`: apresentação; resultados reais no site oficial
- `/manifesto/`
- `/sobre/`

Login/Google OAuth, inscrição, confirmação de presença, dados de grupo e fotos de usuários **não foram copiados** nem simulados. Os botões de autenticação e ações reais levam ao domínio oficial. Para clonagem funcional 1:1: código Next.js original + arquivos de estilo, imagens originais e configuração autorizada de backend/Supabase.

HTML/CSS/JS sem dependência de framework; estilos contidos em `#ethos-mirror` para evitar conflitos com outros componentes. Hospedável como site estático. Use `python -m http.server 8080` na raiz para visualização local.
