# 🎫 Template de Sistema de Vendas de Ingressos

Um template completo e reutilizável para criar sistemas de vendas de ingressos usando **React + Google Apps Script + Google Sheets**.

## 🚀 **Configuração Rápida (3 Passos)**

### 1. **Configure o arquivo `config.js`**
Abra o arquivo `src/config.js` e modifique apenas os valores necessários:

```javascript
const CONFIG = {
  // ✅ ALTERE AQUI: Informações do seu evento
  eventInfo: {
    title: "Nome do Seu Evento",
    subtitle: "Descrição do seu evento",
    date: "Data do evento",
    time: "Horário",
    location: "Local"
  },

  // ✅ ALTERE AQUI: Para usar imagem local, importe no componente
  // Para usar URL externa: eventImage: "https://sua-imagem-aqui.com/imagem.jpg"
  
  // ✅ ALTERE AQUI: Descrição completa do evento
  eventDescription: {
    intro: "Sua descrição aqui...",
    food: ["Comida 1", "Comida 2"],        // Opcional - deixe [] para não mostrar
    drinks: ["Bebida 1", "Bebida 2"],      // Opcional - deixe [] para não mostrar
    activities: ["Atividade 1", "Atividade 2"], // Opcional - deixe [] para não mostrar
    importantNote: "Sua observação importante"
  },

  // ✅ ALTERE AQUI: Email para PIX
  payment: {
    pixEmail: "seu-email@gmail.com"
  },

  // ✅ ALTERE AQUI: ID do seu Google Apps Script
  googleAppsScript: {
    appId: "SEU_APP_ID_AQUI"
  }
};
```

### 2. **Configure o Google Apps Script**
1. Acesse [script.google.com](https://script.google.com)
2. Crie um novo projeto
3. Copie o conteúdo do arquivo `Code.gs` para o editor
4. Configure as permissões necessárias
5. Faça o deploy como web app
6. Copie o ID do projeto e cole no `config.js`

### 3. **Configure o Google Sheets**
Crie uma planilha com duas abas:
- **`ingressos`**: Para armazenar os pedidos
- **`token`**: Para o sistema de edição (será criada automaticamente)

## 📋 **Funcionalidades Incluídas**

✅ **Sistema de Vendas Completo**
- Seleção de ingressos por lote
- Validação de datas de venda
- Carrinho de compras
- Checkout com dados do comprador e participantes

✅ **Sistema de Pagamento PIX**
- Geração automática de QR Code
- Identificador único por transação
- Upload de comprovante
- Validação de pagamento

✅ **Sistema de Edição de Pedidos**
- Verificação por email + token
- Edição de dados dos participantes
- Notificação por email das alterações

✅ **Design Responsivo**
- Otimizado para mobile e desktop
- Interface moderna e intuitiva
- Persistência de dados no localStorage

✅ **Gestão de Emails**
- Confirmação automática de pedidos
- Reenvio de emails
- Notificações de alterações

## 🛠️ **Tecnologias Utilizadas**

- **Frontend**: React + Tailwind CSS
- **Backend**: Google Apps Script
- **Banco de Dados**: Google Sheets
- **Pagamento**: PIX (QR Code)
- **Deploy**: Google Apps Script Web App

## 📁 **Estrutura do Projeto**

```
├── src/
│   ├── config.js          # ✅ CONFIGURE AQUI
│   ├── components/        # Componentes React
│   ├── pages/            # Páginas da aplicação
│   └── utils/            # Utilitários
├── Code.gs               # Backend Google Apps Script
├── public/
│   └── index.html        # Template HTML
└── README.md             # Este arquivo
```

## 🎨 **Personalização Avançada**

### **Como Usar Imagens**

**Para imagens locais:**
1. Coloque sua imagem na pasta `src/assets/`
2. Importe no componente:
   ```javascript
   import minhaImagem from '../assets/minha-imagem.jpg';
   ```
3. Use no JSX:
   ```javascript
   <img src={minhaImagem} alt="Descrição" />
   ```

**Para URLs externas:**
1. Configure no `config.js`:
   ```javascript
   eventImage: "https://exemplo.com/minha-imagem.jpg"
   ```
2. Use no JSX:
   ```javascript
   <img src={CONFIG.eventImage} alt="Descrição" />
   ```

### **Cores do Tema**
No `config.js`, você pode alterar as cores:

```javascript
styling: {
  primaryColor: "#4F46E5",    // Cor principal
  secondaryColor: "#10B981",  // Cor secundária
  accentColor: "#F59E0B"      // Cor de destaque
}
```

### **Estrutura do Google Sheets**
O sistema espera as seguintes colunas na aba `ingressos`:
- `orderNumber` (número do pedido)
- `nomeComprador` (nome do comprador)
- `email` (email do comprador)
- `nomeParticipante` (nome do participante)
- `unidade` (tipo de ingresso)
- `tipo` (categoria do ingresso)
- `status` (status do pedido)

## 🚀 **Deploy**

1. **Build do projeto:**
   ```bash
   npm install
   npm run build
   ```

2. **Upload para Google Apps Script:**
   - Copie o conteúdo de `dist/bundle.js` para o arquivo `bundle.js` no Google Apps Script
   - Faça o deploy como web app

3. **URL de acesso:**
   ```
   https://script.google.com/macros/s/[SEU_APP_ID]/~/exec
   ```

## 📞 **Suporte**

Para dúvidas ou problemas:
1. Verifique se o `config.js` está configurado corretamente
2. Confirme se o Google Apps Script tem as permissões necessárias
3. Verifique se o Google Sheets tem as abas corretas

## 📝 **Licença**

Este template é livre para uso comercial e pessoal.

---

**✨ Template criado para facilitar a criação de sistemas de vendas de ingressos!** 