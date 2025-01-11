import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import SidebarTeacher from '../components/SidebarTeacher';
import '../styles/PerformanceRegistrationPage.css';

const PerformanceRegistrationPage = () => {
  const { subjectId } = useParams();
  const [data, setData] = useState([]);
  const [trimester, setTrimester] = useState('1'); // Trimestre selecionado
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchPerformances = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/performances/${subjectId}`);
        if (!response.ok) {
          throw new Error('Erro ao buscar registros de desempenho.');
        }
        const result = await response.json();

        // Mapear os dados para facilitar a edição
        const mappedData = result.map((entry) => ({
          studentId: entry.student.id,
          studentName: entry.student.name,
          parecer1Trimestre: entry.registrosDedesempenho?.parecere1Trimestre || '',
          parecer2Trimestre: entry.registrosDedesempenho?.parecere2Trimestre || '',
          parecer3Trimestre: entry.registrosDedesempenho?.parecere3Trimestre || '',
        }));

        setData(mappedData.sort((a, b) => a.studentName.localeCompare(b.studentName)));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformances();
  }, [subjectId, API_BASE_URL]);

  const handleInputChange = (studentId, value) => {
    setData((prevData) =>
      prevData.map((student) =>
        student.studentId === studentId
          ? {
              ...student,
              [`parecer${trimester}Trimestre`]: value,
            }
          : student
      )
    );
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    try {
      const payload = data.map((student) => ({
        studentId: student.studentId,
        parecere1Trimestre: student.parecer1Trimestre,
        parecere2Trimestre: student.parecer2Trimestre,
        parecere3Trimestre: student.parecer3Trimestre,
      }));

      const response = await fetch(`${API_BASE_URL}/performances/${subjectId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || 'Erro ao salvar registros.');
      }

      setSuccess('Registros salvos com sucesso!');
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="performance-registration-page-container">
      <Header toggleSidebarCoordinator={toggleSidebar} />
      <div className={`main-layout ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <SidebarTeacher isOpen={isSidebarOpen} />
        <main className="content-registration">
          <div className="performance-registration-page">
            <h1>Registro de Desempenho</h1>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}

            <div className="trimester-selector">
              <label htmlFor="trimester">Selecionar Trimestre:</label>
              <select
                id="trimester"
                value={trimester}
                onChange={(e) => setTrimester(e.target.value)}
              >
                <option value="1">1º Trimestre</option>
                <option value="2">2º Trimestre</option>
                <option value="3">3º Trimestre</option>
              </select>
            </div>

            {loading ? (
              <p>Carregando...</p>
            ) : (
              <div className="students-container">
                {data.map((student) => (
                  <div key={student.studentId} className="student-entry">
                    <h3>{student.studentName}</h3>
                    <textarea
                      value={student[`parecer${trimester}Trimestre`]}
                      onChange={(e) =>
                        handleInputChange(student.studentId, e.target.value)
                      }
                      placeholder={`Digite o parecer para o ${trimester}º trimestre`}
                    ></textarea>
                  </div>
                ))}
              </div>
            )}

            <button className="submit-btn" onClick={handleSubmit}>
              Salvar Registros
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PerformanceRegistrationPage;
