import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import SidebarTeacher from '../components/SidebarTeacher';
import '../styles/AttendancePage.css';
import { useNavigate } from 'react-router-dom';


const AttendancePage = () => {
  const [students, setStudents] = useState([]);
  const [absentStudentIds, setAbsentStudentIds] = useState([]);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { lessonId } = useParams(); // Obter lessonId pela URL
  const location = useLocation();
  const { subjectId } = location.state; // Obter subjectId pelo state

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        // Buscar lista de alunos da disciplina
        const studentsResponse = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/students/subject/${subjectId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        if (!studentsResponse.ok) {
          throw new Error('Erro ao buscar alunos.');
        }

        let studentsData = await studentsResponse.json();

        // Ordenar estudantes por nome em ordem alfabética
        studentsData = studentsData.sort((a, b) =>
          a.name.localeCompare(b.name)
        );

        setStudents(studentsData);

        // Buscar frequência existente
        const attendanceResponse = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/lessons/attendance/${lessonId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        if (!attendanceResponse.ok) {
          // Se não houver frequência, assume-se que todos os alunos estão presentes
          setAbsentStudentIds([]);
          return;
        }

        const attendanceData = await attendanceResponse.json();

        // Filtrar os IDs dos estudantes ausentes
        const absentIds = attendanceData
          .filter((record) => !record.present) // Filtra os registros onde `present` é falso
          .map((record) => record.studentId); // Mapeia apenas os IDs dos estudantes ausentes

        setAbsentStudentIds(absentIds); // Define os IDs dos estudantes ausentes no estado
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [lessonId, subjectId]);

  const toggleAttendance = (studentId) => {
    setAbsentStudentIds((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId) // Remove da lista de ausentes
        : [...prev, studentId] // Adiciona à lista de ausentes
    );
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        lessonId,
        absentStudentIds,
      };

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/lessons/attendance`,
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
        throw new Error('Erro ao registrar presença.');
      }

      setSuccess('Presença registrada com sucesso!');

      setTimeout(() => {
        navigate(-1);
      }, 1000);
      
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={`attendance-page-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <Header toggleSidebarCoordinator={toggleSidebar} />
      <div className="main-layout">
        <SidebarTeacher isOpen={isSidebarOpen} />
        <main className="content">
          <div className="attendance-container">
            <h2>Registro de Presença</h2>
            {loading && <p>Carregando...</p>}
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td>{student.name}</td>
                    <td>
                      <button
                        className={`attendance-button ${
                          absentStudentIds.includes(student.id) ? 'absent' : 'present'
                        }`}
                        onClick={() => toggleAttendance(student.id)}
                      >
                        {absentStudentIds.includes(student.id) ? 'Ausente' : 'Presente'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="submit-attendance-button" onClick={handleSubmit}>
              Salvar Presença
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AttendancePage;
