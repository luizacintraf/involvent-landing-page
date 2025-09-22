import React, { useState } from 'react';
import API from '../utils/gasClient';
import FreeWeekButton from './FreeWeekButton';

const Contact = ({ onTrialClick }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simular envio
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Limpar formulário
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsappClick = async () => {
    setIsSubmitting(true);
    
    try {
      // Salvar na planilha primeiro
      const contactData = {
        nome: formData.name,
        email: formData.email,
        telefone: formData.phone,
        mensagem: formData.message,
        data: new Date().toLocaleString('pt-BR')
      };

      await API.appendRows('contact', [contactData]);

      // Criar mensagem formatada
      const message = `Olá! Meu nome é ${formData.name}.

      Email: ${formData.email}
      Telefone: ${formData.phone}

      Mensagem:
      ${formData.message}`;

      let formattedMessage = encodeURIComponent(message);
    
      // Montar link do WhatsApp
      const whatsappUrl = "https://wa.me/5519998882451?text="+formattedMessage;
      
      // Abrir WhatsApp
      window.open(whatsappUrl, '_blank');

      // Limpar formulário
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });

      
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar dados. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="contact">
      <div className="container">
        <div className="section-header">
          <h2>Entre em Contato</h2>
          <p>Vamos conversar sobre como a dança pode transformar sua vida</p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <div className="contact-item">
              <h3>📍 Endereço</h3>
              <p>Rua das Flores, 123<br />Centro - Campinas/SP</p>
            </div>
            
            <div className="contact-item">
              <h3>📞 Telefone</h3>
              <p>(19) 99888-2451</p>
            </div>
            
            <div className="contact-item">
              <h3>📧 E-mail</h3>
              <p>contato@involvent.com.br</p>
            </div>
            
            <div className="contact-item">
              <h3>🕒 Horário de Funcionamento</h3>
              <p>Segunda a Sexta: 14h às 22h<br />Sábado: 9h às 17h</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Nome completo *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">E-mail *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Telefone/WhatsApp *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Mensagem *</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Conte-nos sobre seus interesses e dúvidas..."
                required
              />
            </div>

            <button 
              type="button" 
              className="btn btn-primary"
              onClick={handleWhatsappClick}
              disabled={isSubmitting}
            >
              {isSubmitting ? '⏳ Salvando...' : 'Enviar Mensagem'}
            </button>
          </form>
        </div>

        <div className="cta-section">
          <h3>Pronto para começar sua jornada na dança?</h3>
          <p>Agende sua semana experimental e descubra o prazer de dançar!</p>
          <FreeWeekButton 
            onClick={onTrialClick}
            className="btn btn-secondary"
          />
        </div>
      </div>
    </section>
  );
};

export default Contact;