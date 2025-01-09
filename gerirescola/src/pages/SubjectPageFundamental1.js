import React, { useState, useEffect } from 'react';
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
  const { subjectId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/lessons/subject/${subjectId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

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

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/lessons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao cadastrar aula.');
      }

      const newLesson = await response.json();
      setLessons((prevLessons) => [...prevLessons, newLesson]);
      setSuccess('Aula registrada com sucesso!');

      // Redirecionar para a página de registro de frequência
      navigate(`/attendance/${newLesson.id}`, { state: { subjectId } });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={`subject-page-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <Header toggleSidebarCoordinator={toggleSidebar} />
      <div className="main-layout">
        <SidebarTeacher isOpen={isSidebarOpen} />
        <main className="content">
          <div className="lessons-container">
            <h2>Aulas</h2>
            {loading && <p>Carregando...</p>}
            {error && <p className="error-message">{error}</p>}
            <ul className="lessons-list">
              {lessons.map((lesson) => (
                <li key={lesson.id} className="lesson-item">
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
                        <label htmlFor="description">Descrição (Opcional)</label>
                        <textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                        ></textarea>
                      </div>
                      <div className="form-actions">
                        <button type="submit" className="submit-btn">
                          Salvar
                        </button>
                        <button type="button" className="cancel-btn" onClick={toggleAddLesson}>
                          Cancelar
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </li>
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SubjectPageFundamental1;
