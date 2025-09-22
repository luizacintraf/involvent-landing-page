import React from 'react';

const About = () => {
  const stats = [
    { number: '15+', label: 'Modalidades de Dança' },
    { number: '5.000+', label: 'Pessoas Transformadas' },
    { number: '2017', label: 'Desde' },
    { number: '100%', label: 'Comunidade Acolhedora' }
  ];

  const features = [
    'Mais de 15 modalidades de dança',
    'Pagamento facilitado',
    'Comunidade de alunos exclusiva'
  ];

  return (
    <section id="about" className="about">
      <div className="container">
        <div className="section-header">
          <h2>Nossa História</h2>
          <p>Transformando vidas através da dança desde 2017</p>
        </div>
        
        <div className="about-content">
          <div className="about-text">
            <p>
              Imagine-se dançando com confiança, sem medo, sentindo a música e se divertindo como nunca antes.
              É isso que a Involvent oferece desde 2017: um espaço para transformar vidas através da dança. 
              Nosso nome significa envolvimento e essa é a nossa essência: envolver você com movimento, 
              energia e novas conexões.
            </p>
            
            <p>
              Aqui, não importa se você nunca dançou ou se já tem experiência, nós criamos um ambiente 
              acolhedor, divertido e cheio de oportunidades para você evoluir no seu ritmo. Já ajudamos 
              mais de 5.000 pessoas a vencer a timidez, aliviar o estresse, se conectar com novas 
              amizades e redescobrir a alegria de viver através da dança.
            </p>
            
            <p>
              Quando você entra na Involvent, não está entrando apenas em uma escola de dança. 
              Está entrando em uma comunidade, em uma família que vai te acolher, te incentivar 
              e comemorar cada conquista com você.
            </p>
            
            <h3>Destaques</h3>
            <ul>
              {features.map((feature, index) => (
                <li key={index}>
                  <i className="fas fa-check"></i>
                  {feature}
                </li>
              ))}
            </ul>
            
            <div className="about-link">
              <a 
                href="https://www.involvent.com.br/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                <i className="fas fa-external-link-alt"></i>
                Saiba mais sobre a Involvent
              </a>
            </div>
          </div>
          
          <div className="about-stats">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <h3>{stat.number}</h3>
                <p>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
