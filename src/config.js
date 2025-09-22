// ========================================
// CONFIGURAÇÃO DO TEMPLATE
// ========================================
// Modifique apenas os valores abaixo para personalizar sua aplicação

const CONFIG = {
  // Informações básicas do evento
  eventInfo: {
    title: "St. Patrick's Day",
    subtitle: "PD CASTELO",
    date: "16 de Agosto",
    time: "17:00h",
    location: "PD Castelo",
    address: "Rua Romualdo Lopes Cançado, 343 – 3º andar, Bairro Castelo"
  },
  // Descrição completa do evento
  eventDescription: {
    intro: "3 HORAS DE ESPAÇO LIVRE ESTENDIDO COM MUITO XEQUE MATE, VENHA DE VERDE!",
    cards:[
      {
        title: "Informações Gerais",
        items:[
          "O espaço livre do St. Patricks Day acontecerá no sábado, dia 16/08, e será  OBRIGATÓRIO IR COM ROUPA VERDE!",
          "O espaço livre sem consumo de bebida alcoólica acontece normalmente, com duração de 3 horas, e está liberado para todos os alunos matriculados na rede. Aceitamos Gympass/TotalPass. Visitantes e ex-alunos deverão pagar uma taxa de R$15 a parte.",
          "Nesse dia, teremos bastante XEQUE MATE disponível.  Caso queira participar do consumo da bebida alcoólica, será feita uma taxa de R$30 por PESSOA.",
          "Pagamentos aceitos somente até o dia 14/08! Após essa data, a venda ocorrerá no local por um valor de R$40"
        ],
        color:"green"
      },
      {
        title:"⚠️ Observações Importantes",
        items:[
          "Venha de verde!"
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