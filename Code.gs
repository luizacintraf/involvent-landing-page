function doGet(e) {
  // Verifica se está tentando abrir como arquivo do Drive
  const url = ScriptApp.getService().getUrl();
  if (url && url.includes('/view')) {
    return HtmlService.createHtmlOutputFromFile('redirect')
      .setTitle('Redirecionando...');
  }
  
  // Retorna a aplicação normal
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Involvent - Escola de Dança')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getSpreadsheetData(tabName) {
  try {
    // Usa a planilha ativa do projeto
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(tabName);
    
    if (!sheet) {
      return {
        success: false,
        error: `Aba "${tabName}" não encontrada`
      };
    }
    
    // Pega todos os dados da planilha
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    // Converte os dados em um array de objetos
    const rows = data.slice(1).map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        // Trata valores especiais
        let value = row[index];
        
        // Converte datas para string ISO
        if (value instanceof Date) {
          value = value.toISOString();
        }
        // Converte números para garantir que sejam do tipo number
        else if (typeof value === 'number' || !isNaN(value)) {
          value = Number(value);
        }
        
        obj[header] = value;
      });
      return obj;
    });
    
    return {
      success: true,
      data: rows,
      metadata: {
        total: rows.length,
        headers: headers,
        lastUpdate: new Date().toISOString()
      }
    };
    
  } catch (error) {
    // Log do erro para debug
    Logger.log('Erro ao acessar planilha: ' + error.toString());
    return {
      success: false,
      error: 'Erro ao acessar dados da planilha',
      details: error.toString()
    };
  }
}

function appendRows(sheetName, rows) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(sheetName);
    
    if (!sheet) {
      throw new Error(`Aba ${sheetName} não encontrada`);
    }
    
    // Pega os headers da planilha
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    Logger.log('Headers da planilha:', headers);
    Logger.log('Dados recebidos:', JSON.stringify(rows));
    
    // Formata as linhas de acordo com os headers
    const formattedRows = rows.map(row => {
      return headers.map(header => {
        const value = row[header] || '';
        Logger.log(`Mapeando header "${header}" para valor: ${value}`);
        return value;
      });
    });
    
    // Adiciona as linhas
    sheet.getRange(sheet.getLastRow() + 1, 1, formattedRows.length, headers.length)
      .setValues(formattedRows);
    
    return { success: true };
  } catch (error) {
    console.error('Erro ao salvar dados:', error);
    throw error;
  }
}

function uploadFile(base64Data) {
  try {
    Logger.log('Iniciando upload do arquivo');
    Logger.log('Tamanho do base64: ' + base64Data.length);
    
    // Cria uma pasta específica para os comprovantes se não existir
    const folderName = 'Comprovantes Ingressos';
    let folder = DriveApp.getFoldersByName(folderName);
    
    if (folder.hasNext()) {
      folder = folder.next();
      Logger.log('Pasta existente encontrada: ' + folder.getId());
    } else {
      folder = DriveApp.createFolder(folderName);
      Logger.log('Nova pasta criada: ' + folder.getId());
    }

    // Verifica se o base64 está no formato correto
    if (!base64Data || !base64Data.includes('base64,')) {
      throw new Error('Formato de base64 inválido');
    }

    // Extrai informações do base64
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error('Formato de base64 inválido - não foi possível extrair tipo e dados');
    }

    const mimeType = matches[1];
    const base64String = matches[2];
    
    Logger.log('Tipo do arquivo: ' + mimeType);
    Logger.log('Tamanho do base64 limpo: ' + base64String.length);

    // Decodifica o base64
    try {
      const decoded = Utilities.base64Decode(base64String);
      Logger.log('Base64 decodificado com sucesso. Tamanho: ' + decoded.length);
      
      const blob = Utilities.newBlob(decoded, mimeType, `comprovante_${new Date().getTime()}`);
      Logger.log('Blob criado com sucesso');
      
      // Salva o arquivo no Drive
      const file = folder.createFile(blob);
      Logger.log('Arquivo criado no Drive: ' + file.getId());
      
      // Configura permissões de visualização
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      Logger.log('Permissões configuradas');
      
      const fileUrl = file.getUrl();
      Logger.log('URL do arquivo: ' + fileUrl);

      return {
        success: true,
        fileUrl: fileUrl,
        fileId: file.getId(),
        mimeType: mimeType
      };
    } catch (decodeError) {
      Logger.log('Erro ao decodificar base64: ' + decodeError.toString());
      throw new Error('Falha ao decodificar base64: ' + decodeError.message);
    }
  } catch (error) {
    Logger.log('Erro no upload: ' + error.toString());
    return {
      success: false,
      error: error.message,
      details: error.toString()
    };
  }
}

function sendConfirmationEmail(data) {
  try {
    Logger.log('Iniciando envio de email');
    Logger.log('Dados recebidos:', JSON.stringify(data));
    
    if (!data.to || !data.orderId || !data.pedido) {
      throw new Error('Dados incompletos para envio do email');
    }
    
    const { to, orderId, pedido } = data;
    Logger.log('Email para:', to);
    Logger.log('OrderId:', orderId);
    Logger.log('Dados do pedido:', JSON.stringify(pedido));
    
    // Formata a lista de ingressos em HTML
    const ingressosList = pedido.participantes.map(participante => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <strong>${participante.tipo}</strong><br>
          <span style="color: #666;">Participante: ${participante.nome}</span><br>
          ${participante.unidade ? `<span style="color: #666;">Unidade: ${participante.unidade}</span>` : ''}
        </td>
      </tr>
    `).join('');
    Logger.log('Lista de ingressos HTML gerada');

    // Formata o valor total
    const totalFormatted = pedido.total.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
    Logger.log('Total formatado:', totalFormatted);

    // Template do email em HTML
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #4a5568; text-align: center; margin-bottom: 30px;">
          Confirmação de Compra - Involvent
        </h1>
        
        <div style="background-color: #f7fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <p style="margin-bottom: 10px;">Olá <strong>${pedido.dadosComprador.nome}</strong>,</p>
          <p style="margin-bottom: 20px;">Obrigado por comprar seus ingressos!</p>
          
          <div style="background-color: #ebf8ff; border: 1px solid #bee3f8; border-radius: 4px; padding: 10px; margin-bottom: 20px;">
            <p style="margin: 0; color: #2b6cb0;"><strong>Número do Pedido:</strong> ${orderId}</p>
          </div>
        </div>

        <div style="margin-bottom: 30px;">
          <h2 style="color: #4a5568; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">Detalhes da Compra</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <thead>
              <tr>
                <th style="text-align: left; padding: 10px; background-color: #f7fafc; border-bottom: 2px solid #e2e8f0;">
                  Ingressos
                </th>
              </tr>
            </thead>
            <tbody>
              ${ingressosList}
            </tbody>
            <tfoot>
              <tr>
                <td style="padding: 15px; text-align: right; border-top: 2px solid #e2e8f0;">
                  <strong>Total:</strong> ${totalFormatted}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div style="background-color: #f7fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px;">
          <h3 style="color: #4a5568; margin-top: 0;">Importante:</h3>
          <ul style="color: #4a5568; margin-bottom: 0;">
            <li>Guarde este número de pedido: ${orderId}</li>
            <li>Os nomes cadastrados nos ingressos estarão na portaria no dia do evento</li>
          </ul>
        </div>

        <div style="text-align: center; margin-top: 30px; color: #718096; font-size: 14px;">
          <p>Em caso de dúvidas, entre em contato conosco.</p>
          <p style="margin-top: 20px;">
            Atenciosamente,<br>
            <strong>Equipe Involvent</strong>
          </p>
        </div>
      </div>
    `;
    Logger.log('Template HTML do email gerado');

    // Prepara o texto plano
    const plainText = `
        Confirmação de Compra - Involvent
        
        Olá ${pedido.dadosComprador.nome},
        
        Obrigado por comprar seus ingressos!
        
        Número do Pedido: ${orderId}
        
        Detalhes da Compra:
        
        ${pedido.participantes.map(p => `
          - ${p.tipo}
            Participante: ${p.nome}
            ${p.unidade ? `Unidade: ${p.unidade}` : ''}
        `).join('\n')}
        
        Total: ${totalFormatted}
        
        Importante:
        - Guarde este número de pedido: ${orderId}
        - Apresente este email no dia do evento
        - Para ingressos que necessitam de verificação, aguarde nossa confirmação
        
        Em caso de dúvidas, entre em contato conosco.
        
        Atenciosamente,
        Equipe Involvent
    `;
    Logger.log('Texto plano do email gerado');

    try {
      // Envia o email
      Logger.log('Tentando enviar email para:', to);
      MailApp.sendEmail({
        to: to,
        subject: `Confirmação de Compra - Pedido ${orderId}`,
        htmlBody: htmlBody,
        body: plainText
      });
      Logger.log('Email enviado com sucesso para:', to);
    } catch (sendError) {
      Logger.log('Erro ao enviar email:', sendError.toString());
      throw new Error(`Falha ao enviar email: ${sendError.message}`);
    }

    return { success: true };
  } catch (error) {
    Logger.log('Erro no processo de email:', error.toString());
    return {
      success: false,
      error: 'Erro ao enviar email de confirmação',
      details: error.toString()
    };
  }
}

// Spreadsheet to store tokens
const TOKENS_SHEET_NAME = 'token';

function setupTokensSheet() {
  try {
    Logger.log('Iniciando setupTokensSheet...');
    const ss = SpreadsheetApp.getActive();
    Logger.log('Planilha ativa obtida: ' + ss.getName());
    
    let sheet = ss.getSheetByName(TOKENS_SHEET_NAME);
    Logger.log('Procurando aba "' + TOKENS_SHEET_NAME + '": ' + (sheet ? 'encontrada' : 'não encontrada'));
    
    if (!sheet) {
      Logger.log('Criando nova aba "' + TOKENS_SHEET_NAME + '"...');
      sheet = ss.insertSheet(TOKENS_SHEET_NAME);
      Logger.log('Aba criada com sucesso. ID: ' + sheet.getSheetId());
      
      Logger.log('Configurando headers...');
      sheet.getRange('A1:E1').setValues([['OrderNumber', 'Email', 'Token', 'CreatedAt', 'Used']]);
      sheet.setFrozenRows(1);
      Logger.log('Headers configurados');
    } else {
      Logger.log('Aba já existe. Última linha: ' + sheet.getLastRow());
    }
    
    return sheet;
  } catch (error) {
    Logger.log('ERRO em setupTokensSheet:', error.toString());
    throw error;
  }
}

function generateToken() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function requestEditToken(params) {
  try {
    Logger.log('=== INICIANDO REQUISIÇÃO DE TOKEN ===');
    Logger.log('Parâmetros recebidos:', JSON.stringify(params));
    Logger.log('Tipo dos parâmetros:', typeof params);

    // Extrai os parâmetros do objeto
    let orderNumber, email;
    
    if (typeof params === 'object' && params !== null) {
      orderNumber = params.orderNumber;
      email = params.email;
    } else {
      // Fallback para chamadas com parâmetros separados (compatibilidade)
      orderNumber = arguments[0];
      email = arguments[1];
    }

    Logger.log('Número do Pedido extraído: [' + orderNumber + ']');
    Logger.log('Email extraído: [' + email + ']');

    // Log dos parâmetros recebidos para debug
    Logger.log('Tipo do orderNumber:', typeof orderNumber);
    Logger.log('Tipo do email:', typeof email);
    Logger.log('orderNumber raw:', orderNumber);
    Logger.log('email raw:', email);

    // Validação e extração dos parâmetros
    let cleanOrderNumber, cleanEmail;

    // Trata o caso onde orderNumber pode ser um objeto
    if (typeof orderNumber === 'object' && orderNumber !== null) {
      // Se for um objeto, tenta extrair propriedades comuns
      if (orderNumber.orderNumber) {
        cleanOrderNumber = orderNumber.orderNumber.toString().trim();
      } else if (orderNumber.orderId) {
        cleanOrderNumber = orderNumber.orderId.toString().trim();
      } else if (orderNumber.id) {
        cleanOrderNumber = orderNumber.id.toString().trim();
      } else {
        Logger.log('ERRO: Objeto orderNumber não contém propriedades reconhecidas:', JSON.stringify(orderNumber));
        return { success: false, message: 'Formato do número do pedido inválido' };
      }
    } else if (orderNumber) {
      cleanOrderNumber = orderNumber.toString().trim();
    } else {
      Logger.log('ERRO: Número do pedido não fornecido');
      return { success: false, message: 'Número do pedido é obrigatório' };
    }

    // Trata o caso onde email pode ser um objeto
    if (typeof email === 'object' && email !== null) {
      if (email.email) {
        cleanEmail = email.email.toString().trim().toLowerCase();
      } else {
        Logger.log('ERRO: Objeto email não contém propriedade email:', JSON.stringify(email));
        return { success: false, message: 'Formato do email inválido' };
      }
    } else if (email) {
      cleanEmail = email.toString().trim().toLowerCase();
    } else {
      Logger.log('ERRO: Email não fornecido');
      return { success: false, message: 'Email é obrigatório' };
    }

    // Validação final
    if (!cleanOrderNumber || cleanOrderNumber === '') {
      Logger.log('ERRO: Número do pedido vazio após limpeza');
      return { success: false, message: 'Número do pedido é obrigatório' };
    }

    if (!cleanEmail || cleanEmail === '') {
      Logger.log('ERRO: Email vazio após limpeza');
      return { success: false, message: 'Email é obrigatório' };
    }

    Logger.log('Parâmetros limpos:');
    Logger.log('Order Number: [' + cleanOrderNumber + ']');
    Logger.log('Email: [' + cleanEmail + ']');

    // Get the orders sheet
    const ordersSheet = SpreadsheetApp.getActive().getSheetByName('ingressos');
    if (!ordersSheet) {
      Logger.log('ERRO: Aba "ingressos" não encontrada na planilha');
      return { success: false, message: 'Aba de pedidos não encontrada' };
    }

    Logger.log('=== DADOS DA PLANILHA ===');
    const ordersData = ordersSheet.getDataRange().getValues();
    Logger.log('Número total de linhas: ' + ordersData.length);
    
    // Log dos headers
    const headers = ordersData[0];
    Logger.log('Headers encontrados: [' + headers.join(', ') + ']');
    
    // Log das primeiras linhas
    Logger.log('Primeiras 3 linhas da planilha:');
    ordersData.slice(0, 3).forEach((row, index) => {
      Logger.log(`Linha ${index}: [${row.join(', ')}]`);
    });

    // Encontrar índices das colunas
    const orderNumberIndex = headers.findIndex(h => h.toString().toLowerCase().includes('order'));
    const emailIndex = headers.findIndex(h => h.toString().toLowerCase().includes('email') && !h.toString().toLowerCase().includes('vendido'));
    const emailVendidoIndex = headers.findIndex(h => h.toString().toLowerCase().includes('email_vendido'));

    Logger.log('=== ÍNDICES DAS COLUNAS ===');
    Logger.log('Índice da coluna Pedido: ' + orderNumberIndex);
    Logger.log('Índice da coluna Email: ' + emailIndex);
    Logger.log('Índice da coluna Email Vendido: ' + emailVendidoIndex);

    if (orderNumberIndex === -1 || emailIndex === -1) {
      Logger.log('ERRO: Colunas necessárias não encontradas');
      return { 
        success: false, 
        message: 'Estrutura da planilha inválida',
        debug: { headers, orderNumberIndex, emailIndex, emailVendidoIndex }
      };
    }

    // Procurar o pedido
    let found = false;
    let foundRow = null;
    
    ordersData.forEach((row, index) => {
      if (index === 0) return; // Pula o header
      
      const rowOrderNumber = row[orderNumberIndex]?.toString() || '';
      const rowEmail = row[emailIndex]?.toString() || '';
      const rowEmailVendido = emailVendidoIndex !== -1 ? (row[emailVendidoIndex]?.toString() || '') : '';
      
      Logger.log(`\nComparando linha ${index}:`);
      Logger.log('Pedido na planilha: [' + rowOrderNumber + ']');
      Logger.log('Email original na planilha: [' + rowEmail + ']');
      Logger.log('Email vendido na planilha: [' + rowEmailVendido + ']');
      Logger.log('Comparando com:');
      Logger.log('Pedido fornecido: [' + cleanOrderNumber + ']');
      Logger.log('Email fornecido: [' + cleanEmail + ']');
      
      // Verifica se o pedido corresponde E se o email corresponde ao original OU ao vendido
      const emailMatch = rowEmail.toLowerCase() === cleanEmail || 
                         (rowEmailVendido && rowEmailVendido.toLowerCase() === cleanEmail);
      
      if (rowOrderNumber === cleanOrderNumber && emailMatch) {
        found = true;
        foundRow = row;
        Logger.log('>>> PEDIDO ENCONTRADO NA LINHA ' + index);
        if (rowEmailVendido && rowEmailVendido.toLowerCase() === cleanEmail) {
          Logger.log('>>> ENCONTRADO PELO EMAIL VENDIDO');
        } else {
          Logger.log('>>> ENCONTRADO PELO EMAIL ORIGINAL');
        }
      }
    });

    if (!found) {
      Logger.log('ERRO: Pedido não encontrado');
      return { 
        success: false, 
        message: 'Pedido não encontrado ou email não corresponde. Verifique o número do pedido e use o email original da compra ou o email atualizado (se foi editado).',
        debug: { orderNumber: cleanOrderNumber, email: cleanEmail }
      };
    }

    // Generate and store token
    const token = generateToken();
    Logger.log('\n=== GERANDO TOKEN ===');
    Logger.log('Token gerado: ' + token);

    Logger.log('Configurando planilha de tokens...');
    const tokensSheet = setupTokensSheet();
    Logger.log('Planilha de tokens configurada. Nome: ' + tokensSheet.getName());
    
    Logger.log('Adicionando linha na planilha de tokens...');
    Logger.log('Dados a serem salvos:', [cleanOrderNumber, cleanEmail, token, new Date(), false]);
    
    try {
      tokensSheet.appendRow([
        cleanOrderNumber,
        cleanEmail,
        token,
        new Date(),
        false
      ]);
      Logger.log('Token salvo na planilha com sucesso');
      
      // Verifica se foi salvo
      const lastRow = tokensSheet.getLastRow();
      Logger.log('Última linha da planilha de tokens: ' + lastRow);
      
      if (lastRow > 1) {
        const savedData = tokensSheet.getRange(lastRow, 1, 1, 5).getValues()[0];
        Logger.log('Dados salvos verificados:', savedData);
      }
    } catch (saveError) {
      Logger.log('ERRO ao salvar token na planilha:', saveError.toString());
      return { success: false, message: 'Erro ao salvar token: ' + saveError.message };
    }

    // Send email with token
    const emailBody = `
      Olá,
      
      Recebemos sua solicitação para editar o pedido ${cleanOrderNumber}.
      
      Seu token de verificação é: ${token}
      
      Este token é válido por 30 minutos.
      
      Se você não solicitou esta alteração, por favor ignore este email.
      
      Atenciosamente,
      Equipe Involvent
    `;

    MailApp.sendEmail({
      to: cleanEmail,
      subject: `Token de Verificação - Pedido ${cleanOrderNumber}`,
      body: emailBody
    });
    Logger.log('Email enviado com sucesso');

    return { success: true };
  } catch (error) {
    Logger.log('\n=== ERRO NA EXECUÇÃO ===');
    Logger.log('Mensagem: ' + error.message);
    Logger.log('Stack: ' + error.stack);
    return { 
      success: false, 
      message: 'Erro ao gerar token: ' + error.message,
      debug: { error: error.message, stack: error.stack }
    };
  }
}

function verifyEditToken(params) {
  try {
    Logger.log('Iniciando verifyEditToken');
    Logger.log('Parâmetros recebidos:', JSON.stringify(params));
    Logger.log('Tipo dos parâmetros:', typeof params);

    // Extrai os parâmetros do objeto
    let orderNumber, token;
    
    if (typeof params === 'object' && params !== null) {
      orderNumber = params.orderNumber;
      token = params.token;
    } else {
      // Fallback para chamadas com parâmetros separados (compatibilidade)
      orderNumber = arguments[0];
      token = arguments[1];
    }

    Logger.log('orderNumber extraído:', orderNumber);
    Logger.log('token extraído:', token);

    // Log dos parâmetros recebidos para debug
    Logger.log('Tipo do orderNumber:', typeof orderNumber);
    Logger.log('Tipo do token:', typeof token);
    Logger.log('orderNumber raw:', orderNumber);
    Logger.log('token raw:', token);

    // Validação e extração dos parâmetros
    let cleanOrderNumber, cleanToken;

    // Trata o caso onde orderNumber pode ser um objeto
    if (typeof orderNumber === 'object' && orderNumber !== null) {
      if (orderNumber.orderNumber) {
        cleanOrderNumber = orderNumber.orderNumber.toString().trim();
      } else if (orderNumber.orderId) {
        cleanOrderNumber = orderNumber.orderId.toString().trim();
      } else if (orderNumber.id) {
        cleanOrderNumber = orderNumber.id.toString().trim();
      } else {
        Logger.log('ERRO: Objeto orderNumber não contém propriedades reconhecidas:', JSON.stringify(orderNumber));
        return { success: false, message: 'Formato do número do pedido inválido' };
      }
    } else if (orderNumber) {
      cleanOrderNumber = orderNumber.toString().trim();
    } else {
      Logger.log('Erro: Número do pedido não fornecido');
      return { success: false, message: 'Número do pedido é obrigatório' };
    }

    // Trata o caso onde token pode ser um objeto
    if (typeof token === 'object' && token !== null) {
      if (token.token) {
        cleanToken = token.token.toString().trim().toUpperCase();
      } else {
        Logger.log('ERRO: Objeto token não contém propriedade token:', JSON.stringify(token));
        return { success: false, message: 'Formato do token inválido' };
      }
    } else if (token) {
      cleanToken = token.toString().trim().toUpperCase();
    } else {
      Logger.log('Erro: Token não fornecido');
      return { success: false, message: 'Token é obrigatório' };
    }

    // Validação final
    if (!cleanOrderNumber || cleanOrderNumber === '') {
      Logger.log('Erro: Número do pedido vazio após limpeza');
      return { success: false, message: 'Número do pedido é obrigatório' };
    }

    if (!cleanToken || cleanToken === '') {
      Logger.log('Erro: Token vazio após limpeza');
      return { success: false, message: 'Token é obrigatório' };
    }

    Logger.log('Parâmetros limpos:');
    Logger.log('Order Number: [' + cleanOrderNumber + ']');
    Logger.log('Token: [' + cleanToken + ']');

    const tokensSheet = SpreadsheetApp.getActive().getSheetByName(TOKENS_SHEET_NAME);
    if (!tokensSheet) {
      Logger.log('Erro: Planilha de tokens não encontrada');
      return { success: false, message: 'Planilha de tokens não encontrada' };
    }

    const tokensData = tokensSheet.getDataRange().getValues();
    Logger.log('Total de tokens encontrados:', tokensData.length);
    
    // Find the most recent token for this order
    const tokenRow = tokensData
      .slice(1) // Skip header row
      .reverse() // Get most recent first
      .find(row => {
        Logger.log('Verificando token:', {
          rowOrderNumber: row[0]?.toString(),
          rowToken: row[2]?.toString(),
          rowUsed: row[4],
          providedOrderNumber: cleanOrderNumber,
          providedToken: cleanToken
        });
        return row[0]?.toString() === cleanOrderNumber && 
               row[2]?.toString() === cleanToken &&
               !row[4]; // Not used
      });

    Logger.log('Token encontrado:', tokenRow ? 'Sim' : 'Não');

    if (!tokenRow) {
      Logger.log('Token inválido ou expirado');
      return { success: false, message: 'Token inválido ou expirado.' };
    }

    const createdAt = new Date(tokenRow[3]);
    const now = new Date();
    const minutesDiff = (now - createdAt) / (1000 * 60);

    Logger.log('Minutos desde a criação:', minutesDiff);

    if (minutesDiff > 30) {
      Logger.log('Token expirado');
      return { success: false, message: 'Token expirado.' };
    }

    // Mark token as used
    const tokenIndex = tokensData.findIndex(row => 
      row[0]?.toString() === cleanOrderNumber && 
      row[2]?.toString() === cleanToken
    );
    Logger.log('Índice do token para marcar como usado:', tokenIndex);

    tokensSheet.getRange(tokenIndex + 1, 5).setValue(true);
    Logger.log('Token marcado como usado');

    // Get order data
    const ordersSheet = SpreadsheetApp.getActive().getSheetByName('ingressos');
    if (!ordersSheet) {
      Logger.log('Erro: Aba "ingressos" não encontrada');
      return { success: false, message: 'Aba "ingressos" não encontrada' };
    }

    Logger.log('Buscando dados do pedido...');
    const ordersData = ordersSheet.getDataRange().getValues();
    const headers = ordersData[0];
    
    Logger.log('Headers da planilha ingressos:', headers);
    
    // Encontra os índices corretos das colunas
    const orderIndex = headers.findIndex(h => h.toString().toLowerCase().includes('order'));
    const nomeCompradorIndex = headers.findIndex(h => h.toString().toLowerCase().includes('nome_comprador'));
    const emailIndex = headers.findIndex(h => h.toString().toLowerCase().includes('email'));
    const nomeParticipanteIndex = headers.findIndex(h => h.toString().toLowerCase().includes('nome_participante'));
    const unidadeIndex = headers.findIndex(h => h.toString().toLowerCase().includes('unidade'));
    const tipoIndex = headers.findIndex(h => h.toString().toLowerCase().includes('tipo'));
    
    Logger.log('Índices encontrados:', {
      orderIndex,
      nomeCompradorIndex,
      emailIndex,
      nomeParticipanteIndex,
      unidadeIndex,
      tipoIndex
    });
    
    const orderData = ordersData.find(row => row[orderIndex]?.toString() === cleanOrderNumber);

    Logger.log('Dados do pedido encontrados:', orderData ? 'Sim' : 'Não');
    if (orderData) {
      Logger.log('Dados brutos do pedido:', orderData);
    }

    if (!orderData) {
      Logger.log('Pedido não encontrado');
      return { success: false, message: 'Pedido não encontrado.' };
    }

    // Return order data for editing
    const response = {
      success: true,
      orderData: {
        orderNumber: orderData[orderIndex],
        nomeComprador: orderData[nomeCompradorIndex],
        email: orderData[emailIndex],
        nomeParticipante: orderData[nomeParticipanteIndex],
        unidade: orderData[unidadeIndex],
        tipo: orderData[tipoIndex]
      }
    };
    Logger.log('Retornando dados:', JSON.stringify(response));
    return response;

  } catch (error) {
    Logger.log('ERRO em verifyEditToken:');
    Logger.log('Mensagem:', error.message);
    Logger.log('Stack:', error.stack);
    return { 
      success: false, 
      message: 'Erro ao verificar token.',
      error: error.message,
      stack: error.stack 
    };
  }
}

function getOrderData(orderNumber) {
  try {
    Logger.log('Buscando dados do pedido:', orderNumber);
    
    const sheet = SpreadsheetApp.getActive().getSheetByName('ingressos');
    if (!sheet) {
      throw new Error('Aba de ingressos não encontrada');
    }

    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    // Encontra o índice das colunas necessárias
    const orderIndex = headers.findIndex(h => h.toString().toLowerCase().includes('order'));
    const nomeCompradorIndex = headers.findIndex(h => h.toString().toLowerCase().includes('nome_comprador'));
    const emailIndex = headers.findIndex(h => h.toString().toLowerCase().includes('email'));
    const nomeParticipanteIndex = headers.findIndex(h => h.toString().toLowerCase().includes('nome_participante'));
    const unidadeIndex = headers.findIndex(h => h.toString().toLowerCase().includes('unidade'));
    const tipoIndex = headers.findIndex(h => h.toString().toLowerCase().includes('tipo'));
    const valorIndex = headers.findIndex(h => h.toString().toLowerCase().includes('valor'));

    // Filtra as linhas do pedido
    const orderRows = data.slice(1).filter(row => row[orderIndex]?.toString() === orderNumber.toString());

    if (!orderRows.length) {
      throw new Error('Pedido não encontrado');
    }

    // Monta o objeto do pedido
    const pedido = {
      dadosComprador: {
        nome: orderRows[0][nomeCompradorIndex],
        email: orderRows[0][emailIndex]
      },
      participantes: orderRows.map(row => ({
        nome: row[nomeParticipanteIndex],
        tipo: row[tipoIndex],
        unidade: row[unidadeIndex] || ''
      })),
      total: orderRows.reduce((total, row) => total + (Number(row[valorIndex]) || 0), 0)
    };

    return {
      success: true,
      data: pedido
    };

  } catch (error) {
    Logger.log('Erro ao buscar dados do pedido:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

function resendOrderEmail(orderNumber) {
  try {
    Logger.log('Iniciando reenvio de email para o pedido:', orderNumber);
    
    // Busca os dados do pedido
    const orderData = getOrderData(orderNumber);
    if (!orderData.success) {
      throw new Error(orderData.error || 'Erro ao buscar dados do pedido');
    }

    const pedido = orderData.data;
    
    // Envia o email usando a função existente
    const emailResponse = sendConfirmationEmail({
      to: pedido.dadosComprador.email,
      orderId: orderNumber,
      pedido: pedido
    });

    if (!emailResponse.success) {
      throw new Error(emailResponse.error || 'Erro ao enviar email');
    }

    return {
      success: true,
      message: 'Email reenviado com sucesso'
    };

  } catch (error) {
    Logger.log('Erro ao reenviar email:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

function getOrderTickets(orderNumber) {
  try {
    Logger.log('Buscando ingressos do pedido:', orderNumber);
    
    const sheet = SpreadsheetApp.getActive().getSheetByName('ingressos');
    if (!sheet) {
      throw new Error('Aba de ingressos não encontrada');
    }

    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    Logger.log('Headers encontrados:', headers);
    
    // Encontra os índices das colunas
    const orderIndex = headers.findIndex(h => h.toString().toLowerCase().includes('order'));
    const nomeCompradorIndex = headers.findIndex(h => h.toString().toLowerCase().includes('nome_comprador'));
    const emailIndex = headers.findIndex(h => h.toString().toLowerCase().includes('email'));
    const nomeParticipanteIndex = headers.findIndex(h => h.toString().toLowerCase().includes('nome_participante'));
    const unidadeIndex = headers.findIndex(h => h.toString().toLowerCase().includes('unidade'));
    const tipoIndex = headers.findIndex(h => h.toString().toLowerCase().includes('tipo'));
    
    Logger.log('Índices das colunas:', {
      orderIndex,
      nomeCompradorIndex,
      emailIndex,
      nomeParticipanteIndex,
      unidadeIndex,
      tipoIndex
    });

    // Filtra as linhas do pedido
    const orderTickets = data.slice(1).filter(row => row[orderIndex]?.toString() === orderNumber.toString());

    if (!orderTickets.length) {
      throw new Error('Nenhum ingresso encontrado para este pedido');
    }

    // Monta o array de ingressos
    const ingressos = orderTickets.map((row, index) => ({
      rowIndex: data.indexOf(row), // Índice da linha na planilha
      order: row[orderIndex],
      nome_comprador: row[nomeCompradorIndex],
      email: row[emailIndex],
      nome_participante: row[nomeParticipanteIndex],
      unidade: row[unidadeIndex] || '',
      tipo: row[tipoIndex]
    }));

    Logger.log('Ingressos encontrados:', ingressos.length);

    return {
      success: true,
      data: ingressos
    };

  } catch (error) {
    Logger.log('Erro ao buscar ingressos:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

function updateTicket(params) {
  try {
    Logger.log('=== INICIANDO ATUALIZAÇÃO DE INGRESSO ===');
    Logger.log('Parâmetros recebidos:', JSON.stringify(params));

    // Extrai os parâmetros
    const { orderNumber, originalData, newName, newEmail } = params;

    if (!orderNumber || !originalData || !newName || !newEmail) {
      throw new Error('Parâmetros obrigatórios não fornecidos');
    }

    const sheet = SpreadsheetApp.getActive().getSheetByName('ingressos');
    if (!sheet) {
      throw new Error('Aba de ingressos não encontrada');
    }

    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    // Encontra os índices das colunas
    const orderIndex = headers.findIndex(h => h.toString().toLowerCase().includes('order'));
    const nomeCompradorIndex = headers.findIndex(h => h.toString().toLowerCase().includes('nome_comprador'));
    const emailIndex = headers.findIndex(h => h.toString().toLowerCase().includes('email'));
    const nomeParticipanteIndex = headers.findIndex(h => h.toString().toLowerCase().includes('nome_participante'));
    const unidadeIndex = headers.findIndex(h => h.toString().toLowerCase().includes('unidade'));
    const tipoIndex = headers.findIndex(h => h.toString().toLowerCase().includes('tipo'));
    
    // Verifica se as colunas nome_antigo e email_vendido existem
    let nomeAntigoIndex = headers.findIndex(h => h.toString().toLowerCase().includes('nome_antigo'));
    let emailVendidoIndex = headers.findIndex(h => h.toString().toLowerCase().includes('email_vendido'));
    
    // Se as colunas não existem, adiciona elas
    if (nomeAntigoIndex === -1) {
      headers.push('nome_antigo');
      nomeAntigoIndex = headers.length - 1;
      sheet.getRange(1, nomeAntigoIndex + 1).setValue('nome_antigo');
    }
    
    if (emailVendidoIndex === -1) {
      headers.push('email_vendido');
      emailVendidoIndex = headers.length - 1;
      sheet.getRange(1, emailVendidoIndex + 1).setValue('email_vendido');
    }

    Logger.log('Índices das colunas:', {
      orderIndex,
      nomeCompradorIndex,
      emailIndex,
      nomeParticipanteIndex,
      unidadeIndex,
      tipoIndex,
      nomeAntigoIndex,
      emailVendidoIndex
    });

    // Encontra a linha específica do ingresso
    const targetRowIndex = data.findIndex((row, index) => {
      if (index === 0) return false; // Pula header
      return row[orderIndex]?.toString() === orderNumber.toString() &&
             row[nomeParticipanteIndex]?.toString() === originalData.nome_participante &&
             row[tipoIndex]?.toString() === originalData.tipo;
    });

    if (targetRowIndex === -1) {
      throw new Error('Ingresso específico não encontrado');
    }

    Logger.log('Linha encontrada:', targetRowIndex + 1);

    // Salva o nome antigo e atualiza os dados
    const oldName = data[targetRowIndex][nomeParticipanteIndex];
    const oldEmail = data[targetRowIndex][emailIndex];
    
    // Atualiza a linha na planilha
    sheet.getRange(targetRowIndex + 1, nomeAntigoIndex + 1).setValue(oldName);
    sheet.getRange(targetRowIndex + 1, emailVendidoIndex + 1).setValue(newEmail);
    sheet.getRange(targetRowIndex + 1, nomeParticipanteIndex + 1).setValue(newName);

    Logger.log('Dados atualizados na planilha');

    // Envia emails de notificação
    try {
      // Email para o email cadastrado (antigo)
      const emailAntigoBody = `
        Olá,
        
        Informamos que houve uma alteração no ingresso do pedido ${orderNumber}.
        
        Detalhes da alteração:
        - Tipo do ingresso: ${originalData.tipo}
        - Nome anterior: ${oldName}
        - Novo nome: ${newName}
        - Novo email: ${newEmail}
        
        Esta alteração foi solicitada através do sistema de edição de pedidos.
        
        Se você não solicitou esta alteração, entre em contato conosco imediatamente.
        
        Atenciosamente,
        Equipe Involvent
      `;

      MailApp.sendEmail({
        to: oldEmail,
        subject: `Alteração no Pedido ${orderNumber} - Involvent`,
        body: emailAntigoBody
      });

      // Email para o novo email
      const emailNovoBody = `
        Olá ${newName},
        
        Seu ingresso foi atualizado com sucesso!
        
        Detalhes do seu ingresso:
        - Pedido: ${orderNumber}
        - Tipo: ${originalData.tipo}
        - Nome: ${newName}
        - Email: ${newEmail}
        
        Guarde este número de pedido para apresentar no dia do evento.
        
        Atenciosamente,
        Equipe Involvent
      `;

      MailApp.sendEmail({
        to: newEmail,
        subject: `Confirmação de Ingresso - Pedido ${orderNumber} - Involvent`,
        body: emailNovoBody
      });

      Logger.log('Emails de notificação enviados');
    } catch (emailError) {
      Logger.log('Erro ao enviar emails:', emailError.toString());
      // Não falha a operação se o email não for enviado
    }

    return {
      success: true,
      message: 'Ingresso atualizado com sucesso'
    };

  } catch (error) {
    Logger.log('Erro ao atualizar ingresso:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Funções para a landing page da Involvent
function getScheduleData() {
  return getSpreadsheetData('schedule');
}

function getNextDateForDay(dayName) {
  const today = new Date();
  const dayMap = {
    'Segunda': 1,
    'Terça': 2,
    'Quarta': 3,
    'Quinta': 4,
    'Sexta': 5,
    'Sábado': 6,
    'Domingo': 0
  };
  
  const targetDay = dayMap[dayName];
  if (targetDay === undefined) return '';
  
  const daysUntilTarget = (targetDay - today.getDay() + 7) % 7;
  const nextDate = new Date(today);
  nextDate.setDate(today.getDate() + (daysUntilTarget === 0 ? 7 : daysUntilTarget));
  
  return nextDate.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

// Função para obter arquivo do Drive pelo nome
function getAttachmentFile() {
  try {
    const fileName = 'horarios.jpeg';
    const files = DriveApp.getFilesByName(fileName);
    
    if (files.hasNext()) {
      const file = files.next();
      Logger.log('Arquivo encontrado:', file.getName());
      return file;
    } else {
      Logger.log('Arquivo não encontrado:', fileName);
      return null;
    }
  } catch (error) {
    Logger.log('Erro ao buscar arquivo:', error);
    return null;
  }
}

function saveExperimentalEnrollment(enrollmentData) {
  try {
    // Obter dados da semana gratuita para determinar o tipo de semana
    const freeWeekResponse = getFreeWeekData();
    console.log('freeWeekResponse:', freeWeekResponse);
    const isFreeWeek = freeWeekResponse.success && freeWeekResponse.data.isNearFreeWeek;
    console.log('isFreeWeek:', isFreeWeek);
    
    // Calcular datas baseadas no tipo de semana
    let semanaInfo = '';
    if (isFreeWeek) {
      // Semana gratuita - usar datas da planilha
      semanaInfo = `${freeWeekResponse.data.inicio} a ${freeWeekResponse.data.fim}`;
      console.log('Semana gratuita - semanaInfo:', semanaInfo);
    } else {
      // Semana experimental - próxima segunda-feira
      const hoje = new Date();
      const proximaSegunda = new Date(hoje);
      proximaSegunda.setDate(hoje.getDate() + (1 + 7 - hoje.getDay()) % 7); // Próxima segunda
      
      const fimSemana = new Date(proximaSegunda);
      fimSemana.setDate(proximaSegunda.getDate() + 4); // Sexta-feira
      
      semanaInfo = `${proximaSegunda.toLocaleDateString('pt-BR')} a ${fimSemana.toLocaleDateString('pt-BR')}`;
      console.log('Semana experimental - semanaInfo:', semanaInfo);
    }
    
    console.log('Final semanaInfo:', semanaInfo);
    
    // Criar uma linha para cada aula inscrita
    const rowsToSave = [];
    
    const tipoSemana = isFreeWeek ? 'Semana Presencial Gratuita' : 'Semana Experimental';
    
    if (enrollmentData.aulas_inscritas && enrollmentData.aulas_inscritas.length > 0) {
      enrollmentData.aulas_inscritas.forEach(aula => {
        rowsToSave.push({
          nome: enrollmentData.nome,
          email: enrollmentData.email,
          telefone: enrollmentData.telefone,
          nivel_experiencia: enrollmentData.nivel_experiencia,
          quantidade_aulas: enrollmentData.quantidade_aulas,
          modalidade: aula.modalidade,
          dia: aula.dia,
          horario: aula.horario,
          professor: aula.professor,
          nivel: aula.nivel || enrollmentData.nivel_experiencia, // Usar nível da aula ou do enrollment
          data: aula.data || semanaInfo, // Usar data da aula ou período da semana
          week: tipoSemana,
          periodo: semanaInfo,
          data_inscricao: new Date().toLocaleDateString('pt-BR')
        });
      });
    } else {
      // Se não há aulas específicas, salva apenas os dados básicos
      rowsToSave.push({
        nome: enrollmentData.nome,
        email: enrollmentData.email,
        telefone: enrollmentData.telefone,
        nivel_experiencia: enrollmentData.nivel_experiencia,
        quantidade_aulas: tipoSemana,
        modalidade: enrollmentData.modalidade || '',
        dia: '',
        horario: '',
        professor: '',
        nivel: enrollmentData.nivel_experiencia, // Salvar o nível aqui também
        data: semanaInfo, // Salvar o período da semana aqui
        week: tipoSemana,
        periodo: semanaInfo,
        data_inscricao: new Date().toLocaleDateString('pt-BR')
      });
    }
    
    const result = appendRows('experimental', rowsToSave);
    
    // Formatar modalidades para o email
    const modalidadesFormatadas = enrollmentData.modalidade ? 
      `Modalidades de interesse: ${enrollmentData.modalidade}` : 
      'Nenhuma modalidade específica selecionada';
    
    // Enviar email de notificação
    console.log('Enviando email - tipoSemana:', tipoSemana, 'semanaInfo:', semanaInfo);
    const emailBody = `
Nova inscrição para ${tipoSemana}!

Nome: ${enrollmentData.nome}
Email: ${enrollmentData.email}
Telefone: ${enrollmentData.telefone}
Nível de experiência: ${enrollmentData.nivel_experiencia}

${modalidadesFormatadas}

Período: ${semanaInfo}

Data da inscrição: ${new Date().toLocaleDateString('pt-BR')}
    `;
    
    try {
      // Email para a escola
      MailApp.sendEmail({
        to: 'contato.involvent@gmail.com.br',
        subject: `Nova inscrição - ${tipoSemana}`,
        body: emailBody
      });
      
      // Email de confirmação para o aluno
      const whatsappLink = isFreeWeek ? freeWeekResponse.data.wppLink : 'https://wa.me/5519998882451';
      const studentEmailBody = `
Olá ${enrollmentData.nome}!

Obrigado por se inscrever na ${tipoSemana} da Involvent! 🎉

Detalhes da sua inscrição:
• Nível de experiência: ${enrollmentData.nivel_experiencia}
• ${modalidadesFormatadas}
• Período: ${semanaInfo}

📱 ENTRE NO NOSSO GRUPO EXCLUSIVO!
Faça parte da nossa comunidade e receba todas as novidades:
${whatsappLink}

Entraremos em contato em breve para confirmar sua presença e fornecer mais detalhes sobre as aulas.

Localização:
Rua Dr. Antônio Castro Prado, 135
Taquaral, Campinas - SP

WhatsApp: (19) 99888-2451

Atenciosamente,
Equipe Involvent - Escola de Dança
      `;
      
      // Obter arquivo do Google Drive para anexar
      let attachment = null;
      const file = getAttachmentFile();
      if (file) {
        try {
          attachment = file.getBlob();
          Logger.log('Arquivo anexado com sucesso:', file.getName());
        } catch (attachmentError) {
          Logger.log('Erro ao obter blob do arquivo:', attachmentError);
        }
      }

      const emailOptions = {
        to: enrollmentData.email,
        subject: `Confirmação de Inscrição - ${tipoSemana} Involvent`,
        body: studentEmailBody
      };

      // Adicionar anexo se disponível
      if (attachment) {
        emailOptions.attachments = [attachment];
      }

      MailApp.sendEmail(emailOptions);
      
    } catch (emailError) {
      Logger.log('Erro ao enviar email:', emailError);
    }
    
    return { success: true, message: 'Inscrição realizada com sucesso!' };
  } catch (error) {
    console.error('Erro ao salvar inscrição:', error);
    return { success: false, error: error.toString() };
  }
}

function saveContactForm(contactData) {
  try {
    const rowToSave = {
      nome: contactData.name,
      email: contactData.email,
      telefone: contactData.phone,
      interesse: contactData.interest,
      mensagem: contactData.message,
      data_contato: new Date().toLocaleDateString('pt-BR'),
      hora_contato: new Date().toLocaleTimeString('pt-BR')
    };
    
    const result = appendRows('contact', [rowToSave]);
    
    // Enviar email de notificação
    const emailBody = `
Nova mensagem de contato!

Nome: ${contactData.name}
Email: ${contactData.email}
Telefone: ${contactData.phone}
Interesse: ${contactData.interest}

Mensagem:
${contactData.message}

Data do contato: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}
    `;
    
    try {
      MailApp.sendEmail({
        to: 'contato@involvent.com.br',
        subject: 'Nova mensagem de contato - Site Involvent',
        body: emailBody
      });
    } catch (emailError) {
      Logger.log('Erro ao enviar email de contato:', emailError);
    }
    
    return { success: true, message: 'Mensagem enviada com sucesso!' };
  } catch (error) {
    console.error('Erro ao salvar contato:', error);
    return { success: false, error: error.toString() };
  }
}

// Função para servir imagens do Google Drive
function getDriveImage(fileId) {
  try {
    const file = DriveApp.getFileById(fileId);
    const blob = file.getBlob();
    
    // Converte para base64 corretamente
    const base64Data = Utilities.base64Encode(blob.getBytes());
    
    return {
      success: true,
      data: base64Data,
      mimeType: blob.getContentType()
    };
  } catch (error) {
    Logger.log('Erro ao carregar imagem:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

// Função para salvar dados de contato
function saveContactData(contactData) {
  try {
    const rowToSave = {
      nome: contactData.nome,
      email: contactData.email,
      telefone: contactData.telefone,
      mensagem: contactData.mensagem,
      data: contactData.data
    };
    
    const result = appendRows('contact', [rowToSave]);
    
    // Enviar email de notificação
    const emailBody = `
Nova mensagem de contato via WhatsApp!

Nome: ${contactData.nome}
Email: ${contactData.email}
Telefone: ${contactData.telefone}

Mensagem:
${contactData.mensagem}

Data do contato: ${contactData.data}
    `;
    
    try {
      MailApp.sendEmail({
        to: 'contato@involvent.com.br',
        subject: 'Nova mensagem de contato via WhatsApp - Site Involvent',
        body: emailBody
      });
    } catch (emailError) {
      Logger.log('Erro ao enviar email de contato:', emailError);
    }
    
    return { success: true, message: 'Dados salvos com sucesso!' };
  } catch (error) {
    console.error('Erro ao salvar contato:', error);
    return { success: false, error: error.toString() };
  }
}

// Função de teste para verificar a aba free_week_planning
function testFreeWeekSheet() {
  try {
    let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('free_week_planning');
    
    if (!sheet) {
      console.log('Aba free_week_planning não encontrada, criando...');
      // Criar a aba automaticamente
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('free_week_planning');
      
      // Adicionar cabeçalhos
      sheet.getRange(1, 1, 1, 4).setValues([['Periodo', 'Inicio', 'Fim', 'wppLink']]);
      
      // Adicionar dados de exemplo (4o Trimestre)
      sheet.getRange(2, 1, 1, 4).setValues([['4o Trimestre', '29/09/2024', '04/10/2024', 'https://chat.whatsapp.com/E5L2HLzzDj19UzmrLsfYYm?mode=ems_copy_t']]);
      
      console.log('Aba free_week_planning criada com sucesso');
    }

    const data = sheet.getDataRange().getValues();
    console.log('Dados da aba free_week_planning:', data);
    
    return {
      success: true,
      data: data,
      rowCount: data.length
    };
  } catch (error) {
    console.error('Erro ao testar/criar aba:', error);
    return { success: false, error: error.toString() };
  }
}

// Função para obter dados da semana gratuita
function getFreeWeekData() {
  try {
    let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('free_week_planning');
    
    if (!sheet) {
      console.log('Aba free_week_planning não encontrada, criando...');
      // Criar a aba automaticamente
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('free_week_planning');
      
      // Adicionar cabeçalhos
      sheet.getRange(1, 1, 1, 4).setValues([['Periodo', 'Inicio', 'Fim', 'wppLink']]);
      
      // Adicionar dados de exemplo (4o Trimestre)
      sheet.getRange(2, 1, 1, 4).setValues([['4o Trimestre', '29/09/2024', '04/10/2024', 'https://chat.whatsapp.com/E5L2HLzzDj19UzmrLsfYYm?mode=ems_copy_t']]);
      
      console.log('Aba free_week_planning criada com sucesso');
    }

    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) {
      return { success: false, error: 'Nenhum dado encontrado' };
    }

    // Pega a primeira linha de dados (ignorando cabeçalho)
    const row = data[1];
    
    // Verificar se a linha tem dados suficientes
    if (!row || row.length < 4) {
      console.error('Linha de dados incompleta:', row);
      return { success: false, error: 'Dados da semana gratuita incompletos' };
    }
    
    const periodo = row[0] || '';
    let inicio = row[1] || '';
    let fim = row[2] || '';
    const wppLink = row[3] || 'https://wa.me/5519998882451';
    
    // Converter para string se necessário
    if (inicio && typeof inicio !== 'string') {
      console.log('Convertendo inicio para string:', inicio, 'tipo:', typeof inicio);
      inicio = String(inicio);
    }
    
    if (fim && typeof fim !== 'string') {
      console.log('Convertendo fim para string:', fim, 'tipo:', typeof fim);
      fim = String(fim);
    }
    
    console.log('Dados extraídos:', { periodo, inicio, fim, wppLink });

    // Converter datas para verificar proximidade
    const hoje = new Date();
    
    // Converter formato DD/MM/YYYY para Date
    const parseDate = (dateStr) => {
      console.log('parseDate recebeu:', dateStr, 'tipo:', typeof dateStr);
      
      // Verificar se é uma string válida
      if (!dateStr || typeof dateStr !== 'string') {
        console.error('Data inválida (não é string):', dateStr, 'tipo:', typeof dateStr);
        return new Date(); // Retorna data atual como fallback
      }
      
      // Verificar se tem o formato correto
      if (!dateStr.includes('/')) {
        console.error('Formato de data inválido (sem /):', dateStr);
        return new Date(); // Retorna data atual como fallback
      }
      
      try {
        const parts = dateStr.split('/');
        console.log('Parts após split:', parts);
        
        if (parts.length !== 3) {
          console.error('Data deve ter formato DD/MM/YYYY:', dateStr, 'parts:', parts);
          return new Date(); // Retorna data atual como fallback
        }
        
        const [day, month, year] = parts;
        const result = new Date(year, month - 1, day); // month é 0-indexed
        console.log('Data parseada:', result);
        return result;
      } catch (error) {
        console.error('Erro ao fazer split:', error, 'dateStr:', dateStr);
        return new Date(); // Retorna data atual como fallback
      }
    };
    
    const dataInicio = parseDate(inicio);
    const dataFim = parseDate(fim);
    
    // Verificar se as datas são válidas
    if (isNaN(dataInicio.getTime()) || isNaN(dataFim.getTime())) {
      console.error('Datas inválidas após parsing:', { inicio, fim, dataInicio, dataFim });
      
      // Se as datas são inválidas, usar dados padrão para 4o trimestre
      console.log('Usando dados padrão para 4o trimestre');
      const hoje = new Date();
      const dataInicioPadrao = new Date(2024, 8, 29); // 29/09/2024
      const dataFimPadrao = new Date(2024, 9, 4); // 04/10/2024
      
      const diasParaInicio = Math.ceil((dataInicioPadrao - hoje) / (1000 * 60 * 60 * 24));
      const diasParaFim = Math.ceil((dataFimPadrao - hoje) / (1000 * 60 * 60 * 24));
      
      const isNearFreeWeek = (diasParaInicio >= 0 && diasParaInicio <= 30) || (diasParaInicio <= 0 && diasParaFim >= 0);
      
      return {
        success: true,
        data: {
          periodo: '4o Trimestre',
          inicio: '29/09/2024',
          fim: '04/10/2024',
          wppLink: 'https://chat.whatsapp.com/E5L2HLzzDj19UzmrLsfYYm?mode=ems_copy_t',
          isNearFreeWeek,
          diasParaInicio,
          diasParaFim,
          isActive: diasParaInicio <= 0 && diasParaFim >= 0,
          isUpcoming: diasParaInicio > 0 && diasParaInicio <= 30
        }
      };
    }
    
    // Calcular diferença em dias
    const diasParaInicio = Math.ceil((dataInicio - hoje) / (1000 * 60 * 60 * 24));
    const diasParaFim = Math.ceil((dataFim - hoje) / (1000 * 60 * 60 * 24));
    
    // Log para debug
    console.log('Debug Free Week:', {
      hoje: hoje.toLocaleDateString('pt-BR'),
      inicio: inicio,
      fim: fim,
      dataInicio: dataInicio.toLocaleDateString('pt-BR'),
      dataFim: dataFim.toLocaleDateString('pt-BR'),
      diasParaInicio,
      diasParaFim
    });
    
    // Verificar se está dentro de 1 mês antes do início OU se já começou e ainda não terminou
    const isNearFreeWeek = (diasParaInicio >= 0 && diasParaInicio <= 30) || (diasParaInicio <= 0 && diasParaFim >= 0);

    // Formatar datas para DD/MM/YYYY
    const formatDate = (dateStr) => {
      if (!dateStr) return '';
      
      // Se já é uma string no formato DD/MM/YYYY, retorna como está
      if (typeof dateStr === 'string' && dateStr.includes('/') && dateStr.length <= 10) {
        return dateStr;
      }
      
      // Se é um objeto Date ou string de data, converte
      try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return '';
        
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        
        return `${day}/${month}/${year}`;
      } catch (error) {
        console.error('Erro ao formatar data:', error, 'dateStr:', dateStr);
        return '';
      }
    };

    return {
      success: true,
      data: {
        periodo: String(periodo),
        inicio: formatDate(inicio),
        fim: formatDate(fim),
        wppLink: String(wppLink),
        isNearFreeWeek,
        diasParaInicio,
        diasParaFim,
        isActive: diasParaInicio <= 0 && diasParaFim >= 0, // Se a semana já começou e ainda não terminou
        isUpcoming: diasParaInicio > 0 && diasParaInicio <= 30 // Se está chegando (até 30 dias antes)
      }
    };
  } catch (error) {
    console.error('Erro ao obter dados da semana gratuita:', error);
    return { success: false, error: error.toString() };
  }
}
