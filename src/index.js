import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

// Garantir que o elemento root existe
const rootElement = document.getElementById('root');
if (!rootElement) {
  const root = document.createElement('div');
  root.id = 'root';
  document.body.appendChild(root);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 