import React from 'react';
import backgroundImage from '../assets/background.jpeg';
import FreeWeekButton from './FreeWeekButton';

const Hero = ({ onTrialClick, onModalitiesClick }) => {
  return (
    <section 
      className="hero"
      style={{
        background: `linear-gradient(135deg, rgba(109, 43, 159, 0.7) 0%, rgba(247, 43, 85, 0.7) 100%), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="hero-content">
        <h1>Bem-vindo à Involvent</h1>
        <p className="hero-subtitle">A sua melhor chance para aprender a dançar!</p>
        <p className="hero-description">
          Do iniciante ao avançado, com profissionais de qualidade e um ambiente acolhedor. 
          Descubra a paixão pela dança conosco!
        </p>
        <div className="hero-buttons">
          <FreeWeekButton onClick={onTrialClick} />
          <button className="btn btn-secondary" onClick={onModalitiesClick}>Conheça Nossas Modalidades</button>
        </div>
      </div>
    </section>
  );
};

export default Hero;