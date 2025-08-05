import React from 'react';

export const Button = ({ 
  children, 
  variant = 'primary', 
  onClick, 
  disabled = false,
  fullWidth = false,
  className = ''
}) => (
  <button
    className={`
      button 
      button-${variant}
      ${fullWidth ? 'button-full-width' : ''}
      ${className}
    `}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
); 