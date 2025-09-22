import React from 'react';
import { useFreeWeek } from '../contexts/FreeWeekContext';

const FreeWeekButton = ({ 
  onClick, 
  className = "btn btn-primary", 
  showEmoji = true,
  showSubtext = true,
  disabled = false 
}) => {
  const { getButtonText, getButtonSubtext, loading, isActive } = useFreeWeek();

  if (loading) {
    return (
      <button className={className} disabled>
        Carregando...
      </button>
    );
  }

  const buttonText = getButtonText();
  const buttonSubtext = getButtonSubtext();

  return (
    <button 
      className={className} 
      onClick={onClick}
      disabled={disabled}
      style={{
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {showEmoji && '🎉 '}{buttonText}
      {showSubtext && buttonSubtext && (
        <span className="button-subtext">({buttonSubtext})</span>
      )}
      
      {/* Indicador especial para semana ativa */}
      {isActive && (
        <span 
          style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            background: '#ff4757',
            color: 'white',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            animation: 'pulse 2s infinite'
          }}
        >
          !
        </span>
      )}
    </button>
  );
};

export default FreeWeekButton;
