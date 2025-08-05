import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { generatePixPayload } from '../utils/pixUtils';
import { saveOrder } from '../utils/saveOrder';
import CONFIG from '../config.js';

export const PaymentPage = ({ 
  pedido = { 
    ingressos: {}, 
    total: 0,
    dadosComprador: {
      nome: '',
      email: '',
      comprovante: null
    },
    participantes: []
  },
  onNavigate,
  onUpdateBuyer = () => {},
  chavePix = CONFIG.payment.pixEmail,
  nomeBeneficiario = "PE DESCALCO CASTELO",
  cidadeBeneficiario = "SAO PAULO"
}) => {
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [copySuccess, setCopySuccess] = useState('');
  const [comprovante, setComprovante] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const handleComprovanteChange = (e) => {
    const file = e.target.files[0];
    console.log('Arquivo selecionado:', file);
    
    if (file) {
      setComprovante(file);
      const updatedPedido = {
        ...pedido,
        dadosComprador: {
          ...pedido.dadosComprador,
          comprovante: file
        }
      };
      console.log('Atualizando pedido com comprovante:', updatedPedido);
      onUpdateBuyer(updatedPedido);
    }
  };

  const handleConfirmPayment = async () => {
    if (!comprovante) {
      setSaveError('Por favor, anexe o comprovante de pagamento.');
      return;
    }

    setIsSaving(true);
    setSaveError('');
    
    try {
      console.log('Iniciando confirmação de pagamento');
      console.log('Pedido a ser salvo:', pedido);
      console.log('Comprovante anexado:', pedido.dadosComprador.comprovante);
      
      const result = await saveOrder(pedido);
      console.log('Resultado do salvamento:', result);
      
      if (result.success) {
        onNavigate('confirmacao');
      } else {
        setSaveError('Erro ao salvar o pedido. Por favor, tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      setSaveError('Erro ao processar o pagamento. Por favor, tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  // Função para gerar o payload do PIX
  const getPixData = () => {
    // Gera um identificador único combinando:
    // - Timestamp atual em milisegundos
    // - 6 caracteres aleatórios
    // - Email do comprador (hash)
    const timestamp = Date.now();
    const randomChars = Math.random().toString(36).substring(2, 8).toUpperCase();
    const emailHash = pedido.dadosComprador.email
      ? pedido.dadosComprador.email.split('').reduce((a, b) => (((a << 5) - a) + b.charCodeAt(0))|0, 0).toString(16)
      : '';
    
    const identificador = `PD${timestamp}${randomChars}${emailHash}`.substring(0, 25);

    return generatePixPayload({
      chave: chavePix,
      valor: pedido.total.toFixed(2),
      beneficiario: nomeBeneficiario,
      cidade: cidadeBeneficiario,
      identificador: identificador
    });
  };

  const handleCopyPixCode = () => {
    navigator.clipboard.writeText(getPixData())
      .then(() => {
        setCopySuccess('Código PIX copiado!');
        setTimeout(() => setCopySuccess(''), 3000);
      })
      .catch(() => setCopySuccess('Erro ao copiar'));
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 font-body">
      <h1 className="text-3xl md:text-4xl font-display text-primary mb-6 text-center">
        Pagamento
      </h1>

      <div className="w-full max-w-3xl space-y-6">

        {/* Detalhes do Pagamento PIX */}
        {paymentMethod === 'pix' && (
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-md border-2 border-primary/20">
            <h2 className="text-xl sm:text-2xl font-display text-primary mb-4">
              Pagamento via PIX
            </h2>

            <div className="flex flex-col items-center space-y-4 sm:space-y-6">
              <div className="qr-code-container">
                <QRCodeSVG 
                  value={getPixData()}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>

              <p className="text-sm text-gray-600 text-center">
                {CONFIG.payment.pixMessage}
              </p>

              <div className="text-center">
                <p className="text-xs sm:text-sm text-gray-600 mb-2">
                  Escaneie o QR Code acima ou copie o código PIX abaixo
                </p>
                <button
                  onClick={handleCopyPixCode}
                  className="px-4 py-2 bg-primary text-white text-sm sm:text-base rounded-full hover:bg-primary-hover transition-colors duration-300"
                >
                  Copiar código PIX
                </button>
                {copySuccess && (
                  <p className="text-xs sm:text-sm text-green-600 mt-2">{copySuccess}</p>
                )}
              </div>

              <div className="w-full border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-base sm:text-lg font-medium">Total a pagar:</span>
                  <span className="text-xl sm:text-2xl font-display text-primary">
                    R$ {pedido.total.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Instruções e Upload */}
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-md border-2 border-primary/20">
          <h2 className="text-lg sm:text-xl font-display text-primary mb-3 sm:mb-4">
            Instruções
          </h2>
          
          <ol className="payment-instructions list-decimal list-inside space-y-1.5 sm:space-y-2 text-gray-700 mb-4 sm:mb-6">
            <li>Abra o aplicativo do seu banco</li>
            <li>Escolha a opção de pagamento via PIX</li>
            <li>Escaneie o QR Code ou cole o código PIX copiado</li>
            <li>Confirme as informações do pagamento</li>
            <li>Aguarde a confirmação</li>
            <li>Anexe o comprovante de pagamento</li>
          </ol>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comprovante 
            </label>
            <input
              type="file"
              onChange={handleComprovanteChange}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent file:mr-3 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-3 sm:file:px-4 file:rounded-full file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            />
            <p className="mt-2 text-sm font-semibold text-red-600">
              {CONFIG.payment.comprovanteWarning}
            </p>
            <p className="mt-1 text-xs text-gray-600">
              O comprovante é necessário para validarmos seu pagamento e garantirmos seus ingressos.
            </p>
          </div>
        </div>

        {/* Botões */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          {saveError && (
            <p className="text-red-600 text-sm mb-2">{saveError}</p>
          )}
          <button
            type="button"
            onClick={() => onNavigate('checkout')}
            disabled={isSaving}
            className="px-6 py-3 rounded-full bg-gray-100 text-gray-700 font-display hover:bg-gray-200 transition-colors duration-300"
          >
            Voltar
          </button>
          <button
            type="button"
            onClick={handleConfirmPayment}
            disabled={!comprovante || isSaving}
            className="px-6 py-3 rounded-full bg-primary text-white font-display hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <span className="animate-spin">⌛</span>
                Processando...
              </>
            ) : (
              'Confirmar Pagamento'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}; 