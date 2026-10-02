# O que é necessário para uma clonagem integral

Esta entrega é um espelho **das páginas públicas**, consultadas em 2 de outubro de 2026, e não reproduz exatamente o CSS e os componentes Next.js da plataforma original. Os estilos deste projeto ficam isolados em `#ethos-mirror`, para não atingir outras telas.

Para ficar visualmente **idêntico** e funcional, é preciso o repositório Next.js original (ou ZIP do frontend com componentes, CSS, `public/` e dependências). Para migrar login Google, sessão e inscrições, também é necessário o mecanismo de autenticação e suas configurações **não secretas**, além de acesso autorizado à API; **não envie senhas, service-role keys ou segredos**. Nunca use informações fictícias para exibir o avatar.

As imagens usam primeiro os caminhos públicos de `/images` no site de referência. Se a imagem não estiver acessível, o script substitui pela alternativa incluída em `assets/`. A agenda incluída é uma prévia datada; inscrições, vagas e grupos em tempo real permanecem somente no site original.

As cinco páginas estão em `/`, `/agenda/`, `/grupos/`, `/manifesto/` e `/sobre/`. O pacote também funciona dentro de uma subpasta, pois as referências são relativas.
