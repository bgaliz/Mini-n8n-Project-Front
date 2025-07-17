# My React Flow App

Este projeto é uma aplicação React que integra funcionalidades com o Telegram via bot. Siga atentamente as instruções abaixo para garantir a instalação e funcionamento correto.

## Pré-requisitos

- **Node.js** e **npm** instalados em sua máquina.
- **Conta no Telegram**.
- **Projeto backend rodando:**  
    Clone e execute o projeto [Mini-n8n-Project-Back](https://github.com/bgaliz/Mini-n8n-Project-Back) conforme instruções do próprio repositório.

## Criando um Bot no Telegram

1. Acesse [BotFather](https://t.me/BotFather) no Telegram.
2. Clique em "Start" para iniciar a conversa.
3. Envie o comando `/newbot`.
4. Escolha um nome para seu bot.
5. Escolha um username único (deve terminar com `bot`, ex: `meubot_test_bot`).
6. Após criado, o BotFather enviará uma mensagem com o **token de acesso** do seu bot.  
     **Guarde este token**, pois será necessário para configurar o sistema.

## Instalação do Projeto

1. Clone este repositório:
     ```bash
     git clone https://github.com/bgaliz/Mini-n8n-Project-Front
     cd Mini-n8n-Project-Front
     ```
2. Instale as dependências:
     ```bash
     npm install
     ```
3. Esteja ciente que você coletou o `TOKEN DE ACESSO` do bot, no Telegram. Pois você irá utiliza-lo ao abrir o projeto React Flow.
4. Certifique-se que o projeto [Mini-n8n-Project-Back](https://github.com/bgaliz/Mini-n8n-Project-Back) backend está rodando.
5. Inicie a aplicação:
     ```bash
     npm run dev
     ```

## Observações

- O backend e o frontend devem estar rodando simultaneamente.
- O token do bot é sensível, não compartilhe publicamente.
- O tempo de requisição do bot está com delay de 25 segundos (offset) para não haver bloqueio durante o envio das mensagens para o Telegram. `VOCÊ É LIVRE PARA ALTERAR O VALOR!`
- Siga as instruções do backend para eventuais configurações adicionais.

Tudo pronto! Agora você pode utilizar o sistema normalmente.