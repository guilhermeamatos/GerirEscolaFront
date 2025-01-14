import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Atualizado aqui
import Header from '../components/Header';
import SidebarManager from '../components/SidebarManager';
import '../styles/BoletimByClass.css'

const BoletimByClass = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const token = localStorage.getItem('token');
        const decoded = jwtDecode(token); // Atualizado aqui
        const schoolId = decoded.schoolId;

        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/classes/school/${schoolId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        

        if (!response.ok) {
          throw new Error('Erro ao buscar as turmas.');
        }

        const data = await response.json();
        setClasses(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchClasses();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleDownloadReport = async () => {
    if (!selectedClassId) {
      setError('Por favor, selecione uma turma.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/report/class/${selectedClassId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      if (!response.ok) {
        throw new Error('Erro ao gerar boletins.');
      }
      

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Boletim_Turma_${selectedClassId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-page-container">
      <Header toggleSidebarCoordinator={toggleSidebar} />
      <div
        className={`main-layout ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}
      >
        <SidebarManager isOpen={isSidebarOpen} />

        <main className="report-page-content">
          <h1>Gerar Boletins</h1>
          {error && <p className="error-message">{error}</p>}

          <div className="class-selection-container">
            <label htmlFor="class-select">Selecione uma Turma:</label>
            <select
              id="class-select"
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
            >
              <option value="">-- Selecione --</option>
              {classes.map((classItem) => (
                <option key={classItem.id} value={classItem.id}>
                  {classItem.name}
                </option>
              ))}
            </select>
          </div>

          <button
            className="generate-report-btn"
            onClick={handleDownloadReport}
            disabled={loading}
          >
            {loading ? 'Gerando...' : 'Gerar Boletins'}
          </button>
        </main>
      </div>
    </div>
  );
};

export default BoletimByClass;
