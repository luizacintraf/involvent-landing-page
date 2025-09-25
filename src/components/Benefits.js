import React from 'react';
import FreeWeekButton from './FreeWeekButton';

const Benefits = ({ onTrialClick }) => {
  const benefits = [
    {
      icon: '🎓',
      title: 'Aprenda de forma fácil e divertida',
      items: [
        'Método simples para iniciantes, mesmo sem experiência',
        'Aulas práticas e dinâmicas para aprender dançando',
        'Professores experientes e atenciosos'
      ]
    },
    {
      icon: '📈',
      title: 'Evolua no seu ritmo',
      items: [
        'Do zero ao nível avançado, sem pressão',
        'Ambiente acolhedor, sem julgamentos'
      ]
    },
    {
      icon: '😊',
      title: 'Mais confiança e autoestima',
      items: [
        'Perca a vergonha e dance em qualquer lugar',
        'Aumente sua autoconfiança e se sinta bem',
        'Ative sua criatividade e liberdade de expressão'
      ]
    },
    {
      icon: '❤️',
      title: 'Bem-estar físico e mental',
      items: [
        'Reduz estresse e ansiedade',
        'Exercício divertido que melhora saúde e humor'
      ]
    },
    {
      icon: '👥',
      title: 'Conexões e experiências únicas',
      items: [
        'Faça novas amizades e socialize',
        'Fortaleça relacionamentos com momentos especiais',
        'Participe de bailes, festas e eventos temáticos'
      ]
    },
    {
      icon: '🏆',
      title: 'Comodidade além da dança',
      items: [
        'Melhor custo benefício da região',
        'Estacionamento próprio',
        'Suporte online'
      ]
    }
  ];

  return (
    <section id="benefits" className="benefits">
      <div className="container">
        <div className="section-header">
          <h2>Benefícios</h2>
          <p>Descubra como a dança pode transformar sua vida</p>
        </div>
        
        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <div key={index} className="benefit-card">
              <div className="benefit-icon">
                <span style={{fontSize: '2.5rem'}}>{benefit.icon}</span> 
              </div>
              <h3>{benefit.title}</h3>
              <ul>
                {benefit.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        

          <FreeWeekButton 
            style={{ marginTop: '3rem' }}
            onClick={onTrialClick}
          />
      </div>
    </section>
  );
};

export default Benefits;
