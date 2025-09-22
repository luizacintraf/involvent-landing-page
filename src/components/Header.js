import React, { useState, useEffect } from 'react';
import logoImage from '../assets/logo.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };


  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <img 
              src={logoImage} 
              alt="Involvent - Escola de Dança" 
            />
          </div>
          
          <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
            <li><a href="#home" onClick={closeMenu}>Início</a></li>
            <li><a href="#benefits" onClick={closeMenu}>Benefícios</a></li>
            <li><a href="#about" onClick={closeMenu}>Sobre</a></li>
            <li><a href="#classes" onClick={closeMenu}>Aulas</a></li>
            <li><a href="#teachers" onClick={closeMenu}>Professores</a></li>
            <li><a href="#plans" onClick={closeMenu}>Planos</a></li>
            <li><a href="#faq" onClick={closeMenu}>FAQ</a></li>
            <li><a href="#contact" onClick={closeMenu}>Contato</a></li>
          </ul>
          
          <div className="hamburger" onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
