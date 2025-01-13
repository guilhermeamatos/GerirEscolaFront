import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import SidebarTeacher from '../components/SidebarTeacher';
import '../styles/ClassPage.css';

const ClassPage = () => {
  const [lessons, setLessons] = useState([]);
  const [isAddingLesson, setIsAddingLesson] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', date: '' });
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { classId } = useParams();
  const navigate = useNavigate();

  // Função para formatar a data no formato dd/mm/yyyy
  const formatDateToDisplay = (date) => {
    if (!date) return '';
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/lessons-fundamental1/class/${classId}`,
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

    fetchLessons();
  }, [classId]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const toggleAddLesson = () => {
    setIsAddingLesson((prev) => !prev);
    setFormData({ name: '', description: '', date: '' });
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
      const payload = {
        ...formData,
        classId,
      };

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/lessons-fundamental1`,
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
      toggleAddLesson();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="class-page-container">
      <Header toggleSidebarCoordinator={toggleSidebar} />
      <div
        className={`main-layout ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}
      >
        <SidebarTeacher isOpen={isSidebarOpen} />

        <main className="class-page-content">
          <h1>Gerenciamento de Aulas</h1>

          {success && <p className="success-message">{success}</p>}
          {error && <p className="error-message">{error}</p>}

          <div className="lessons-container">
            <h2>Aulas</h2>
            {loading ? (
              <p>Carregando...</p>
            ) : (
              <ul className="lessons-list">
                {lessons.map((lesson) => (
                  <li key={lesson.id} className="lesson-item">
                    <strong>{lesson.name}</strong>
                    <p>{lesson.description || 'Sem descrição'}</p>
                    <p>
                      <em>Data: {formatDateToDisplay(lesson.date)}</em>
                    </p>
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
                          <label htmlFor="description">Descrição</label>
                          <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="date">Data</label>
                          <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
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
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClassPage;
