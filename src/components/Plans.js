import React, { useState, useEffect } from 'react';
import API from '../utils/gasClient';

const Plans = ({ onTrialClick }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await API.getSpreadsheetData('plans');
        if (response.data && response.data.length > 0) {
          setPlans(response.data);
        } else {
          // Dados de fallback
          setPlans([
            {
              Plan: 'Premium',
              Frequency: 'Recorrente',
              Price: 'R$ 239,90',
              advantages: 'Todas as modalidades',
              description: 'No plano Premium você faz todas as modalidades que quiser*! Pode fazer várias aulas por dia, todos os dias :)'
            },
            {
              Plan: 'Premium',
              Frequency: 'Mensal',
              Price: 'R$ 319,90',
              advantages: 'Todas as modalidades',
              description: 'No plano Premium você faz todas as modalidades que quiser*! Pode fazer várias aulas por dia, todos os dias :)'
            },
            {
              Plan: 'Básico',
              Frequency: 'Recorrente',
              Price: 'R$ 145,00',
              advantages: '01 MODALIDADE',
              description: 'No plano Básico você pode fazer 1 modalidade, 1 vez por semana'
            },
            {
              Plan: 'Básico',
              Frequency: 'Mensal',
              Price: 'R$ 169,90',
              advantages: '01 MODALIDADE',
              description: 'No plano Básico você pode fazer 1 modalidade, 1 vez por semana'
            }
          ]);
        }
      } catch (error) {
        console.log('Erro ao carregar planos, usando dados de fallback');
        setPlans([
          {
            Plan: 'Premium',
            Frequency: 'Recorrente',
            Price: 'R$ 239,90',
            advantages: 'Todas as modalidades',
            description: 'No plano Premium você faz todas as modalidades que quiser*! Pode fazer várias aulas por dia, todos os dias :)'
          },
          {
            Plan: 'Básico',
            Frequency: 'Recorrente',
            Price: 'R$ 145,00',
            advantages: '01 MODALIDADE',
            description: 'No plano Básico você pode fazer 1 modalidade, 1 vez por semana'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // Agrupar planos por tipo
  const groupedPlans = plans.reduce((acc, plan) => {
    if (!acc[plan.Plan]) {
      acc[plan.Plan] = [];
    }
    acc[plan.Plan].push(plan);
    return acc;
  }, {});

  if (loading) {
    return (
      <section id="plans" className="plans">
        <div className="container">
          <div className="section-header">
            <h2>Nossos Planos</h2>
            <p>Carregando...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="plans" className="plans">
      <div className="container">
        <div className="section-header">
          <h2>Nossos Planos</h2>
          <p>Escolha o plano ideal para você e comece a dançar hoje mesmo!</p>
        </div>
        
        <div className="plans-grid">
          {Object.entries(groupedPlans).map(([planType, planOptions]) => (
            <div key={planType} className="plan-card">
              <div className="plan-header">
                <h3>{planType}</h3>
                <div className="plan-options">
                  {planOptions.map((plan, index) => (
                    <div key={index} className="plan-option">
                      <div className="plan-frequency">
                        {plan.Frequency === 'Recorrente' ? '🔄' : '📅'} {plan.Frequency}
                      </div>
                      <div className="plan-price">{plan.Price}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="plan-advantages">
                <h4>{planOptions[0].advantages}</h4>
                <p>{planOptions[0].description}</p>
              </div>
              
              <div className="plan-features">
                {planType === 'Premium' ? (
                  <>
                    <div className="feature">✅ Todas as modalidades</div>
                    <div className="feature">✅ Aulas ilimitadas</div>
                  </>
                ) : (
                  <>
                    <div className="feature">✅ 1 modalidade escolhida</div>
                    <div className="feature">✅ 1 aula por semana</div>
                  </>
                )}
              </div>
              
              <div className="plan-actions">
                <button 
                  className="cta-button"
                  onClick={onTrialClick}
                >
                  🎉 Aula Experimental Gratuita
                </button>
                <button className="btn btn-secondary">
                  Quero este plano
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="plans-footer">
          <p>💡 <strong>Dica:</strong> Comece com a aula experimental gratuita para conhecer nossa metodologia!</p>
          <p>📞 Dúvidas? Entre em contato: (19) 99888-2451</p>
        </div>
      </div>
    </section>
  );
};

export default Plans;
