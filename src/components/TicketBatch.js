import React from 'react';

export const TicketBatch = ({ lotes = [] }) => {
  const verificarDisponibilidadePorData = (lote) => {
    if (!lote) return { disponivel: false };

    const agora = new Date();
    const dataInicio = lote.dataInicio ? new Date(lote.dataInicio) : null;
    const dataFim = lote.dataFim ? new Date(lote.dataFim) : null;

    if (dataInicio && agora < dataInicio) {
      return { disponivel: false };
    }
    
    if (dataFim && agora > dataFim) {
      return { disponivel: false };
    }

    return { disponivel: true };
  };

  if (!lotes.length) {
    return (
      <div className="text-gray-600 p-4 text-center">
        Nenhum lote disponível no momento.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {lotes.map((lote) => {
        const { disponivel } = verificarDisponibilidadePorData(lote);
        
        return (
          <div
            key={lote.nome_lote}
            className="bg-white rounded-lg p-4 shadow-md border-2 border-primary/20 hover:border-primary/40 transition-all duration-300"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-display text-primary">
                  {lote.nome_lote}
                </h3>
                <p className="text-gray-600">
                  {lote.dataInicio && (
                    <>Vendas de {new Date(lote.dataInicio).toLocaleDateString('pt-BR')} </>
                  )}
                  {lote.dataFim && (
                    <>até {new Date(lote.dataFim).toLocaleDateString('pt-BR')}</>
                  )}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-display text-secondary">
                  {disponivel ? `R$ ${Number(lote.valor).toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}` : 'Em breve'}
                </p>
              </div>
            </div>
            {lote.disponiveis <= 0 && (
              <div className="mt-2 text-red-500 text-center font-semibold">
                ESGOTADO
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
