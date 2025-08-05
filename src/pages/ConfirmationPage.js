import React from 'react';

export const ConfirmationPage = ({ 
  pedido, 
  onReset,
  orderId 
}) => (
  <div className="min-h-screen flex flex-col items-center p-4 font-body">
    <div className="w-full max-w-3xl">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-display text-primary mb-3 sm:mb-4">
          Compra Realizada com Sucesso!
        </h1>
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
          <p className="text-green-800 text-sm sm:text-base">
            Obrigado por sua compra, <span className="font-semibold">{pedido.dadosComprador.nome}</span>!
          </p>
          <p className="text-green-700 text-xs sm:text-sm mt-1.5 sm:mt-2">
            Em breve você receberá um e-mail em <span className="font-semibold">{pedido.dadosComprador.email}</span> com a confirmação da sua compra.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-md border-2 border-primary/20 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-display text-primary">
            Detalhes da Compra
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            Pedido: <span className="font-mono font-medium">{orderId}</span>
          </p>
        </div>

        <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
          <div>
            <h3 className="text-base sm:text-lg font-medium mb-2">Dados do Comprador</h3>
            <div className="confirmation-details bg-gray-50 rounded-lg">
              <p className="text-sm sm:text-base"><span className="text-gray-600">Nome:</span> {pedido.dadosComprador.nome}</p>
              <p className="text-sm sm:text-base"><span className="text-gray-600">E-mail:</span> {pedido.dadosComprador.email}</p>
            </div>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-medium mb-2">Ingressos</h3>
            <div className="space-y-2">
              {Object.entries(pedido.ingressos).map(([loteId, quantidade]) => (
                quantidade > 0 && (
                  <div key={loteId} className="confirmation-details bg-gray-50 rounded-lg flex justify-between items-center">
                    <span className="text-sm sm:text-base">{loteId}</span>
                    <span className="text-sm sm:text-base font-medium">{quantidade}x</span>
                  </div>
                )
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-medium mb-2">Total</h3>
            <div className="confirmation-details bg-gray-50 rounded-lg flex justify-between items-center">
              <span className="text-sm sm:text-base">Valor Total</span>
              <span className="text-base sm:text-lg font-display text-primary">
                R$ {pedido.total.toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center space-y-3 sm:space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
          <p className="text-blue-800 text-sm sm:text-base">
            Enviamos um email com todos os detalhes da sua compra.
            <br />
            <span className="text-xs sm:text-sm">Caso não receba em alguns minutos, verifique sua caixa de spam.</span>
          </p>
        </div>
        <button
          onClick={onReset}
          className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-primary text-white text-sm sm:text-base font-display hover:bg-primary-hover transition-colors duration-300"
        >
          Voltar ao Início
        </button>
      </div>
    </div>
  </div>
); 