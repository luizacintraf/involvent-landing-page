import React from 'react';
import CONFIG from '../config.js';
import { TicketBatchContainer } from '../containers/TicketBatchContainer';
import bannerImage from '../assets/image.png';

export const HomePage = ({ onNavigate }) => {
  return (
    <div className="min-h-screen flex flex-col items-center p-4 font-body">
      <h1 className="text-5xl md:text-6xl font-display text-primary my-4 text-center">
        {CONFIG.eventInfo.title}
      </h1>
      <div className="bg-white rounded-lg p-6 shadow-lg max-w-3xl w-full mx-auto transition-all duration-300 border-2 border-primary overflow-hidden hover:-translate-y-1 hover:shadow-xl">
        <div className="relative -mx-6 -mt-6 mb-6">
          <img 
            src={bannerImage}
            alt={CONFIG.eventInfo.title}
            className="w-full object-contain"
          />
        </div>

        {CONFIG.eventDescription.cards.map((card, index) => (
          <div key={index} className={`bg-${card.color}-50 rounded-lg p-4 border border-${card.color}-200 mb-4`}>
            <h2 className="text-lg font-display text-primary mb-2">{card.title}</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {card.items.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
     
      
      <div className="mb-6">
        <TicketBatchContainer />
      </div>

      </div>

      <button 
        onClick={() => onNavigate('selecao')}
        className="w-full max-w-md mx-auto mt-4 px-8 py-4 text-xl font-display text-white rounded-full bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-[#007538] transition-all duration-300 uppercase shadow-md flex items-center justify-center gap-3"
      >
        Comprar Ingressos
      </button>
      <button 
        onClick={() => onNavigate('editOrder')}
        className="w-full max-w-md mx-auto mt-4 px-8 py-4 text-xl font-display text-white rounded-full bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-[#007538] transition-all duration-300 uppercase shadow-md flex items-center justify-center gap-3"
      >
        Editar Pedido
      </button>
    </div>
  );
};