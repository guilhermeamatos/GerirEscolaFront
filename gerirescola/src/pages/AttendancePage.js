import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';

const AttendancePage = () => {
  const [students, setStudents] = useState([]);
  const [absentStudentIds, setAbsentStudentIds] = useState([]);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const { lessonId } = useParams(); // Obter lessonId pela URL
  const location = useLocation();
  const { subjectId } = location.state; // Obter subjectId pelo state

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/students/subject/${subjectId}`);
        if (!response.ok) {
          throw new Error('Erro ao buscar alunos.');
        }
        const data = await response.json();
        setStudents(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchStudents();
  }, [subjectId]);

  const toggleAttendance = (studentId) => {
    setAbsentStudentIds((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]
    );
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/lessons/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ lessonId, absentStudentIds }), // Inclui lessonId da URL
      });

      if (!response.ok) {
        throw new Error('Erro ao registrar presença.');
      }

      setSuccess('Presença registrada com sucesso!');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Registro de Presença</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <table>
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
                <button onClick={() => toggleAttendance(student.id)}>
                  {absentStudentIds.includes(student.id) ? 'Ausente' : 'Presente'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleSubmit}>Salvar Presença</button>
    </div>
  );
};

export default AttendancePage;
