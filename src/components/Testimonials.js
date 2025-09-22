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
              {testimonial.link && (
                <div className="testimonial-video">
                  <iframe
                    src={testimonial.link}
                    title={`Depoimento de ${testimonial.name}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
              <div className="testimonial-author">
                <h4>{testimonial.name}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
