import React from 'react';
import API from '../utils/gasClient';
import { useState, useEffect } from 'react';

const Teachers = () => {
  
  const [teachers, setTeachers] = useState([
    {
      name: 'Henrique Fabiano',
      specialty: 'Ritmos Brasileiros',
      description: 'Especialista em ritmos brasileiros com mais de 10 anos de experiência.',
      photo: '👨‍🎵',
      featured: true
    },
    {
      name: 'Carolina Polezi',
      specialty: 'Forró',
      description: 'Professora especializada em forró tradicional e universitário.',
      photo: '👩‍💃',
      featured: true
    },
    {
      name: 'Erika Souza',
      specialty: 'Samba de Gafieira',
      description: 'Especialista em samba de gafieira e ritmos brasileiros.',
      photo: '👩‍🏫',
      featured: false
    },
    {
      name: 'Olvis Rodriguez',
      specialty: 'Bachata e Salsa',
      description: 'Bachata e Salsa direto de Cuba, preserva a cultura dos ritmos latinos.',
      photo: '👨‍🎨',
      featured: false
    }
  ]);
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
              console.log(`Buscando imagem para ${teacher.name} com ID: ${fileId}`);
              try {
                const imageResponse = await API.getDriveImage(fileId);
                console.log(`Resposta da imagem para ${teacher.name}:`, imageResponse);
                if (imageResponse.success) {
                  const base64Image = `data:${imageResponse.mimeType};base64,${imageResponse.data}`;
                  console.log(`Imagem base64 criada para ${teacher.name}:`, base64Image.substring(0, 100) + '...');
                  return { teacherName: teacher.name, image: base64Image };
                }
              } catch (error) {
                console.log(`Erro ao carregar imagem do professor ${teacher.name}:`, error);
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
                
                {(teacher.instagram || teacher.facebook) && (
                  <div className="teacher-social">
                    {teacher.instagram && (
                      <a href={teacher.instagram} target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-instagram"></i>
                      </a>
                    )}
                    {teacher.facebook && (
                      <a href={teacher.facebook} target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-facebook"></i>
                      </a>
                    )}
                  </div>
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
