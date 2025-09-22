import React from 'react';
import logoImage from '../assets/logo.png';

const Footer = () => {

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <img 
                src={logoImage} 
                alt="Involvent - Escola de Dança" 
              />
            </div>
            <p>Transformando vidas através da dança desde 2017.</p>
            <div className="social-links">
              <a href="#" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" aria-label="YouTube">
                <i className="fab fa-youtube"></i>
              </a>
              <a href="#" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
            </div>
          </div>
          
          <div className="footer-section">
            <h4>Links Rápidos</h4>
            <ul>
              <li><a href="#home">Início</a></li>
              <li><a href="#benefits">Benefícios</a></li>
              <li><a href="#about">Sobre</a></li>
              <li><a href="#classes">Aulas</a></li>
              <li><a href="#teachers">Professores</a></li>
              <li><a href="#contact">Contato</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Horários</h4>
            <p>
              Segunda a Sexta: 8h às 22h<br />
              Sábado: 9h às 18h<br />
              Domingo: Fechado
            </p>
          </div>
          
          <div className="footer-section">
            <h4>Contato</h4>
            <p>
              Rua Dr. Antônio Castro Prado, 135<br />
              Taquaral, Campinas - SP<br />
              (19) 99888-2451
            </p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 Involvent - Escola de Dança. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
