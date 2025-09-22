import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../utils/gasClient';

const FreeWeekContext = createContext();

export const useFreeWeek = () => {
  const context = useContext(FreeWeekContext);
  if (!context) {
    throw new Error('useFreeWeek deve ser usado dentro de FreeWeekProvider');
  }
  return context;
};

export const FreeWeekProvider = ({ children }) => {
  const [freeWeekData, setFreeWeekData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFreeWeekData();
  }, []);

  const fetchFreeWeekData = async () => {
    try {
      console.log('Iniciando busca de dados da semana gratuita...');
      
      // Busca os dados diretamente
      const response = await API.getFreeWeekData();
      console.log('FreeWeek Response:', response);
      
      if (response && response.success && response.data) {
        console.log('FreeWeek Data carregado:', response.data);
        setFreeWeekData(response.data);
      } else {
        console.log('Semana gratuita não ativa ou dados não encontrados:', response?.error || 'Sem dados');
        // Define dados padrão quando não há semana gratuita
        setFreeWeekData({
          periodo: '',
          inicio: '',
          fim: '',
          wppLink: 'https://wa.me/5519998882451',
          isNearFreeWeek: false,
          diasParaInicio: 999,
          diasParaFim: 999,
          isActive: false,
          isUpcoming: false
        });
      }
    } catch (error) {
      console.error('Erro ao carregar dados da semana gratuita:', error);
      // Em caso de erro, define dados padrão
      setFreeWeekData({
        periodo: '',
        inicio: '',
        fim: '',
        wppLink: 'https://wa.me/5519998882451',
        isNearFreeWeek: false,
        diasParaInicio: 999,
        diasParaFim: 999,
        isActive: false,
        isUpcoming: false
      });
    } finally {
      setLoading(false);
    }
  };

  const getButtonText = () => {
    if (!freeWeekData || !freeWeekData.isNearFreeWeek) {
      return 'Agende sua Semana Experimental';
    }
    
    if (freeWeekData.isActive) {
      return 'Agende sua Semana Experimental Gratuita - EM ANDAMENTO!';
    }
    
    return 'Agende sua Semana Experimental Gratuita';
  };

  const getButtonSubtext = () => {
    if (!freeWeekData || !freeWeekData.isNearFreeWeek) {
      return 'R$ 25,00 a semana toda';
    }
    
    console.log('getButtonSubtext - freeWeekData:', freeWeekData);
    console.log('getButtonSubtext - inicio:', freeWeekData.inicio, 'tipo:', typeof freeWeekData.inicio);
    console.log('getButtonSubtext - fim:', freeWeekData.fim, 'tipo:', typeof freeWeekData.fim);
    
    if (freeWeekData.isActive) {
      return `Acontecendo agora: ${freeWeekData.inicio} a ${freeWeekData.fim}`;
    }
    
    return `${freeWeekData.inicio} a ${freeWeekData.fim}`;
  };

  const getWhatsAppLink = () => {
    if (!freeWeekData || !freeWeekData.isNearFreeWeek) {
      return 'https://wa.me/5519998882451';
    }
    return freeWeekData.wppLink;
  };

  const value = {
    freeWeekData,
    loading,
    isNearFreeWeek: freeWeekData?.isNearFreeWeek || false,
    isActive: freeWeekData?.isActive || false,
    isUpcoming: freeWeekData?.isUpcoming || false,
    getButtonText,
    getButtonSubtext,
    getWhatsAppLink,
    refreshData: fetchFreeWeekData
  };

  return (
    <FreeWeekContext.Provider value={value}>
      {children}
    </FreeWeekContext.Provider>
  );
};

export default FreeWeekContext;
