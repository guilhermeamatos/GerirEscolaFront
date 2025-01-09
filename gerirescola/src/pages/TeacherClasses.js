import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SidebarTeacher from '../components/SidebarTeacher';
import '../styles/TeacherClasses.css';

const TeacherClasses = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedClassId, setExpandedClassId] = useState(null);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchTeacherClasses = async () => {
      const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Usuário não autenticado. Faça login novamente.');
        }

        const decodedToken = jwtDecode(token);
        const teacherId = decodedToken.id;

        const response = await fetch(`${API_BASE_URL}/teachers/${teacherId}/classes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Erro ao buscar as turmas do professor');
        }

        const data = await response.json();
        setClasses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherClasses();
  }, []);

  const toggleExpandClass = (classId) => {
    setExpandedClassId((prevClassId) => (prevClassId === classId ? null : classId));
  };

  const navigateToSubject = (subjectId, subjectName) => {
    navigate(`/subject/${subjectId}`, { state: { subjectName } });
  };

  return (
    <div className="teacher-classes">
      <Header toggleSidebarCoordinator={toggleSidebar} />
      <div className={`main-layout ${isSidebarOpen ? 'SidebarTeacher-open' : 'SidebarTeacher-closed'}`}>
        <SidebarTeacher isOpen={isSidebarOpen} />
        <main className="content">
          <div className="info-box">
            <h2>Suas Turmas</h2>
            {loading && <p>Carregando...</p>}
            {error && <p className="error-message">{error}</p>}
            {classes.length > 0 && (
              <ul className="class-list">
                {classes.map((classItem) => (
                  <li key={classItem.classId} className="class-item">
                    <div
                      className="class-header"
                      onClick={() => toggleExpandClass(classItem.classId)}
                    >
                      <strong>Turma:</strong> {classItem.className} ({classItem.nivel})
                    </div>
                    {expandedClassId === classItem.classId && (
                      <ul className="subject-list">
                        {classItem.subjects.map((subject) => (
                          <li
                            key={subject.subjectId}
                            className="subject-item"
                            onClick={() => navigateToSubject(subject.subjectId, subject.subjectName)}
                          >
                            {subject.subjectName}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherClasses;
