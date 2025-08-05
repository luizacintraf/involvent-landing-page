import React, { useState, useEffect } from 'react';
import API from '../utils/gasClient';

export const CheckoutPage = ({
  pedido,
  onUpdateBuyer,
  onNavigate,
  lotes
}) => {
  const [alunos, setAlunos] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validação básica
    const errors = {};
    if (!pedido.dadosComprador?.nome?.trim()) {
      errors.nome = 'Nome é obrigatório';
    }
    if (!pedido.dadosComprador?.email?.trim()) {
      errors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(pedido.dadosComprador.email)) {
      errors.email = 'Email inválido';
    }
    
    pedido.participantes.forEach((participante, index) => {
      if (!participante.nome?.trim()) {
        errors[`participante_${index}`] = 'Nome do participante é obrigatório';
      }
      if (!participante.unidade?.trim()) {
        errors[`unidade_${index}`] = 'Unidade é obrigatória';
      }
    });

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    onNavigate('payment');
  };

  const fetchAlunos = async () => {
    const response = await API.getSpreadsheetData('alunos').catch(error => {
      console.error('Erro ao buscar alunos:', error);
      return { data: [] };
    });
    setAlunos(response.data);
  };

  const fecthUnidades = async () => {
    const response = await API.getSpreadsheetData('unidades').catch(error => {
      console.error('Erro ao buscar unidades:', error);
      return { data: [] };
    });
    setUnidades(response.data);
  };

  useEffect(() => {
    fetchAlunos()
    fecthUnidades()
  }, []);

  const handleParticipanteChange = (type, index, dados) => {
    pedido.participantes[index][type] = dados;
    onUpdateBuyer({ ...pedido });
  };

  const handleCompradorChange = (campo, valor) => {
    pedido.dadosComprador[campo] = valor;
    onUpdateBuyer({ ...pedido });
    // Limpa o erro quando o campo é preenchido
    if (formErrors[campo]) {
      setFormErrors({ ...formErrors, [campo]: null });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 font-body">
      <h1 className="text-3xl md:text-4xl font-display text-primary mb-6 text-center">
        Finalizar Compra
      </h1>

      <div className="w-full max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados do Comprador */}
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-md border-2 border-primary/20">
            <h2 className="text-2xl font-display text-primary mb-4">
              Dados do Comprador
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo*
                </label>
                <input
                  type="text"
                  required
                  autoComplete="name"
                  defaultValue={pedido.dadosComprador?.nome || ''}
                  onChange={(e) => handleCompradorChange('nome', e.target.value)}
                  className={`w-full px-4 py-3 text-base border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    formErrors.nome ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Digite seu nome completo"
                />
                {formErrors.nome && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.nome}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail*
                </label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  defaultValue={pedido.dadosComprador?.email || ''}
                  onChange={(e) => handleCompradorChange('email', e.target.value)}
                  className={`w-full px-4 py-3 text-base border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    formErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Digite seu e-mail"
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                )}
              </div>
            </div>
          </div>

          {/* Dados dos Participantes */}
          {pedido.participantes.map((participante, index) => (
            <div key={`${participante.tipo}-${index}`} className="bg-white p-4 sm:p-6 rounded-lg shadow-md border-2 border-primary/20">
              <h3 className="text-xl font-display text-primary mb-4">
                Participante - {participante.tipo}
              </h3>
              
              {participante.tipo.toLowerCase().includes('gympass') && (
                <div className="text-sm text-gray-500 mb-4 p-3 bg-yellow-50 rounded-lg">
                  Este ingresso é destinado para alunos PD Castelo que utilizam gympass, sujeito a conferência de aluno
                </div>
              )}
              
              <div className="space-y-4">
                {((lotes.find(lote => lote.nome_lote === participante.tipo)?.alunos) && !participante.tipo.toLowerCase().includes('gympass')) ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Aluno*
                    </label>
                    <div className="text-sm text-gray-500 mb-2 p-3 bg-blue-50 rounded-lg">
                      Caso não encontre o seu nome e seja aluno entre em contato com o PD Castelo
                    </div>
                    <select
                      required
                      defaultValue={participante.nome || ''}
                      onChange={(e) => handleParticipanteChange('nome', index, e.target.value)}
                      className={`w-full px-4 py-3 text-base border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                        formErrors[`participante_${index}`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Selecione o aluno</option>
                      {alunos.map((aluno, i) => (
                        <option key={i} value={aluno.nome}>
                          {aluno.nome}
                        </option>
                      ))}
                    </select>
                    {formErrors[`participante_${index}`] && (
                      <p className="mt-1 text-sm text-red-600">{formErrors[`participante_${index}`]}</p>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <label className="flex items-center text-sm font-medium text-gray-700 p-3 bg-gray-50 rounded-lg">
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleParticipanteChange('nome', index, pedido.dadosComprador?.nome || '');
                            }
                          }}
                          className="mr-2 h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        Mesmo nome do comprador
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome Completo*
                      </label>
                      <input
                        type="text"
                        required
                        defaultValue={participante.nome || ''}
                        onChange={(e) => handleParticipanteChange('nome', index, e.target.value)}
                        className={`w-full px-4 py-3 text-base border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                          formErrors[`participante_${index}`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Digite o nome do participante"
                      />
                      {formErrors[`participante_${index}`] && (
                        <p className="mt-1 text-sm text-red-600">{formErrors[`participante_${index}`]}</p>
                      )}
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unidade*
                  </label>
                  <select
                    required
                    value={participante.unidade || ''}
                    onChange={(e) => handleParticipanteChange('unidade', index, e.target.value)}
                    className={`w-full px-4 py-3 text-base border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                      formErrors[`unidade_${index}`] ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Selecione a unidade</option>
                    {unidades.map((unidade, i) => (
                      <option key={i} value={unidade.nome}>
                        {unidade.nome}
                      </option>
                    ))}
                  </select>
                  {formErrors[`unidade_${index}`] && (
                    <p className="mt-1 text-sm text-red-600">{formErrors[`unidade_${index}`]}</p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Resumo do Pedido */}
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-md border-2 border-primary/20">
            <h2 className="text-2xl font-display text-primary mb-4">
              Resumo do Pedido
            </h2>

            <div className="space-y-3 mb-4">
              {Object.entries(pedido.ingressos || {}).map(([loteId, quantidade]) => {
                if (!quantidade || quantidade <= 0) return null;

                const lote = lotes.find(l => l.nome_lote === loteId);
                if (!lote) return null;

                return (
                  <div key={loteId} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{lote.nome_lote}</p>
                      <p className="text-sm text-gray-600">Quantidade: {quantidade}</p>
                    </div>
                    <p className="text-lg font-display text-secondary">
                      R$ {(quantidade * lote.valor).toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <h3 className="text-xl font-display text-primary">Total</h3>
              <p className="text-2xl font-display text-secondary">
                R$ {(pedido?.total || 0).toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </p>
            </div>
          </div>

          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-3 sticky bottom-0 bg-white p-4 border-t border-gray-200 shadow-lg">
            <button
              type="button"
              onClick={() => onNavigate('selecao')}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-gray-100 text-gray-700 font-display hover:bg-gray-200 transition-colors duration-300 text-lg"
            >
              Voltar
            </button>
            <button
              type="submit"
              disabled={!pedido?.total || pedido.total === 0}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-primary text-white font-display hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 text-lg"
            >
              Finalizar Compra
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};