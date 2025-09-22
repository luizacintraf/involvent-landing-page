import React from 'react';
import API from '../utils/gasClient';
import { useState, useEffect } from 'react';

const Classes = () => {

  const [classes, setClasses] = useState([
    {
      title: 'Sertanejo Universitário',
      description: 'Ritmo mais procurado nas baladas dançado com as músicas mais tocadas no país',
      type: 'casal'
    },
    {
      title: 'Sertanejo Vanera',
      description: 'Dança abraçada, circular e fluida; lembra o forró, mas com identidade própria.',
      type: 'casal'
    },
    {
      title: 'Forró',
      description: 'Ginga marcada, giros e passos simples; dançado colado, com energia nordestina.',
      type: 'casal'
    },
    {
      title: 'Samba de Gafieira',
      description: 'Sofisticado, malandro e elegante; mistura samba com passos de salão.',
      type: 'casal'
    },
    {
      title: 'Bachata',
      description: 'Estilo dominicano, marcado pelo quadril; romântico e envolvente.',
      type: 'casal'
    },
    {
      title: 'Zouk',
      description: 'Fluido, com movimentos de ondas e cabeças soltas; sensual e musical.',
      type: 'casal'
    }
  ]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await API.getSpreadsheetData('classes');
        if (response.data && response.data.length > 0) {
          setClasses(response.data);
        }
      } catch (error) {
        console.log('Usando dados de fallback para classes');
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
