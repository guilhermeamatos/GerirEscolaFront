import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import SidebarCoordinator from '../components/SidebarCoordinator';

import '../styles/AllocateTeacher.css';

const AllocateTeacher = () => {
  const [teachers, setTeachers] = useState([]);
  const [schools, setSchools] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
  const [selectedSchoolId, setSelectedSchoolId] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/teachers`);

        if (!response.ok) {
          throw new Error('Erro ao buscar professores.');
        }

        const data = await response.json();
        setTeachers(data);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchSchools = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/schools`);

        if (!response.ok) {
          throw new Error('Erro ao buscar escolas.');
        }

        const data = await response.json();
        setSchools(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchTeachers();
    fetchSchools();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAllocate = async () => {
    if (!selectedTeacherId || !selectedSchoolId) {
      setError('Por favor, selecione um professor e uma escola.');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/teacherschool/link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teacherId: selectedTeacherId, schoolId: selectedSchoolId }),
      });

      if (!response.ok) {
        throw new Error('Erro ao alocar professor à escola.');
      }

      setSuccess('Professor alocado com sucesso!');
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="allocate-teacher-container">
      <Header toggleSidebarCoordinator={toggleSidebar} />
      <div className={`main-layout ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <SidebarCoordinator isOpen={isSidebarOpen} />

        <main className="allocate-teacher-content">
          <h1>Alocar Professor</h1>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}

          <div className="search-container">
            <input
              type="text"
              placeholder="Pesquisar professor..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          <div className="teachers-list">
            <h2>Professores</h2>
            <ul>
              {filteredTeachers.map((teacher) => (
                <li
                  key={teacher.id}
                  className={selectedTeacherId === teacher.id ? 'selected' : ''}
                  onClick={() => setSelectedTeacherId(teacher.id)}
                >
                  <strong>{teacher.name}</strong>
                  <p>Escolas: {teacher.schools && teacher.schools.length > 0 ? teacher.schools.join(', ') : 'Não alocado'}</p>

                </li>
              ))}
            </ul>
          </div>

          <div className="schools-list">
            <h2>Escolas</h2>
            <select
              value={selectedSchoolId}
              onChange={(e) => setSelectedSchoolId(e.target.value)}
            >
              <option value="">-- Selecione uma escola --</option>
              {schools.map((school) => (
                <option key={school.id} value={school.id}>
                  {school.name}
                </option>
              ))}
            </select>
          </div>

          <button className="allocate-btn" onClick={handleAllocate}>
            Alocar Professor
          </button>
        </main>
      </div>
    </div>
  );
};

export default AllocateTeacher;
