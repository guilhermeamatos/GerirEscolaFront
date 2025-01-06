import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import SidebarManager from '../components/SidebarManager';
import { jwtDecode } from 'jwt-decode';
import '../styles/AssignTeacherToClass.css';

const AssignTeacherToClass = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [schoolId, setSchoolId] = useState(null);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState({
    classId: '',
    teacherId: '',
    subjectIds: [],
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  const fetchClassesAndTeachers = async () => {
    if (schoolId) {
      try {
        const [classesResponse, teachersResponse] = await Promise.all([
          fetch(`${process.env.REACT_APP_API_BASE_URL}/classes/school/${schoolId}`),
          fetch(`${process.env.REACT_APP_API_BASE_URL}/teachers/school/${schoolId}/teachers`),
        ]);

        if (!classesResponse.ok || !teachersResponse.ok) {
          throw new Error('Erro ao buscar turmas ou professores.');
        }

        const classesData = await classesResponse.json();
        const teachersData = await teachersResponse.json();

        setClasses(classesData);
        setTeachers(teachersData);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  useEffect(() => {
    fetchClassesAndTeachers();
  }, [schoolId]);

  const handleClassChange = (e) => {
    const classId = e.target.value;
    setFormData({ ...formData, classId });
    setError('');

    // Atualizar disciplinas com base na turma selecionada
    const selectedClass = classes.find((classItem) => classItem.id === classId);
    setSubjects(selectedClass ? selectedClass.subjects : []);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'subjectIds') {
      const updatedSubjects = formData.subjectIds.includes(value)
        ? formData.subjectIds.filter((id) => id !== value)
        : [...formData.subjectIds, value];
      setFormData({ ...formData, [name]: updatedSubjects });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/teacher-class/assign-teacher`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao alocar professor.');
      }

      setSuccess('Professor alocado com sucesso!');
      setFormData({ classId: '', teacherId: '', subjectIds: [] });
      setSubjects([]);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="assign-teacher">
      <Header toggleSidebarCoordinator={toggleSidebar} />
      <div className={`main-layout ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <SidebarManager isOpen={isSidebarOpen} />
        <main className="content">
          <div className="form-container">
            <h2>Alocar Professor a Turma</h2>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <form className="assignment-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Turma</label>
                <select
                  name="classId"
                  value={formData.classId}
                  onChange={handleClassChange}
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

              <div className="form-group">
                <label>Professor</label>
                <select
                  name="teacherId"
                  value={formData.teacherId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione um professor</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Disciplinas</label>
                <div className="checkbox-group">
                  {subjects.map((subject) => (
                    <div key={subject.id} className="checkbox-item">
                      <input
                        type="checkbox"
                        name="subjectIds"
                        value={subject.id}
                        checked={formData.subjectIds.includes(subject.id)}
                        onChange={handleChange}
                      />
                      <label>{subject.name}</label>
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" className="button">
                Alocar Professor
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AssignTeacherToClass;
