import React from 'react';
import API from '../utils/gasClient';
import { useState, useEffect } from 'react';

const Testimonials = () => {

  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const response = await API.getSpreadsheetData('depoiments');
      setTestimonials(response.data);
    };
    fetchTestimonials();
  }, []);

  

  return (
    <section className="testimonials">
      <div className="container">
        <div className="section-header">
          <h2>O Que Nossos Alunos Dizem</h2>
          <p>Histórias reais de transformação através da dança</p>
        </div>
        
        
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="testimonial-content">
                <p>{testimonial.depoiment}</p>
              </div>
              <div className="testimonial-author">
                <h4>{testimonial.name}</h4>
                <p>{testimonial.function}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
