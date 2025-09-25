import React, { useState, useEffect } from 'react';
import { useFreeWeek } from '../contexts/FreeWeekContext';
import API from '../utils/gasClient';

const TrialClass = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    ritmos: [],
    nivel_experiencia: '1'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [classes, setClasses] = useState([]);

  const { getButtonText, getButtonSubtext, getWhatsAppLink, isFreeWeek } = useFreeWeek();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await API.getSpreadsheetData('schedule');
        if (response.success) {
          setClasses(response.data);
        }
      } catch (error) {
        console.error('Erro ao buscar classes:', error);
      }
    };

    fetchClasses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRhythmChange = (ritmo) => {
    setFormData(prev => ({
      ...prev,
      ritmos: prev.ritmos.includes(ritmo)
        ? prev.ritmos.filter(r => r !== ritmo)
        : [...prev.ritmos, ritmo]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const enrollmentData = {
        ...formData,
        modalidade: formData.ritmos.join(' / ')
      };

      const response = await API.saveExperimentalEnrollment(enrollmentData);
      
      if (response.success) {
        setSuccess(true);
        // Redirecionar para WhatsApp após 2 segundos
        setTimeout(() => {
          const whatsappLink = getWhatsAppLink();
          window.open(whatsappLink, '_blank');
        }, 2000);
      } else {
        setError(response.error || 'Erro ao salvar inscrição');
      }
    } catch (err) {
      setError('Erro ao processar inscrição');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <section id="trial-class" className="trial-class-section">
        <div className="container">
          <div className="success-message">
            <div className="success-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <h2>Inscrição realizada com sucesso!</h2>
            <p>
              {isFreeWeek 
                ? `Você foi inscrito na ${getButtonSubtext()}. Em breve você receberá um email com todas as informações.`
                : 'Você foi inscrito na semana experimental. Em breve você receberá um email com todas as informações.'
              }
            </p>
            <p>
              <strong>Próximos passos:</strong>
            </p>
            <ul>
              <li>Verifique seu email para confirmar a inscrição</li>
              <li>Entre no grupo do WhatsApp para receber atualizações</li>
              <li>Compareça no horário agendado</li>
            </ul>
            <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="whatsapp-group-link">
              <i className="fab fa-whatsapp"></i>
              Entrar no Grupo do WhatsApp
            </a>
            <button 
              className="btn btn-primary"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Voltar ao Topo
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="trial-class" className="trial-class-section">
      <div className="container">
        <div className="section-header">
          <h2>{isFreeWeek ? 'Semana Experimental Gratuita' : 'Semana Experimental'}</h2>
          <p>
            {isFreeWeek 
              ? `Preencha o formulário abaixo para se inscrever na ${getButtonSubtext()}`
              : 'Preencha o formulário abaixo para se inscrever na semana experimental'
            }
          </p>
        </div>

        <div className="trial-form-container">
          <form onSubmit={handleSubmit} className="trial-form">
            <div className="form-group">
              <label htmlFor="nome">NOME COMPLETO *</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                required
                placeholder="Digite seu nome completo"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">E-MAIL *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Digite seu email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="telefone">TELEFONE/WHATSAPP *</label>
              <input
                type="tel"
                id="telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleInputChange}
                required
                placeholder="(11) 99999-9999"
              />
            </div>

            <div className="form-group">
              <label>RITMOS DE INTERESSE *</label>
              <div className="rhythm-selection">
                {classes.length > 0 ? (
                  [...new Set(classes.map(classe => classe.modalidade))].map((modalidade) => (
                    <label key={modalidade} className="rhythm-checkbox">
                      <input
                        type="checkbox"
                        checked={formData.ritmos.includes(modalidade)}
                        onChange={() => handleRhythmChange(modalidade)}
                      />
                      <span>{modalidade}</span>
                    </label>
                  ))
                ) : (
                  <p>Carregando ritmos...</p>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="nivel_experiencia">NÍVEL DE EXPERIÊNCIA *</label>
              <select
                id="nivel_experiencia"
                name="nivel_experiencia"
                value={formData.nivel_experiencia}
                onChange={handleInputChange}
                required
              >
                <option value="1">1</option>
                <option value="2">2 </option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>

            {error && (
              <div className="error-message">
                <i className="fas fa-exclamation-triangle"></i>
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading || formData.ritmos.length === 0}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Processando...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane"></i>
                  {isFreeWeek ? 'INSCREVER-SE GRATUITAMENTE' : 'INSCREVER-SE'}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default TrialClass;
