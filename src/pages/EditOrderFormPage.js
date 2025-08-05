import React, { useState, useEffect } from 'react';
import API from '../utils/gasClient';

export const EditOrderFormPage = ({ orderData, onNavigate }) => {
  const [ingressos, setIngressos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [selectedIngresso, setSelectedIngresso] = useState(null);
  const [editForm, setEditForm] = useState({
    novoNome: '',
    novoEmail: ''
  });

  useEffect(() => {
    if (orderData?.orderNumber) {
      fetchIngressos();
    }
  }, [orderData]);

  const fetchIngressos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await API.getOrderTickets(orderData.orderNumber);
      
      if (response.success) {
        setIngressos(response.data);
      } else {
        setError(response.message || 'Erro ao carregar ingressos');
      }
    } catch (error) {
      console.error('Erro ao buscar ingressos:', error);
      setError('Erro ao carregar ingressos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectIngresso = (ingresso) => {
    setSelectedIngresso(ingresso);
    setEditForm({
      novoNome: ingresso.nome_participante || '',
      novoEmail: ingresso.email || ''
    });
    setError(null);
    setSuccess(false);
  };

  const handleFormChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    
    if (!selectedIngresso) {
      setError('Selecione um ingresso para editar');
      return;
    }

    if (!editForm.novoNome.trim()) {
      setError('Nome é obrigatório');
      return;
    }

    if (!editForm.novoEmail.trim() || !/\S+@\S+\.\S+/.test(editForm.novoEmail)) {
      setError('Email válido é obrigatório');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const response = await API.updateTicket({
        orderNumber: orderData.orderNumber,
        originalData: selectedIngresso,
        newName: editForm.novoNome.trim(),
        newEmail: editForm.novoEmail.trim().toLowerCase()
      });

      if (response.success) {
        setSuccess(true);
        setSelectedIngresso(null);
        setEditForm({ novoNome: '', novoEmail: '' });
        // Recarrega a lista de ingressos
        await fetchIngressos();
      } else {
        setError(response.message || 'Erro ao salvar alterações');
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      setError('Erro ao salvar alterações. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando ingressos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 font-body">
      <div className="max-w-4xl mx-auto">
        {/* Botão de Voltar no Topo */}
        <div className="mb-4">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar para Home
          </button>
        </div>

        <h1 className="text-3xl md:text-4xl font-display text-primary mb-6 text-center">
          Editar Pedido #{orderData?.orderNumber}
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-600 rounded-lg">
            Alterações salvas com sucesso! Emails de notificação foram enviados.
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Lista de Ingressos */}
          <div className="bg-white rounded-lg p-6 shadow-md border-2 border-primary/20">
            <h2 className="text-xl font-display text-primary mb-4">
              Selecione o Ingresso para Editar
            </h2>
            
            {ingressos.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                Nenhum ingresso encontrado para este pedido.
              </p>
            ) : (
              <div className="space-y-3">
                {ingressos.map((ingresso, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelectIngresso(ingresso)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedIngresso === ingresso
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {ingresso.tipo}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          <strong>Nome:</strong> {ingresso.nome_participante}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Email:</strong> {ingresso.email}
                        </p>
                        {ingresso.unidade && (
                          <p className="text-sm text-gray-600">
                            <strong>Unidade:</strong> {ingresso.unidade}
                          </p>
                        )}
                      </div>
                      {selectedIngresso === ingresso && (
                        <div className="text-primary">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Formulário de Edição */}
          <div className="bg-white rounded-lg p-6 shadow-md border-2 border-primary/20">
            <h2 className="text-xl font-display text-primary mb-4">
              Editar Dados do Ingresso
            </h2>

            {!selectedIngresso ? (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <p>Selecione um ingresso ao lado para editar</p>
              </div>
            ) : (
              <form onSubmit={handleSaveChanges} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo do Ingresso
                  </label>
                  <input
                    type="text"
                    value={selectedIngresso.tipo}
                    disabled
                    className="w-full px-4 py-3 text-base border-2 rounded-lg bg-gray-50 text-gray-500 border-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Atual
                  </label>
                  <input
                    type="text"
                    value={selectedIngresso.nome_participante}
                    disabled
                    className="w-full px-4 py-3 text-base border-2 rounded-lg bg-gray-50 text-gray-500 border-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Novo Nome *
                  </label>
                  <input
                    type="text"
                    name="novoNome"
                    required
                    value={editForm.novoNome}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 text-base border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent border-gray-300"
                    placeholder="Digite o novo nome"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Atual
                  </label>
                  <input
                    type="email"
                    value={selectedIngresso.email}
                    disabled
                    className="w-full px-4 py-3 text-base border-2 rounded-lg bg-gray-50 text-gray-500 border-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Novo Email *
                  </label>
                  <input
                    type="email"
                    name="novoEmail"
                    required
                    value={editForm.novoEmail}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 text-base border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent border-gray-300"
                    placeholder="Digite o novo email"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => onNavigate('home')}
                    className="w-full sm:w-auto px-6 py-3 rounded-full bg-gray-100 text-gray-700 font-display hover:bg-gray-200 transition-colors duration-300"
                  >
                    Voltar para Home
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full sm:w-auto px-6 py-3 rounded-full bg-primary text-white font-display hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                  >
                    {saving ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 