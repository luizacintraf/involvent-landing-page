import React, { useState, useEffect } from 'react';
import API from '../utils/gasClient';
import { useFreeWeek } from '../contexts/FreeWeekContext';

const TrialClassForm = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '1',
    selectedRhythms: []
  });
  const [rhythmOptions, setRhythmOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { getWhatsAppLink, isNearFreeWeek } = useFreeWeek();


  useEffect(() => {
    if (isOpen) {
      fetchRhythms();
    }
  }, [isOpen]);

  const fetchRhythms = async () => {
    try {
      const response = await API.getSpreadsheetData('classes');
      if (response.data && response.data.length > 0) {
        setRhythmOptions(response.data.map(rhythm => ({ 
          id: rhythm.title, 
          name: rhythm.title 
        })));
      }
    } catch (error) {
      console.error('Erro ao carregar ritmos:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRhythmToggle = (rhythmId) => {
    setFormData(prev => ({
      ...prev,
      selectedRhythms: prev.selectedRhythms.includes(rhythmId)
        ? prev.selectedRhythms.filter(id => id !== rhythmId)
        : [...prev.selectedRhythms, rhythmId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar dados obrigatórios
    if (!formData.name.trim()) {
      alert('Por favor, preencha seu nome completo.');
      return;
    }
    if (!formData.email.trim()) {
      alert('Por favor, preencha seu e-mail.');
      return;
    }
    if (!formData.phone.trim()) {
      alert('Por favor, preencha seu telefone.');
      return;
    }
    if (formData.selectedRhythms.length === 0) {
      alert('Por favor, selecione pelo menos um ritmo de interesse.');
      return;
    }
    
    setLoading(true);

    try {
      const enrollmentData = {
        nome: formData.name,
        email: formData.email,
        telefone: formData.phone,
        nivel_experiencia: formData.experience,
        modalidade: formData.selectedRhythms.join(' / ')
      };

      await API.saveExperimentalEnrollment(enrollmentData);
      setSuccess(true);
    } catch (error) {
      console.error('Erro ao salvar inscrição:', error);
      alert('Erro ao salvar inscrição. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      experience: '1',
      selectedRhythms: []
    });
    setSuccess(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content trial-form">
        <div className="modal-header">
          <h2>{isNearFreeWeek ? 'Semana Experimental Gratuita' : 'Semana Experimental'}</h2>
          <button className="close-btn" onClick={handleClose}>×</button>
        </div>
        
        {success ? (
          <div className="success-message">
            <h3>🎉 Inscrição realizada com sucesso!</h3>
            <p>Você foi inscrito na {isNearFreeWeek ? 'semana experimental gratuita' : 'semana experimental'}!</p>
            
            <div className="whatsapp-group-section">
              <h4>📱 Entre no nosso grupo exclusivo!</h4>
              <p>Faça parte da nossa comunidade e receba todas as novidades:</p>
              <a 
                href={getWhatsAppLink()} 
                target="_blank" 
                rel="noopener noreferrer"
                className="whatsapp-group-link"
              >
                <i className="fab fa-whatsapp"></i>
                {isNearFreeWeek ? 'Entrar no Grupo da Semana Gratuita' : 'Entrar no Grupo do WhatsApp'}
              </a>
            </div>
            
            <button className="btn btn-primary" onClick={handleClose}>
              Fechar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="trial-form-content">
            <div className="form-group">
              <label>Nome completo</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>E-mail</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Telefone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Ritmos de interesse</label>
              <div className="rhythm-selection">
                {rhythmOptions.map(rhythm => (
                  <label key={rhythm.id} className="rhythm-checkbox">
                    <input
                      type="checkbox"
                      checked={formData.selectedRhythms.includes(rhythm.id)}
                      onChange={() => handleRhythmToggle(rhythm.id)}
                    />
                    <span>{rhythm.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Nível de experiência</label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                required
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={handleClose}>
                Cancelar
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Salvando...' : `Inscrever-se na ${isNearFreeWeek ? 'Semana Presencial Gratuita' : 'Semana Experimental'}`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default TrialClassForm;