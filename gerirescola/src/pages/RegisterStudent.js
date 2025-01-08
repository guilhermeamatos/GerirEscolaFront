import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import SidebarManager from '../components/SidebarManager';
import { jwtDecode } from 'jwt-decode';

const RegisterStudent = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [schoolId, setSchoolId] = useState(null); // Estado separado para schoolId
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    birthdate: '',
    cpf: '',
    address: '',
    phone: '',
    email: '',
    schoolYear: '',
    classId: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formErrors, setFormErrors] = useState({
    name: false,
    birthdate: false,
    schoolYear: false,
  });

  // Mapeamento dos anos escolares disponíveis
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

  // Obter ID da escola do token e carregar as turmas
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setSchoolId(decoded.schoolId); // Define o schoolId no estado

      // Buscar classes relacionadas à escola
      const fetchClasses = async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/classes/school/${decoded.schoolId}`);
          if (!response.ok) {
            throw new Error('Erro ao buscar turmas.');
          }
          const data = await response.json();
          setClasses(data);
        } catch (err) {
          setError(err.message);
        }
      };
      fetchClasses();
    } else {
      setError('Token não encontrado. Faça login novamente.');
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const errors = {
      name: formData.name === '',
      birthdate: formData.birthdate === '',
      schoolYear: formData.schoolYear === '',
    };

    setFormErrors(errors);

    return !Object.values(errors).includes(true); // Retorna falso se houver algum erro
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Valida o formulário antes de enviar
    if (!validateForm()) {
      return;
    }

    // Adiciona o schoolId no payload e remove campos opcionais vazios
    const formDataToSend = {
      ...formData,
      schoolId,
    };

    // Remove campos opcionais que estão vazios
    const filteredData = Object.fromEntries(
      Object.entries(formDataToSend).filter(([_, value]) => value !== '' && value !== null)
    );

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(filteredData), // Envia apenas os campos preenchidos
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao cadastrar o estudante.');
      }

      setSuccess('Estudante cadastrado com sucesso!');
      setFormData({
        name: '',
        birthdate: '',
        cpf: '',
        address: '',
        phone: '',
        email: '',
        schoolYear: '',
        classId: '',
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="register-student">
      <Header toggleSidebarCoordinator={toggleSidebar} />
      <div className={`main-layout ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <SidebarManager isOpen={isSidebarOpen} />
        <main className="content">
          <div className="form-container">
            <h2>Cadastro de Estudante</h2>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <form className="student-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nome <span className="required">*</span></label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={formErrors.name ? 'input-error' : ''}
                />
                {formErrors.name && <span className="error-message">Este campo é obrigatório</span>}
              </div>
              <div className="form-group">
                <label>Data de Nascimento <span className="required">*</span></label>
                <input
                  type="date"
                  name="birthdate"
                  value={formData.birthdate}
                  onChange={handleChange}
                  required
                  className={formErrors.birthdate ? 'input-error' : ''}
                />
                {formErrors.birthdate && <span className="error-message">Este campo é obrigatório</span>}
              </div>
              <div className="form-group">
                <label>CPF</label>
                <input
                  type="text"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  maxLength={11}
                />
              </div>
              <div className="form-group">
                <label>Endereço</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Telefone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Ano Escolar <span className="required">*</span></label>
                <select
                  name="schoolYear"
                  value={formData.schoolYear}
                  onChange={handleChange}
                  required
                  className={formErrors.schoolYear ? 'input-error' : ''}
                >
                  <option value="">Selecione um ano escolar</option>
                  {schoolYearOptions.map((year) => (
                    <option key={year.value} value={year.value}>
                      {year.label}
                    </option>
                  ))}
                </select>
                {formErrors.schoolYear && <span className="error-message">Este campo é obrigatório</span>}
              </div>
              <div className="form-group">
                <label>Turma</label>
                <select
                  name="classId"
                  value={formData.classId}
                  onChange={handleChange}
                >
                  <option value="">Selecione uma turma (opcional)</option>
                  {classes.map((classItem) => (
                    <option key={classItem.id} value={classItem.id}>
                      {classItem.name}
                    </option>
                  ))}
                </select>
              </div>
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

export default RegisterStudent;
