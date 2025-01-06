import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import SidebarManager from '../components/SidebarManager';
import { jwtDecode } from 'jwt-decode';

const EnrollStudent = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [schoolId, setSchoolId] = useState(null);
  const [schoolYear, setSchoolYear] = useState('');
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    classId: '',
    studentId: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const schoolYearOptions = [
    { label: 'Berçário I', value: 1 },
    { label: 'Berçário II', value: 2 },
    { label: 'Maternal I', value: 3 },
    { label: 'Maternal II', value: 4 },
    { label: 'Pré I', value: 5 },
    { label: 'Pré II', value: 6 },
    { label: '1º ano', value: 7 },
    { label: '2º ano', value: 8 },
    { label: '3º ano', value: 9 },
    { label: '4º ano', value: 10 },
    { label: '5º ano', value: 11 },
    { label: '6º ano', value: 12 },
    { label: '7º ano', value: 13 },
    { label: '8º ano', value: 14 },
    { label: '9º ano', value: 15 },
  ];

  useEffect(() => {
    // Obter o ID da escola do token
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setSchoolId(decoded.schoolId);
    } else {
      setError('Token não encontrado. Faça login novamente.');
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleYearChange = async (e) => {
    const year = e.target.value;
    setSchoolYear(year);
    setFormData({ classId: '', studentId: '' });
    setClasses([]);
    setStudents([]);
    setError('');

    if (year && schoolId) {
      try {
        const [classesResponse, studentsResponse] = await Promise.all([
          fetch(`${process.env.REACT_APP_API_BASE_URL}/classes/${schoolId}/${year}`),
          fetch(`${process.env.REACT_APP_API_BASE_URL}/students/${schoolId}/${year}`),
        ]);

        if (!classesResponse.ok || !studentsResponse.ok) {
          throw new Error('Erro ao buscar turmas ou estudantes.');
        }

        const classesData = await classesResponse.json();
        const studentsData = await studentsResponse.json();
        if (!classesData.length) {
          throw new Error('Nenhuma turma encontrada cadastre uma turma para continuar.');
        }
        if (!studentsData.length) {
            throw new Error('Nenhum estudante encontrado cadastre um estudante para continuar.');
        }

        setClasses(classesData);
        setStudents(studentsData);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/students/link-to-class`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });
      console.log("JSON: ", JSON.stringify(formData));

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao matricular estudante.');
      }

      setSuccess('Estudante matriculado com sucesso!');
      setFormData({ classId: '', studentId: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="enroll-student">
      <Header toggleSidebarCoordinator={toggleSidebar} />
      <div className={`main-layout ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <SidebarManager isOpen={isSidebarOpen} />
        <main className="content">
          <div className="form-container">
            <h2>Matrícula de Estudante</h2>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <form className="enrollment-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Ano Escolar</label>
                <select
                  name="schoolYear"
                  value={schoolYear}
                  onChange={handleYearChange}
                  required
                >
                  <option value="">Selecione um ano escolar</option>
                  {schoolYearOptions.map((year) => (
                    <option key={year.value} value={year.value}>
                      {year.label}
                    </option>
                  ))}
                </select>
              </div>

              {classes.length > 0 && (
                <div className="form-group">
                  <label>Turma</label>
                  <select
                    name="classId"
                    value={formData.classId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecione uma turma</option>
                    {classes.map((classItem) => (
                      <option key={classItem.id} value={classItem.id}>
                        {classItem.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {students.length > 0 && (
                <div className="form-group">
                  <label>Estudante</label>
                  <select
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecione um estudante</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button type="submit" className="button">
                Matricular
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EnrollStudent;
