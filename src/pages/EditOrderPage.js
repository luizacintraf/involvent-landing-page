import React, { useState } from 'react';
import API from '../utils/gasClient';

export const EditOrderPage = ({ onNavigate }) => {
  const [step, setStep] = useState('verification'); // verification or token
  const [formData, setFormData] = useState({
    orderNumber: '',
    email: '',
    token: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(null);
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Log dos valores antes de enviar
    console.log('=== DADOS DO FORMULÁRIO ===');
    console.log('Número do Pedido:', formData.orderNumber);
    console.log('Email:', formData.email);
    console.log('Dados completos:', formData);

    try {
      // Garante que os valores não são undefined
      if (!formData.orderNumber || !formData.email) {
        setError('Por favor, preencha todos os campos.');
        setLoading(false);
        return;
      }

      console.log('Enviando requisição para o servidor...');
      const response = await API.requestEditToken({
        orderNumber: formData.orderNumber.trim(),
        email: formData.email.trim().toLowerCase()
      });

      console.log('=== RESPOSTA DO SERVIDOR ===');
      console.log(JSON.stringify(response, null, 2));

      if (response.success) {
        setStep('token');
      } else {
        setError(response.message || 'Pedido não encontrado ou email não corresponde.');
      }
    } catch (error) {
      console.error('=== ERRO NA REQUISIÇÃO ===');
      console.error('Erro:', error);
      console.error('Mensagem:', error.message);
      console.error('Stack:', error.stack);
      
      let errorMessage = 'Erro ao verificar pedido. Tente novamente.';
      
      try {
        const errorData = JSON.parse(error.message);
        console.log('Dados do erro:', errorData);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        errorMessage = error.message || errorMessage;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleTokenSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log('Enviando token para verificação:', formData);
      
      const response = await API.verifyEditToken({
        orderNumber: formData.orderNumber,
        token: formData.token
      });

      console.log('Resposta da verificação do token:', response);

      if (response.success) {
        // Navigate to edit form with the order data
        onNavigate('edit-form', response.orderData);
      } else {
        setError(response.message || 'Token inválido ou expirado.');
      }
    } catch (error) {
      console.error('Erro detalhado:', error);
      let errorMessage = 'Erro ao verificar token. Tente novamente.';
      
      try {
        // Tenta extrair a mensagem de erro do servidor
        const errorData = JSON.parse(error.message);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        // Se não conseguir fazer o parse, usa a mensagem original
        errorMessage = error.message || errorMessage;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 font-body">
      {/* Botão de Voltar no Topo */}
      <div className="w-full max-w-md mb-4">
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
        Editar Pedido
      </h1>

      <div className="w-full max-w-md">
        {step === 'verification' ? (
          <form onSubmit={handleVerificationSubmit} className="bg-white rounded-lg p-6 shadow-md border-2 border-primary/20">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número do Pedido
                </label>
                <input
                  type="text"
                  name="orderNumber"
                  required
                  value={formData.orderNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 text-base border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent border-gray-300"
                  placeholder="Digite o número do pedido"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail do Comprador
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 text-base border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent border-gray-300"
                  placeholder="Digite o e-mail usado na compra"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-gray-100 text-gray-700 font-display hover:bg-gray-200 transition-colors duration-300"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-primary text-white font-display hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                >
                  {loading ? 'Verificando...' : 'Solicitar Token'}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleTokenSubmit} className="bg-white rounded-lg p-6 shadow-md border-2 border-primary/20">
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-200 text-blue-600 rounded-lg text-sm">
                Um token de verificação foi enviado para o seu e-mail. Por favor, insira-o abaixo.
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Token de Verificação
                </label>
                <input
                  type="text"
                  name="token"
                  required
                  value={formData.token}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 text-base border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent border-gray-300"
                  placeholder="Digite o token recebido por e-mail"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setStep('verification')}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-gray-100 text-gray-700 font-display hover:bg-gray-200 transition-colors duration-300"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-primary text-white font-display hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                >
                  {loading ? 'Verificando...' : 'Verificar Token'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}; 