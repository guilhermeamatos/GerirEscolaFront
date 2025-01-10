import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import SidebarTeacher from '../components/SidebarTeacher';
import '../styles/GradeRegistrationPage.css';

const GradeRegistrationPage = () => {
  const { subjectId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeSection, setActiveSection] = useState('trimester1');
  const [tempInputValue, setTempInputValue] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/grades/${subjectId}`);
        if (!response.ok) {
          throw new Error('Erro ao buscar notas.');
        }
        const result = await response.json();

        // Define valores padrão como 0 se forem nulos
        const defaultAssessmentValues = result.assessmentValues || {};
        Object.keys(defaultAssessmentValues).forEach((key) => {
          if (defaultAssessmentValues[key] === null || defaultAssessmentValues[key] === undefined) {
            defaultAssessmentValues[key] = 0;
          }
        });

        const defaultGrades = result.grades.map((student) => {
          const updatedGrades = { ...student.grades };
          Object.keys(updatedGrades).forEach((key) => {
            if (updatedGrades[key] === null || updatedGrades[key] === undefined) {
              updatedGrades[key] = 0;
            }
          });
          return { ...student, grades: updatedGrades };
        });

        setData({ ...result, assessmentValues: defaultAssessmentValues, grades: defaultGrades });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, [subjectId, API_BASE_URL]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const formatToDisplay = (value) => {
    if (value === null || value === undefined) return '';
    return value.toString().replace('.', ',').replace(/^0+(?=\d)/, '');
  };

  const formatToSubmit = (value) => {
    if (!value) return 0;
    return parseFloat(value.toString().replace(',', '.'));
  };

  const handleTempInputChange = (key, value) => {
    setTempInputValue((prev) => ({ ...prev, [key]: value.replace(/^0+(?=\d)/, '') }));
  };

  const handleTempInputBlur = (key, trimester, field) => {
    let value = tempInputValue[key] || '';
    if (!value) {
      value = '0';
      setTempInputValue((prev) => ({ ...prev, [key]: value }));
    }

    if (!/^\d+(,\d+)?$/.test(value)) {
      setError('Por favor, insira um número válido.');
      return;
    }

    const formattedValue = formatToSubmit(value);
    if (field === 'rp' && formattedValue > 10) {
      setError('O valor da Recuperação Paralela (RP) não pode exceder 10.');
      return;
    }

    setError('');

    if (key.startsWith('assessment')) {
      handleAssessmentChange(trimester, field, formattedValue);
    } else {
      const [studentId] = key.split('_');
      handleGradeChange(studentId, trimester, field, formattedValue);
    }
  };

  const handleAssessmentChange = (trimester, field, value) => {
    setData((prevData) => {
      const updatedAssessment = {
        ...prevData.assessmentValues,
        [`grade${trimester}_${field}`]: value,
      };

      const trimesterSum = [1, 2, 3]
        .map((field) => updatedAssessment[`grade${trimester}_${field}`])
        .reduce((a, b) => a + b, 0);

      if (trimesterSum > 10) {
        setError(`A soma das avaliações do trimestre ${trimester} não pode ultrapassar 10.`);
        return prevData;
      }

      setError('');
      return { ...prevData, assessmentValues: updatedAssessment };
    });
  };

  const handleGradeChange = (studentId, trimester, field, value) => {
    setData((prevData) => {
      const updatedGrades = prevData.grades.map((student) => {
        if (student.studentId === studentId) {
          const maxGrade = prevData.assessmentValues[`grade${trimester}_${field}`];
          if (field !== 'rp' && value > maxGrade) {
            setError(
              `A nota para ${field} no Trimestre ${trimester} não pode ser maior que o valor da avaliação correspondente (${maxGrade}).`
            );
            return student;
          }
  
          const updatedStudentGrades = {
            ...student.grades,
            [`grade${trimester}_${field}`]: value,
          };
  
          setError('');
          return { ...student, grades: updatedStudentGrades };
        }
        return student;
      });
  
      // Correção: Removido o parêntese extra
      return { ...prevData, grades: updatedGrades };
    });
  };
  
  const handleSubmit = async () => {
    try {
      const { assessmentValues, grades } = data;

      const formattedAssessmentValues = Object.keys(assessmentValues)
        .filter((key) => key.startsWith('grade'))
        .reduce((obj, key) => {
          obj[key] = formatToSubmit(assessmentValues[key]);
          return obj;
        }, {});

      const formattedGrades = grades.map((student) => {
        const filteredGrades = Object.fromEntries(
          Object.entries(student.grades).map(([key, value]) => [key, formatToSubmit(value)])
        );

        return {
          studentId: student.studentId,
          ...filteredGrades,
        };
      });

      const payload = {
        assessmentValues: formattedAssessmentValues,
        grades: formattedGrades,
      };

      const response = await fetch(`${API_BASE_URL}/grades/${subjectId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao salvar notas.');
      }

      setSuccess('Notas salvas com sucesso!');
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const renderTrimesterSection = (trimester) => {
    if (!data) return null;

    return (
      <div className="trimester-section">
        <h3>Trimestre {trimester}</h3>
        <table>
          <thead>
            <tr>
              <th>Aluno</th>
              <th>N1</th>
              <th>N2</th>
              <th>N3</th>
              <th>RP</th>
            </tr>
            <tr>
              <th>Valores</th>
              {['1', '2', '3'].map((field) => {
                const key = `assessment_${trimester}_${field}`;
                return (
                  <th key={field}>
                    <input
                      type="text"
                      value={tempInputValue[key] ?? formatToDisplay(data.assessmentValues[`grade${trimester}_${field}`])}
                      onChange={(e) => handleTempInputChange(key, e.target.value)}
                      onBlur={() => handleTempInputBlur(key, trimester, field)}
                    />
                  </th>
                );
              })}
              <th>-</th>
            </tr>
          </thead>
          <tbody>
            {data.grades.map((student) => (
              <tr key={student.studentId}>
                <td>{student.studentName}</td>
                {['1', '2', '3', 'rp'].map((field) => {
                  const key = `${student.studentId}_${trimester}_${field}`;
                  return (
                    <td key={field}>
                      <input
                        type="text"
                        value={tempInputValue[key] ?? formatToDisplay(student.grades[`grade${trimester}_${field}`])}
                        onChange={(e) => handleTempInputChange(key, e.target.value)}
                        onBlur={() => handleTempInputBlur(key, trimester, field)}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderFinalResults = () => {
    if (!data) return null;

    const calculateResult = (grades) => {
      const trimesterResults = [1, 2, 3].map((trimester) => {
        const trimesterMedia =
          (grades[`grade${trimester}_1`] || 0) +
          (grades[`grade${trimester}_2`] || 0) +
          (grades[`grade${trimester}_3`] || 0);
        const rp = grades[`grade${trimester}_rp`] || 0;
        const finalTrimesterResult = Math.max(trimesterMedia, rp);
        return finalTrimesterResult;
      });

      const finalResult = trimesterResults.reduce((a, b) => a + b, 0) / 3;
      return {
        trimesterResults,
        finalResult,
        status: finalResult >= 6 ? 'Aprovado' : 'Reprovado',
      };
    };

    return (
      <div className="final-results-section">
        <h2>Resultados Finais</h2>
        <table>
          <thead>
            <tr>
              <th>Aluno</th>
              <th>1º Trimestre</th>
              <th>2º Trimestre</th>
              <th>3º Trimestre</th>
              <th>Resultado Final</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.grades.map((student) => {
              const results = calculateResult(student.grades);
              return (
                <tr key={student.studentId}>
                  <td>{student.studentName}</td>
                  <td>{results.trimesterResults[0].toFixed(1)}</td>
                  <td>{results.trimesterResults[1].toFixed(1)}</td>
                  <td>{results.trimesterResults[2].toFixed(1)}</td>
                  <td>{results.finalResult.toFixed(1)}</td>
                  <td className={results.status === 'Aprovado' ? 'status-approved' : 'status-failed'}>
                    {results.status}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="grade-registration-page-container">
      <Header toggleSidebarCoordinator={toggleSidebar} />
      <div className={`main-layout ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <SidebarTeacher isOpen={isSidebarOpen} />
        <main className="content">
          <div className="grade-registration-page">
            <h1>Registro de Notas</h1>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <div className="trimester-tabs">
              {['trimester1', 'trimester2', 'trimester3', 'results'].map((section, index) => (
                <button
                  key={section}
                  className={activeSection === section ? 'active' : ''}
                  onClick={() => setActiveSection(section)}
                >
                  {section === 'results' ? 'Resultados Finais' : `Trimestre ${index + 1}`}
                </button>
              ))}
            </div>
            {activeSection.startsWith('trimester') && renderTrimesterSection(Number(activeSection.slice(-1)))}
            {activeSection === 'results' && renderFinalResults()}
            <button className="submit-btn" onClick={handleSubmit} disabled={!!error}>
              Salvar Notas
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default GradeRegistrationPage;
