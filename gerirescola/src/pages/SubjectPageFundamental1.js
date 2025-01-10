import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import SidebarTeacher from '../components/SidebarTeacher';
import '../styles/SubjectPageFundamental1.css';

const SubjectPageFundamental1 = () => {
  const [lessons, setLessons] = useState([]);
  const [isAddingLesson, setIsAddingLesson] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Controla se as aulas devem ser exibidas
  const [showLessons, setShowLessons] = useState(false);

  const { subjectId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/lessons/subject/${subjectId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Erro ao buscar aulas.');
        }

        const data = await response.json();
        setLessons(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Busca as aulas logo no início (mesmo que não sejam exibidas imediatamente)
    fetchLessons();
  }, [subjectId]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const toggleAddLesson = () => {
    setIsAddingLesson((prev) => !prev);
    setFormData({ name: '', description: '' });
    setSuccess(null);
    setError(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const payload = { ...formData, subjectId };
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/lessons`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao cadastrar aula.');
      }

      const newLesson = await response.json();
      setLessons((prevLessons) => [...prevLessons, newLesson]);
      setSuccess('Aula registrada com sucesso!');

      // Redireciona para o registro de presença da nova aula
      navigate(`/attendance/${newLesson.id}`, { state: { subjectId } });
    } catch (err) {
      setError(err.message);
    }
  };

  const navigateToAttendance = (lessonId) => {
    navigate(`/attendance/${lessonId}`, { state: { subjectId } });
  };

  const navigateToGradeRegistration = () => {
    navigate(`/grade-registration/${subjectId}`);
  };

  return (
    <div className="subject-page-container">
      <Header toggleSidebarCoordinator={toggleSidebar} />
      <div
        className={`main-layout ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}
      >
        <SidebarTeacher isOpen={isSidebarOpen} />

        <main className="subject-page-container">
          {/* BOTÕES NO TOPO */}
          <div className="navigation-container">
            <div className="navigation-options">
              <button
                className="navigation-btn"
                onClick={() => setShowLessons(true)}
              >
                Registro de Aulas
              </button>
              <button
                className="navigation-btn"
                onClick={navigateToGradeRegistration}
              >
                Registro de Notas
              </button>
            </div>
          </div>

          {/* EXIBE AS AULAS SOMENTE SE showLessons FOR TRUE */}
          {showLessons && (
            <div className="lessons-container">
              <h2>Aulas</h2>
              {loading && <p>Carregando...</p>}
              {error && <p className="error-message">{error}</p>}

              <ul className="lessons-list">
                {lessons.map((lesson) => (
                  <li
                    key={lesson.id}
                    className="lesson-item clickable"
                    onClick={() => navigateToAttendance(lesson.id)}
                  >
                    <strong>{lesson.name}</strong>
                    <p>{lesson.description || 'Sem descrição'}</p>
                  </li>
                ))}

                <li className="add-lesson-container">
                  {!isAddingLesson ? (
                    <button className="add-lesson-btn" onClick={toggleAddLesson}>
                      +
                    </button>
                  ) : (
                    <div className="add-lesson-form">
                      <form onSubmit={handleSubmit}>
                        {error && <p className="error-message">{error}</p>}
                        {success && <p className="success-message">{success}</p>}

                        <div className="form-group">
                          <label htmlFor="name">Tema</label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="description">
                            Descrição (Opcional)
                          </label>
                          <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="form-actions">
                          <button type="submit" className="submit-btn">
                            Salvar
                          </button>
                          <button
                            type="button"
                            className="cancel-btn"
                            onClick={toggleAddLesson}
                          >
                            Cancelar
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </li>
              </ul>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SubjectPageFundamental1;
