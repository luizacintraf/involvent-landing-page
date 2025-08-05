import React from 'react';

export const TicketSelectionPage = ({ 
  pedido = { ingressos: {}, total: 0 }, 
  onQuantityUpdate, 
  onNavigate,
  lotes = []
}) => {

  const verificarDisponibilidadePorData = (lote) => {
    if (!lote) return { disponivel: false, mensagem: 'Lote inválido' };

    const agora = new Date();
    const dataInicio = lote.dataInicio ? new Date(lote.dataInicio) : null;
    const dataFim = lote.dataFim ? new Date(lote.dataFim) : null;

    if (dataInicio && agora < dataInicio) {
      return { disponivel: false, mensagem: `Vendas iniciam em ${dataInicio.toLocaleDateString('pt-BR')}` };
    }
    
    if (dataFim && agora > dataFim) {
      return { disponivel: false, mensagem: 'Vendas encerradas' };
    }

    return { disponivel: true, mensagem: null };
  };


  return (
    <div className="min-h-screen flex flex-col items-center p-4 font-body">
      <h1 className="text-3xl md:text-4xl font-display text-primary mb-6 text-center">
        Selecione seus Ingressos
      </h1>
      
      <div className="w-full max-w-3xl space-y-4 mb-6">
        {Array.isArray(lotes) && lotes.map((lote) => {
          if (!lote || !lote.nome_lote) return null;

          const quantidade = pedido?.ingressos?.[lote.nome_lote] || 0;
          const esgotado = !lote.disponiveis || lote.disponiveis <= 0;
          const atingiuLimite = quantidade >= (lote.disponiveis || 0);
          const { disponivel, mensagem } = verificarDisponibilidadePorData(lote);
          const indisponivel = !disponivel || esgotado;

          return (
            <div
              key={lote.nome_lote}
              className="ticket-card border-primary/20 hover:border-primary/40"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-display text-primary">
                    {lote.nome_lote}
                  </h3>
                  <p className="text-xl sm:text-2xl font-display text-secondary">
                    {disponivel ? `R$ ${Number(lote.valor || 0).toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}` : 'Em breve'}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {lote.dataInicio && (
                      <>Vendas de {new Date(lote.dataInicio).toLocaleDateString('pt-BR')} </>
                    )}
                    {lote.dataFim && (
                      <>até {new Date(lote.dataFim).toLocaleDateString('pt-BR')}</>
                    )}
                  </p>
                  {lote.alunos? (
                    <p className="text-xs sm:text-sm text-gray-500">
                      Lote exclusivo para alunos do PD Castelo (sujeito a verificação)
                    </p>
                  ):null}
                </div>

                <div className="flex flex-row sm:flex-col items-center gap-3">
                  <div className="ticket-controls">
                    <button
                      onClick={() => onQuantityUpdate(lote.nome_lote, Math.max(0, quantidade - 1))}
                      disabled={quantidade === 0 || indisponivel}
                      className="ticket-button"
                    >
                      -
                    </button>
                    <span className="ticket-quantity">
                      {quantidade}
                    </span>
                    <button
                      onClick={() => onQuantityUpdate(lote.nome_lote, quantidade + 1)}
                      disabled={indisponivel || atingiuLimite}
                      className="ticket-button"
                    >
                      +
                    </button>
                  </div>

                  {quantidade > 0 && lote && typeof lote.valor === 'number' && (
                    <div className="text-right">
                      <p className="text-xs sm:text-sm text-gray-600">Subtotal:</p>
                      <p className="text-base sm:text-lg font-display text-secondary">
                        R$ {(quantidade * lote.valor).toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {indisponivel && (
                <div className="mt-2 text-sm text-red-500 text-center font-semibold">
                  {mensagem || (esgotado ? 'ESGOTADO' : 'INDISPONÍVEL')}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="w-full max-w-3xl bg-white rounded-lg p-4 shadow-md border-2 border-primary/20">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-display text-primary">Total do Pedido</h3>
          <p className="text-2xl font-display text-secondary">
            R$ {(pedido?.total || 0).toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <button
            onClick={() => onNavigate('home')}
            className="px-6 py-3 rounded-full bg-gray-100 text-gray-700 font-display hover:bg-gray-200 transition-colors duration-300"
          >
            Voltar
          </button>
          <button
            onClick={() => onNavigate('checkout')}
            disabled={!pedido?.total || pedido.total === 0}
            className="px-6 py-3 rounded-full bg-primary text-white font-display hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
          >
            Continuar para Pagamento
          </button>
        </div>
      </div>
    </div>
  );
};
