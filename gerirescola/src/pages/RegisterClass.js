import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import SidebarManager from '../components/SidebarManager';
import { jwtDecode } from 'jwt-decode';

const RegisterClass = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    schoolYear: '',
    level: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Obter ID da escola do token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setFormData((prevFormData) => ({
        ...prevFormData,
        schoolId: decoded.schoolId, 
      }));
    } else {
      setError('Token não encontrado. Faça login novamente.');
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Mapeamento do ano escolar por nível
  const schoolYearOptions = {
    INFANTIL: [
      { label: 'Berçário I', value: 1 },
      { label: 'Berçário II', value: 2 },
      { label: 'Maternal I', value: 3 },
      { label: 'Maternal II', value: 4 },
      { label: 'Pré I', value: 5 },
      { label: 'Pré II', value: 6 },
    ],
    FUNDAMENTAL_1: [
      { label: '1º ano', value: 7 },
      { label: '2º ano', value: 8 },
      { label: '3º ano', value: 9 },
      { label: '4º ano', value: 10 },
      { label: '5º ano', value: 11 },
    ],
    FUNDAMENTAL_2: [
      { label: '6º ano', value: 12 },
      { label: '7º ano', value: 13 },
      { label: '8º ano', value: 14 },
      { label: '9º ano', value: 15 },
    ],
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      ...(name === 'level' && { schoolYear: '' }), // Limpa o ano escolar ao mudar o nível
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
        const token = localStorage.getItem('token');
        const json = JSON.stringify(formData);
        console.log(json);
        if (!token) {
            throw new Error('Token não encontrado. Faça login novamente.');
        }
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/classes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao cadastrar a turma.');
      }

      setSuccess('Turma cadastrada com sucesso!');
      setFormData({
        name: '',
        schoolYear: '',
        level: '',
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="register-class">
      <Header toggleSidebarCoordinator={toggleSidebar} />
      <div className={`main-layout ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <SidebarManager isOpen={isSidebarOpen} />
        <main className="content">
          <div className="form-container">
            <h2>Cadastro de Turma</h2>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <form className="class-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nome da Turma</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Nível</label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione um nível</option>
                  <option value="INFANTIL">Infantil</option>
                  <option value="FUNDAMENTAL_1">Fundamental 1</option>
                  <option value="FUNDAMENTAL_2">Fundamental 2</option>
                </select>
              </div>
              {formData.level && (
                <div className="form-group">
                  <label>Ano Escolar</label>
                  <select
                    name="schoolYear"
                    value={formData.schoolYear}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecione um ano escolar</option>
                    {schoolYearOptions[formData.level]?.map((year) => (
                      <option key={year.value} value={year.value}>
                        {year.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <button type="submit" className="button">
                Cadastrar
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RegisterClass;
