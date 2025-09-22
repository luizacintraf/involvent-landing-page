import React from 'react';
import API from '../utils/gasClient';
import { useState, useEffect } from 'react';

const Classes = () => {

  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await API.getSpreadsheetData('classes');
        if (response.data && response.data.length > 0) {
          setClasses(response.data);
        }
      } catch (error) {
        console.error('Erro ao carregar classes:', error);
      }
    };
    fetchClasses();
  }, []);
  

  return (
    <section id="classes" className="classes">
      <div className="container">
        <div className="section-header">
          <h2>Modalidades</h2>
          <p>Conheça nossas modalidades de dança</p>
        </div>
      
        
        <div className="classes-grid">
          {classes.map((danceClass, index) => (
            <div key={index} className={`class-card ${danceClass.type === 'casal' ? 'class-casal' : 'class-individual'}`}>
              <div className="class-type-badge">
                {danceClass.type === 'casal' ? 'Dança a dois' : 'Dança individual'}
              </div>
              <h3>{danceClass.title}</h3>
              <p>{danceClass.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Classes;
