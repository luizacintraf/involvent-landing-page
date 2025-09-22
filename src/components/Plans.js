import React, { useState, useEffect } from 'react';
import API from '../utils/gasClient';
import FreeWeekButton from './FreeWeekButton';

const Plans = ({ onTrialClick }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await API.getSpreadsheetData('plans');
        if (response.data && response.data.length > 0) {
          setPlans(response.data);
        }
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
                <FreeWeekButton 
                  onClick={onTrialClick}
                  className="cta-button"
                />
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
};

export default Plans;
