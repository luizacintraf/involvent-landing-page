import React from 'react';
import API from '../utils/gasClient';
import { useState, useEffect } from 'react';

const Teachers = ({ onTrialClick }) => {
  
  const [teachers, setTeachers] = useState([]);
  const [teacherImages, setTeacherImages] = useState({});

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await API.getSpreadsheetData('teachers');
        if (response.data && response.data.length > 0) {
          setTeachers(response.data);
          
          // Buscar imagens dos professores que tem photo_id
          const imagePromises = response.data
            .filter(teacher => teacher.photo_id || teacher.foto_id)
            .map(async (teacher) => {
              const fileId = teacher.photo_id || teacher.foto_id;
             
              try {
                const imageResponse = await API.getDriveImage(fileId);
             
                if (imageResponse.success) {
                  const base64Image = `data:${imageResponse.mimeType};base64,${imageResponse.data}`;
                  
                  return { teacherName: teacher.name, image: base64Image };
                }
              } catch (error) {
                console.error(`Erro ao carregar imagem do professor ${teacher.name}:`, error);
              }
              return null;
            });
          
          const images = await Promise.all(imagePromises);
          const imageMap = {};
          images.forEach(img => {
            if (img) {
              imageMap[img.teacherName] = img.image;
            }
          });
          setTeacherImages(imageMap);
        }
      } catch (error) {
        console.log('Usando dados de fallback para professores');
      }
    };
    
    fetchTeachers();
  }, []);


  return (
    <section id="teachers" className="teachers">
      <div className="container">
        <div className="section-header">
          <h2>Nossos Professores</h2>
          <p>Conheça a equipe de profissionais que fazem a diferença</p>
        </div>
        
        
        <div className="teachers-grid">
          {teachers.map((teacher, index) => {
            const teacherImage = teacherImages[teacher.name];
            const nameParts = teacher.name.split(' ');
            const firstName = nameParts[0];
            const lastName = nameParts.slice(1).join(' ');
            
            return (
              <div key={index} className={`teacher-card ${teacher.featured ? 'featured' : 'simple'}`}>
                <div className="teacher-photo">
                  {teacherImage ? (
                    <img 
                      src={teacherImage}
                      alt={teacher.name}
                    />
                  ) : (
                    <span style={{fontSize: '3rem'}}>{teacher.photo || teacher.foto || '👤'}</span>
                  )}
                </div>
                
                {teacher.featured ? (
                  <>
                    <h3>
                      <span className="teacher-name-first">{firstName}</span>
                      <br />
                      <span className="teacher-name-last">{lastName}</span>
                    </h3>
                    <p className="teacher-specialty">{teacher.specialty}</p>
                  </>
                ) : (
                  <>
                    <h3>{teacher.name}</h3>
                    <p className="teacher-specialty">{teacher.specialty}</p>
                    <p>{teacher.descricao || teacher.description}</p>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Teachers;
