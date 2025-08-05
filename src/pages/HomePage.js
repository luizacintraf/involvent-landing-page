import React from 'react';
import bannerImage from '../assets/image.png';
import { TicketBatchContainer } from '../containers/TicketBatchContainer';

export const HomePage = ({ onNavigate }) => (
  <div className="min-h-screen flex flex-col items-center p-4 font-body">
    <h1 className="text-5xl md:text-6xl font-display text-primary my-4 text-center">
      3<sup className="text-3xl -top-7 mx-0.5">o</sup> Arraiá PD Castelo
    </h1>
    <div className="bg-white rounded-lg p-6 shadow-lg max-w-3xl w-full mx-auto transition-all duration-300 border-2 border-primary overflow-hidden hover:-translate-y-1 hover:shadow-xl">
      <div className="relative -mx-6 -mt-6 mb-6">
        <img 
          src={bannerImage}
          alt="3o Arraiá PD Castelo"
          className="w-full object-contain"
        />
      </div>

      {/* Descrição do Evento */}
      <div className="mb-8 space-y-6">
        <div className="text-center">
          <p className="text-xl md:text-2xl font-display text-primary mb-4">
            🌽💚🔥 IRRÁAAAAAAA olha o 3° Arraiá do PD Castelo! 🔥💚🌽
          </p>
          <p className="text-gray-700">
          Chegou a época mais animada do ano, e nossa escola de forró vai se transformar em um verdadeiro arraial, com muita dança, comida boa e aquele clima de confraternização que a gente tanto ama! 🙌🏻💃🏻
          </p>
          <p>
          Vai ser a nossa festa julhina oficial, com tudo que tem direito — e o melhor: com muito forró pra gente treinar os passos, se soltar na pista e colocar em prática tudo o que aprendemos nas aulas! 💃🏻🕺🏽
          </p>
        </div>

        <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
          <h2 className="text-lg font-display text-primary mb-2">Data e Local</h2>
          <p className="text-gray-700">
            <strong>Dia:</strong> 06 de Julho de 2025 (domingo)<br />
            <strong>Horário:</strong> 14:00h às 19:00h<br />
            <strong>Local:</strong> PD Castelo
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
            <h2 className="text-lg font-display text-primary mb-2">Comidas 🍿🌭</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Caldo de Mandioca</li>
              <li>Caldo de Feijão</li>
              <li>Cachorro quente</li>
              <li>Canjica</li>
              <li>Mesa recheada de doces juninos</li>
            </ul>
          </div>

          <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
            <h2 className="text-lg font-display text-primary mb-2">Bebidas 🍺🍾🥤</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Refrigerante</li>
              <li>Suco</li>
              <li>Chopp</li>
              <li>Quentão</li>
            </ul>
          </div>
        </div>

        <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
          <h2 className="text-lg font-display text-primary mb-2">Atividades de Dança e Atrações 💃🏻🕺🏽</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Jack & Jill junino (premiação)</li>
            <li>Quadrilha</li>
            <li>Correio elegante</li>
            <li>Brincadeiras</li>
            <li>Rei e Rainha da Pipoca (melhor fantasia)</li>
            <li>Prisão</li>
            <li>E MUITO forró pra dançar, treinar e se divertir até dizer chega!s</li>
          </ul>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <h2 className="text-lg font-display text-yellow-800 mb-2">⚠️ Observação Importante</h2>
          <p className="text-yellow-800">
            Crianças e Jovens menores de 18 anos só podem permanecer no local com o responsável legal.
          </p>
        </div>

        <p className="text-center text-lg text-primary font-display">
        Capriche no look caipira, traga sua alegria e venha viver esse arraiá inesquecível com a gente! 🤩💃🏻🕺🏽
        </p>
      </div>
      
      <div className="mb-6">
        <TicketBatchContainer />
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
  </div>
);