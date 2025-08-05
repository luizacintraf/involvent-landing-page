import React, { useState, useEffect } from 'react';
import API from '../utils/gasClient';
import { TicketBatch } from '../components/TicketBatch';
import { Loading } from '../components/Loading';

export const TicketBatchContainer = () => {
  const [lotes, setLotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLotes = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Buscando dados da planilha...');
        const response = await API.getSpreadsheetData('lotes');
        console.log('Resposta recebida:', response);
        
        if (!response.success) {
          throw new Error(response.error || 'Erro ao carregar dados');
        }

        // Ordena os lotes por data de fim
        const lotesOrdenados = response.data.sort((a, b) => {
          return new Date(a.dataFim) - new Date(b.dataFim);
        });

        setLotes(lotesOrdenados);
        setLoading(false);
      } catch (err) {
        console.error('Erro ao buscar lotes:', err);
        setError('Não foi possível carregar os dados dos lotes. Por favor, atualize a página ou tente novamente mais tarde.');
        setLoading(false);
      }
    };

    fetchLotes();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="text-red-600 p-4 text-center">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-primary text-white rounded-full hover:bg-primary-hover transition-colors duration-300"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return <TicketBatch lotes={lotes} />;
}; 