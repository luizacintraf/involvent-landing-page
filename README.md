# Google Apps Script React Application

Este é um aplicativo React integrado com Google Apps Script usando GAS Client.

## Configuração Inicial

1. Instale as dependências:
```bash
npm install
```

2. Configure o CLASP (Command Line Apps Script Projects):
```bash
npm install -g @google/clasp
clasp login
```

3. Crie um novo projeto no Google Apps Script:
- Acesse [script.google.com](https://script.google.com)
- Crie um novo projeto
- Copie o ID do script da URL (está entre /d/ e /edit)
- Cole o ID do script no arquivo `.clasp.json`

4. Habilite a API do Google Apps Script:
- Acesse [script.google.com/home/usersettings](https://script.google.com/home/usersettings)
- Ative "Google Apps Script API"

## Desenvolvimento

Para iniciar o servidor de desenvolvimento:
```bash
npm start
```

## Deploy

Para fazer deploy das alterações:
```bash
npm run deploy
```

## Estrutura do Projeto

- `src/` - Código fonte React
- `public/` - Arquivos públicos
- `Code.gs` - Código backend do Google Apps Script
- `dist/` - Arquivos compilados

## Tecnologias Utilizadas

- React
- Google Apps Script
- GAS Client
- Webpack
- Babel 