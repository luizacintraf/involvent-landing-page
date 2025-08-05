import React, { useState, useEffect } from 'react';
import { GASClient } from 'gas-client';
import { HomePage } from './pages/HomePage';
import { TicketSelectionPage } from './pages/TicketSelectionPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ConfirmationPage } from './pages/ConfirmationPage';
import { PaymentPage } from './pages/PaymentPage';
import API from './utils/gasClient';
import { EditOrderPage } from './pages/EditOrderPage';
import { EditOrderFormPage } from './pages/EditOrderFormPage';

// Chaves para o localStorage
const STORAGE_KEYS = {
  PEDIDO: 'pdcastelo_pedido',
  CURRENT_PAGE: 'pdcastelo_current_page'
};

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [navigationData, setNavigationData] = useState(null);
  const [lotes, setLotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Limpa localStorage corrompido na inicialização
  useEffect(() => {
    try {
      const savedPage = localStorage.getItem(STORAGE_KEYS.CURRENT_PAGE);
      if (savedPage === 'edit-form') {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_PAGE);
      }
    } catch (error) {
      console.log('Erro ao verificar localStorage:', error);
    }
  }, []);
  const [pedido, setPedido] = useState({
    ingressos: {},
    total: 0,
    dadosComprador: {
      nome: '',
      email: '',
      comprovante: null
    },
    participantes: []
  });

  // Função para salvar dados no localStorage
  const saveToLocalStorage = (key, data) => {
    try {
      const serializedData = JSON.stringify(data);
      localStorage.setItem(key, serializedData);
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
    }
  };

  // Função para recuperar dados do localStorage
  const getFromLocalStorage = (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Erro ao ler do localStorage:', error);
      return null;
    }
  };

  // Função para limpar dados do localStorage
  const clearLocalStorage = () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.PEDIDO);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_PAGE);
    } catch (error) {
      console.error('Erro ao limpar localStorage:', error);
    }
  };

  const calcularTotal = (ingressos) => {
    return Object.entries(ingressos).reduce((total, [tipo, quantidade]) => {
      const lote = lotes.find(lote => lote.nome_lote === tipo);
      return total + (lote ? lote.valor * quantidade : 0);
    }, 0);  
  };

  const atualizarQuantidade = (tipo, quantidade) => {
    const novosIngressos = {
      ...pedido.ingressos,
      [tipo]: quantidade
    };

    const unidade = lotes.find(lote => lote.nome_lote === tipo)?.alunos ? 'Castelo' : '';

    // Remove participantes excedentes se a quantidade diminuiu
    const participantesAtualizados = pedido.participantes.filter(p => {
      // Mantém participantes de outros tipos
      if (p.tipo !== tipo) return true;
      // Para o tipo atual, mantém apenas a quantidade desejada
      const participantesDesseTipo = pedido.participantes.filter(part => part.tipo === tipo);
      const index = participantesDesseTipo.indexOf(p);
      return index < quantidade;
    });

    // Adiciona novos participantes se necessário
    const participantesDessetipoAtual = participantesAtualizados.filter(p => p.tipo === tipo).length;
    const participantesParaAdicionar = quantidade - participantesDessetipoAtual;
    
    if (participantesParaAdicionar > 0) {
      for (let i = 0; i < participantesParaAdicionar; i++) {
        participantesAtualizados.push({
          tipo: tipo,
          nome: '',
          unidade: unidade
        });
      }
    }

    const novoPedido = {
      ...pedido,
      ingressos: novosIngressos,
      participantes: participantesAtualizados,
      total: calcularTotal(novosIngressos)
    };

    setPedido(novoPedido);
    saveToLocalStorage(STORAGE_KEYS.PEDIDO, novoPedido);
  };

  const atualizarDadosComprador = (novoPedido) => {
    setPedido(novoPedido);
    saveToLocalStorage(STORAGE_KEYS.PEDIDO, novoPedido);
  };

  const resetarPedido = () => {
    // Reseta todos os estados para seus valores iniciais
    const pedidoInicial = {
      ingressos: {},
      total: 0,
      dadosComprador: { 
        nome: '', 
        email: '', 
        comprovante: null 
      },
      participantes: []
    };

    // Limpa o localStorage
    clearLocalStorage();

    // Atualiza os estados
    setPedido(pedidoInicial);
    setCurrentPage('home');

    // Força um reload da página para garantir que tudo seja limpo
    window.location.reload();
  };

  // Efeito para carregar dados salvos ao iniciar a aplicação
  useEffect(() => {
    const savedPedido = getFromLocalStorage(STORAGE_KEYS.PEDIDO);
    const savedPage = getFromLocalStorage(STORAGE_KEYS.CURRENT_PAGE);

    if (savedPedido) {
      setPedido(savedPedido);
    }
    
    // Verifica se a página salva é válida
    const validPages = ['home', 'selecao', 'checkout', 'payment', 'editOrder'];
    if (savedPage && validPages.includes(savedPage) && savedPage !== 'confirmacao') {
      setCurrentPage(savedPage);
    } else {
      // Se a página não é válida, volta para home
      setCurrentPage('home');
    }
  }, []);

  // Efeito para salvar a página atual
  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.CURRENT_PAGE, currentPage);
  }, [currentPage]);

  // Efeito para carregar lotes
  useEffect(() => {
    const fetchLotes = async () => {
      try {
        setLoading(true);
        console.log('Buscando dados da planilha...');
        const response = await API.getSpreadsheetData('lotes');
        console.log('Resposta recebida:', response);
        
        if (!response.success) {
          throw new Error(response.error || 'Erro ao carregar dados');
        }

        setLotes(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Erro ao buscar lotes:', err);
        setLoading(false);
      }
    };

    fetchLotes();
  }, []);

  // Função para navegar entre páginas
  const handleNavigate = (page, data = null) => {
    console.log('Navegando para:', page, 'com dados:', data);
    setCurrentPage(page);
    setNavigationData(data);
    saveToLocalStorage(STORAGE_KEYS.CURRENT_PAGE, page);
  };

  return (
    <div className="App">
      <main>
        {currentPage === 'home' && (
          <HomePage onNavigate={handleNavigate} loading={loading} lotes={lotes} />
        )}
        {currentPage === 'selecao' && (
          <TicketSelectionPage 
            pedido={pedido}
            onQuantityUpdate={atualizarQuantidade}
            onNavigate={handleNavigate}
            total={pedido.total}
            lotes={lotes}
          />
        )}
        {currentPage === 'checkout' && (
          <CheckoutPage 
            pedido={pedido}
            onUpdateBuyer={atualizarDadosComprador}
            onNavigate={handleNavigate}
            lotes={lotes}
          />
        )}
        {currentPage === 'payment' && (
          <PaymentPage 
            pedido={pedido}
            onNavigate={handleNavigate}
            onUpdateBuyer={atualizarDadosComprador}
          />
        )}
        {currentPage === 'confirmacao' && (
          <ConfirmationPage 
            pedido={pedido}
            onReset={resetarPedido}
          />
        )}
        {currentPage === 'editOrder' && (
          <EditOrderPage onNavigate={handleNavigate} />
        )}
        {currentPage === 'edit-form' && (
          <EditOrderFormPage 
            orderData={navigationData} 
            onNavigate={handleNavigate} 
          />
        )}
      </main>
    </div>
  );
}

export default App; 