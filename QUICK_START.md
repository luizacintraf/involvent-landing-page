# 🚀 Guia de Início Rápido

## ⚡ Configuração em 5 minutos

### 1. **Configure o arquivo `config.js`**
```bash
# Copie o arquivo de exemplo
cp config.example.js src/config.js
```

Edite o arquivo `src/config.js` com suas informações:
- ✅ Nome do evento
- ✅ Data e local
- ✅ URL da imagem
- ✅ Descrição do evento
- ✅ Email para PIX
- ✅ ID do Google Apps Script

### 2. **Configure o Google Apps Script**
1. Acesse [script.google.com](https://script.google.com)
2. Crie um novo projeto
3. Cole o código do arquivo `Code.gs`
4. Faça o deploy como web app
5. Copie o ID do projeto

### 3. **Configure o Google Sheets**
Crie uma planilha com a aba `ingressos` contendo:
- `orderNumber` | `nomeComprador` | `email` | `nomeParticipante` | `unidade` | `tipo` | `status`

### 4. **Build e Deploy**
```bash
npm install
npm run build
```

Copie o conteúdo de `dist/bundle.js` para o Google Apps Script.

### 5. **Acesse sua aplicação**
```
https://script.google.com/macros/s/[SEU_APP_ID]/~/exec
```

## 🎯 Pronto! Sua aplicação está funcionando!

---

**💡 Dica**: Use o arquivo `config.js` para personalizar tudo sem mexer no código! 