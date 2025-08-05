// ========================================
// CONFIGURAÇÃO DO TEMPLATE
// ========================================
// Modifique apenas os valores abaixo para personalizar sua aplicação

const CONFIG = {
  // Informações básicas do evento
  eventInfo: {
    title: "3° Arraiá do PD Castelo",
    subtitle: "🌽💚🔥IRRÁAAAAAAA olha o 3° Arraiá do PD Castelo!🔥💚🌽",
    date: "06 de Julho de 2025",
    time: "14:00h às 19:00h",
    location: "PD Castelo"
  },
  // Descrição completa do evento
  eventDescription: {
    intro: "Chegou o melhor período do ano, nossa escola de forró se enche de alegria com a nossa maravilhosa confraternização de alunos com o tema JULHINO! 🙌🏻💃🏻🕺🏽",
    cards:[
      {
        title:"Comidas",
        items:[
          "Caldo de Mandioca",
          "Caldo de Feijão", 
          "Cachorro quente",
          "Canjica",
          "Mesa de doces típicos"
        ],
        color:"green"
      },
      {
        title:"Bebidas",
        items:[
          "Refrigerante",
          "Suco", 
          "Chopp"
        ],
        color:"green"
      },
      {
        title:"Atividades",
        items:[
          "Jack & Jill junino (premiação)",
          "Quadrilha",
          "Correio elegante", 
          "Brincadeiras",
        ],
        color:"green"
      },
      {
        title:"⚠️ Observações Importantes",
        items:[
          "⚠️ Crianças e Jovens menores de 18 anos só podem permanecer no local com o responsável legal."
        ],
        color:"yellow"
      }
    ]
  },

  // Configurações de pagamento
  payment: {
    pixEmail: "eventospdcastelo@gmail.com",
    pixMessage: "Caso o QR code não funcione, faça o PIX para: eventospdcastelo@gmail.com",
    comprovanteWarning: "⚠️ ATENÇÃO: Sua compra só será efetivada após anexar o comprovante de pagamento."
  },

  // Configurações do Google Apps Script
  googleAppsScript: {
    // Substitua pelo ID do seu projeto Google Apps Script
    appId: "SEU_APP_ID_AQUI",
    
    // Nomes das abas no Google Sheets (não altere se usar a estrutura padrão)
    sheets: {
      ingressos: "ingressos",
      token: "token"
    }
  },

  // Configurações visuais (opcional)
  styling: {
    primaryColor: "#4F46E5", // Cor principal (índigo)
    secondaryColor: "#10B981", // Cor secundária (verde)
    accentColor: "#F59E0B" // Cor de destaque (amarelo)
  }
};

// ========================================
// NÃO MODIFIQUE ABAIXO DESTA LINHA
// ========================================
export default CONFIG; 