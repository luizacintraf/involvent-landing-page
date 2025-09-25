import React, { useState } from 'react';

const FAQ = ({ onTrialClick }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "Nunca dancei antes, consigo aprender?",
      answer: "Sim! Nosso método é pensado para iniciantes, com passos simples, aulas divertidas e acompanhamento próximo dos professores."
    },
    {
      question: "Preciso levar par para as aulas?",
      answer: "Não! Você pode vir sozinho(a), nossa metodologia cria os pares dentro da própria aula e o revezamento garante que todos dancem e aprendam."
    },
    {
      question: "Quanto tempo leva para aprender a dançar bem?",
      answer: "Depende da dedicação e da frequência, mas em poucas semanas você já consegue dançar nas festas e aproveitar os bailes!"
    },
    {
      question: "Quais estilos de dança vou aprender?",
      answer: "Dentro do plano Premium você pode aprender até 17 ritmos diferentes!"
    },
    {
      question: "Tem limite de idade para participar?",
      answer: "Não! Nossas aulas são para todas as idades e todos os níveis de experiência, nosso público é adulto e vai do mais novo com 16 anos até nosso aluno mais experiente com 82 anos."
    },
    {
      question: "Como funciona a semana de aulas abertas?",
      answer: "A primeira semana de aulas é uma experiência para você sentir o ambiente, conhecer os professores e já aprender os primeiros passos. Nela você pode, gratuitamente, conhecer todas as modalidades e assim escolher quais mais gostar!"
    },
    {
      question: "Qual a duração das aulas?",
      answer: "Cada aula tem duração de 1 hora, com momentos para aprender, praticar e se divertir."
    },
    {
      question: "Vocês fazem eventos ou bailes para os alunos?",
      answer: "Sim! Mensalmente temos bailes, festas temáticas e eventos sociais para você colocar em prática o que aprendeu e se divertir com a turma."
    },
    {
      question: "Como faço para me inscrever?",
      answer: "É só clicar no botão do WhatsApp e falar com a nossa equipe. O processo é rápido e simples!"
    },
    {
      question: "Tem promoção para novos alunos?",
      answer: "Sim! Na semana de aulas abertas temos uma super promoção de matrícula."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="faq">
      <div className="container">
        <div className="section-header">
          <h2>Perguntas Frequentes</h2>
          <p>Tire suas dúvidas sobre nossas aulas e metodologia</p>
        </div>
        
        <div className="faq-container">
          {faqs.map((faq, index) => (
            <div key={index} className={`faq-item ${openIndex === index ? 'open' : ''}`}>
              <div 
                className="faq-question"
                onClick={() => toggleFAQ(index)}
              >
                <h3>{faq.question}</h3>
                <span className="faq-icon">
                  {openIndex === index ? '−' : '+'}
                </span>
              </div>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
