import API from './gasClient';

const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      console.log('Arquivo convertido para base64');
      resolve(reader.result);
    };
    reader.onerror = (error) => {
      console.error('Erro ao converter arquivo:', error);
      reject(error);
    };
    reader.readAsDataURL(file);
  });
};

export const saveOrder = async (pedido) => {
  try {
    console.log('Iniciando saveOrder');
    const orderId = `PD${new Date().getTime()}`;
    console.log('OrderId gerado:', orderId);
    
    // First upload the comprovante to Drive
    let comprovanteUrl = '';
    if (pedido.dadosComprador.comprovante) {
      console.log('Comprovante encontrado:', pedido.dadosComprador.comprovante);
      console.log('Tipo do arquivo:', pedido.dadosComprador.comprovante.type);
      console.log('Tamanho do arquivo:', pedido.dadosComprador.comprovante.size);
      
      try {
        const base64Data = await convertFileToBase64(pedido.dadosComprador.comprovante);
        console.log('Base64 gerado, tamanho:', base64Data.length);
        
        const uploadResponse = await API.uploadFile(base64Data);
        console.log('Resposta do upload:', uploadResponse);
        
        if (!uploadResponse.success) {
          throw new Error(uploadResponse.error || 'Erro ao fazer upload do comprovante');
        }
        
        comprovanteUrl = uploadResponse.fileUrl;
        console.log('URL do comprovante:', comprovanteUrl);
      } catch (uploadError) {
        console.error('Erro detalhado no upload:', uploadError);
        throw new Error(`Erro no upload do arquivo: ${uploadError.message}`);
      }
    } else {
      console.warn('Nenhum comprovante encontrado no pedido');
    }

    // Prepare rows for the spreadsheet
    const rows = pedido.participantes.map(participante => ({
      order: orderId,
      nome_comprador: pedido.dadosComprador.nome,
      email: pedido.dadosComprador.email,
      nome_participante: participante.nome,
      unidade: participante.unidade || '',
      tipo: participante.tipo,
      comprovante: comprovanteUrl,
      data: new Date().toISOString()
    }));

    console.log('Linhas preparadas para salvar:', rows);

    // Save to spreadsheet
    const response = await API.appendRows('ingressos', rows);
    console.log('Resposta do salvamento na planilha:', response);

    // Send confirmation email
    try {
      console.log('Iniciando envio de email para:', pedido.dadosComprador.email);
      
      // Prepara um objeto limpo para o email, sem o objeto File
      const emailPedido = {
        dadosComprador: {
          nome: pedido.dadosComprador.nome,
          email: pedido.dadosComprador.email
        },
        participantes: pedido.participantes,
        total: pedido.total
      };
      
      console.log('Dados do email:', {
        to: pedido.dadosComprador.email,
        orderId,
        pedido: emailPedido
      });
      
      const emailResponse = await API.sendConfirmationEmail({
        to: pedido.dadosComprador.email,
        orderId,
        pedido: emailPedido
      });
      console.log('Resposta do envio de email:', emailResponse);
      
      if (!emailResponse.success) {
        throw new Error(emailResponse.error || 'Erro ao enviar email');
      }
    } catch (emailError) {
      console.error('Erro detalhado ao enviar email:', emailError);
      throw new Error(`Erro ao enviar email: ${emailError.message}`);
    }
    
    return {
      success: true,
      data: response,
      comprovanteUrl,
      orderId
    };
  } catch (error) {
    console.error('Erro ao salvar pedido:', error);
    return {
      success: false,
      error: error.message
    };
  }
}; 