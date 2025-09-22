import React, { useState, useEffect } from 'react';
import API from '../utils/gasClient';

const TrialClassForm = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '1',
    selectedDay: '',
    selectedClass: '',
    quantity: 1,
    selectedRhythms: []
  });
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [showAddMore, setShowAddMore] = useState(false);
  const [filteredSchedule, setFilteredSchedule] = useState([]);
  const [availableDays, setAvailableDays] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [rhythmOptions, setRhythmOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [nextAvailableDate, setNextAvailableDate] = useState('');


  useEffect(() => {
    if (isOpen) {
      fetchSchedule();
    }
  }, [isOpen]);

  // Extrair dias únicos disponíveis baseado no ritmo selecionado
  useEffect(() => {
    if (filteredSchedule.length > 0) {
      const days = [...new Set(getClassesByLevel().map(cls => cls.day))];
      setAvailableDays(days);
    } else {
      setAvailableDays([]);
    }
  }, [filteredSchedule, formData.experience]);

  // Filtrar aulas baseado no ritmo selecionado
  useEffect(() => {
    if (schedule.length > 0 && formData.selectedRhythms) {
      const filtered = schedule.filter(cls => {
        return cls.style === formData.selectedRhythms;
      });
      setFilteredSchedule(filtered);
    } else {
      setFilteredSchedule([]);
    }
  }, [schedule, formData.selectedRhythms]);

  // Verificar se o ritmo selecionado tem níveis específicos
  const selectedRhythmHasLevels = () => {
    if (!formData.selectedRhythms || filteredSchedule.length === 0) return false;
    
    return filteredSchedule.some(cls => {
      const level = cls.level || cls.nivel || '—';
      return level !== '—' && level !== '' && level !== null;
    });
  };

  // Filtrar aulas por nível quando necessário
  const getClassesByLevel = () => {
    if (!selectedRhythmHasLevels()) return filteredSchedule;
    
    return filteredSchedule.filter(cls => {
      const level = cls.level || cls.nivel || '—';
      
      // Se o nível for "—", aceita todos os níveis
      if (level === '—' || level === '' || level === null) {
        return true;
      }
      
      // Para modalidades com nível específico, verificar se o usuário tem nível adequado
      const userLevel = parseInt(formData.experience) || 1;
      const classLevel = parseInt(level) || 0;
      
      return userLevel >= classLevel;
    });
  };

  // Calcular próxima data disponível
  const getNextAvailableDate = (selectedDay) => {
    if (!selectedDay) return '';
    
    const today = new Date();
    const dayMap = {
      'Segunda': 1,
      'Terça': 2,
      'Quarta': 3,
      'Quinta': 4,
      'Sexta': 5,
      'Sábado': 6,
      'Domingo': 0
    };
    
    const targetDay = dayMap[selectedDay];
    if (targetDay === undefined) return '';
    
    const daysUntilTarget = (targetDay - today.getDay() + 7) % 7;
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + (daysUntilTarget === 0 ? 7 : daysUntilTarget));
    
    return nextDate.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Atualizar próxima data quando o dia for selecionado
  useEffect(() => {
    if (formData.selectedDay) {
      const nextDate = getNextAvailableDate(formData.selectedDay);
      setNextAvailableDate(nextDate);
    }
  }, [formData.selectedDay]);

  const fetchSchedule = async () => {
    try {
      const response = await API.getSpreadsheetData('schedule');
      if (response.data && response.data.length > 0) {
        setSchedule(response.data);
        // Criar opções de ritmos únicos baseados nos dados da planilha
        const uniqueStyles = [...new Set(response.data.map(cls => cls.style))];
        setRhythmOptions(uniqueStyles.map(style => ({ id: style, name: style })));
      }
    } catch (error) {
      console.log('Erro ao carregar horários, usando dados de fallback');
      const fallbackData = [
        { style: 'FitDance', day: 'Segunda', time: '19h – 20h', teacher: 'Mayara', level: '—' },
        { style: 'Samba de Gafieira', day: 'Segunda', time: '19h – 20h', teacher: 'Henrique Fabiano', level: '1' },
        { style: 'Forró', day: 'Segunda', time: '19h – 20h', teacher: 'Carolina Polezi', level: '4' }
      ];
      setSchedule(fallbackData);
      setRhythmOptions(fallbackData.map(cls => ({ id: cls.style, name: cls.style })));
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

  const addClassToEnrollment = () => {
    if (formData.selectedClass && formData.selectedDay) {
      const selectedClassInfo = schedule.find(cls => 
        `${cls.style} - ${cls.time}` === formData.selectedClass && 
        cls.day === formData.selectedDay
      );

      const newClass = {
        id: Date.now(),
        style: selectedClassInfo ? selectedClassInfo.style : formData.selectedClass.split(' - ')[0],
        day: formData.selectedDay,
        time: selectedClassInfo ? selectedClassInfo.time : formData.selectedClass.split(' - ')[1],
        teacher: selectedClassInfo ? selectedClassInfo.teacher : '',
        level: selectedClassInfo ? selectedClassInfo.level : '',
        date: nextAvailableDate
      };

      setEnrolledClasses(prev => [...prev, newClass]);
      
      // Limpar seleções para próxima aula
      setFormData(prev => ({
        ...prev,
        selectedDay: '',
        selectedClass: '',
        selectedRhythms: ''
      }));
      
      setShowAddMore(true);
    }
  };

  const addMoreClasses = () => {
    setShowAddMore(false);
  };

  const finishEnrollment = () => {
    setShowAddMore(false);
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
    if (enrolledClasses.length === 0) {
      alert('Por favor, adicione pelo menos uma aula experimental.');
      return;
    }
    
    setLoading(true);

    try {
      
      const enrollmentData = {
        nome: formData.name,
        email: formData.email,
        telefone: formData.phone,
        nivel_experiencia: formData.experience,
        quantidade_aulas: enrolledClasses.length,
        aulas_inscritas: enrolledClasses.map(cls => ({
          modalidade: cls.style,
          dia: cls.day,
          horario: cls.time,
          professor: cls.teacher,
          nivel: cls.level,
          data: cls.date
        }))
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
      selectedDay: '',
      selectedClass: '',
      quantity: 1,
      selectedRhythms: []
    });
    setEnrolledClasses([]);
    setShowAddMore(false);
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
          <h2>Aulas Experimentais Gratuitas</h2>
          <button className="close-btn" onClick={handleClose}>×</button>
        </div>
        
        {success ? (
          <div className="success-message">
            <h3>🎉 Inscrição realizada com sucesso!</h3>
            <p>Você foi inscrito em {enrolledClasses.length} aula(s) experimental(is).</p>
            <p>Em breve entraremos em contato para confirmar os horários.</p>
            <button className="btn btn-primary" onClick={handleClose}>
              Fechar
            </button>
          </div>
        ) : showAddMore ? (
          <div className="add-more-section">
            <h3>✅ Aula adicionada com sucesso!</h3>
            <div className="enrolled-classes-list">
              <h4>Suas aulas experimentais:</h4>
              {enrolledClasses.map((cls, index) => (
                <div key={cls.id} className="enrolled-class-item">
                  <strong>{cls.style}</strong> - {cls.day} às {cls.time} ({cls.date})
                </div>
              ))}
            </div>
            <div className="add-more-options">
              <button className="btn btn-secondary" onClick={addMoreClasses}>
                Adicionar Mais Aulas
              </button>
              <button className="btn btn-primary" onClick={finishEnrollment}>
                Finalizar Inscrição
              </button>
            </div>
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
              />
            </div>

            <div className="form-group">
              <label>E-mail</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Telefone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Ritmo de interesse</label>
              <div className="rhythm-selection">
                <select name="selectedRhythms" value={formData.selectedRhythms} onChange={handleInputChange}>
                  <option value="">Selecione um ritmo</option>
                  {rhythmOptions.map(rhythm => (
                    <option key={rhythm.id} value={rhythm.id}>{rhythm.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {formData.selectedRhythms && selectedRhythmHasLevels() && (
              <div className="form-group">
                <label>Nível de experiência</label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                >
                  <option value="1">1 - Iniciante</option>
                  <option value="2">2 - Básico</option>
                  <option value="3">3 - Intermediário</option>
                  <option value="4">4 - Avançado</option>
                </select>
              </div>
            )}

            {formData.selectedRhythms && (
              <div className="form-group">
                <label>Dia da semana</label>
                <select
                  name="selectedDay"
                  value={formData.selectedDay}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecione um dia</option>
                  {[...new Set(getClassesByLevel().map(cls => cls.day))].map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
            )}

            {formData.selectedDay && formData.selectedRhythms && (
              <div className="form-group">
                <label>Aula disponível</label>
                {(() => {
                  const availableClasses = getClassesByLevel().filter(cls => cls.day === formData.selectedDay);
                  return availableClasses.length > 0 ? (
                    <select
                      name="selectedClass"
                      value={formData.selectedClass}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Selecione uma aula</option>
                      {availableClasses.map((cls, index) => (
                        <option key={index} value={`${cls.style} - ${cls.time}`}>
                          {cls.style} - {cls.time} (Prof. {cls.teacher})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="no-classes">Nenhuma aula disponível para este dia e nível.</p>
                  );
                })()}
              </div>
            )}

            {nextAvailableDate && (
              <div className="next-date-info">
                <p><strong>Próxima data disponível:</strong> {nextAvailableDate}</p>
              </div>
            )}

            {enrolledClasses.length > 0 && (
              <div className="current-enrollments">
                <h4>Suas aulas experimentais:</h4>
                {enrolledClasses.map((cls, index) => (
                  <div key={cls.id} className="enrolled-class-item">
                    <strong>{cls.style}</strong> - {cls.day} às {cls.time} ({cls.date})
                  </div>
                ))}
              </div>
            )}

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={handleClose}>
                Cancelar
              </button>
              {formData.selectedClass ? (
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={addClassToEnrollment}
                >
                  Adicionar Esta Aula
                </button>
              ) : (
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading || enrolledClasses.length === 0}
                >
                  {loading ? 'Salvando...' : 'Finalizar Inscrição (Dados obrigatórios)'}
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default TrialClassForm;