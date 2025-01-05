import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import SidebarManager from '../components/SidebarManager';
import { jwtDecode } from 'jwt-decode';

const RegisterStudent = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  useEffect(() => {
    // Obter o ID da escola do token
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      const schoolId = decoded.schoolId; // Presume-se que o ID da escola está no token
      setFormData((prevFormData) => ({ ...prevFormData, schoolId }));

      // Buscar classes relacionadas à escola
      const fetchClasses = async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/classes/school/${schoolId}`);
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

    // Filtrando campos não obrigatórios que estão vazios
    const formDataFiltered = Object.fromEntries(
      Object.entries(formData).filter(([key, value]) => value !== '' || ['name', 'birthdate', 'schoolYear'].includes(key))
    );

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formDataFiltered),
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
                <input
                  type="number"
                  name="schoolYear"
                  value={formData.schoolYear}
                  onChange={handleChange}
                  min="1"
                  max="14"
                  required
                  className={formErrors.schoolYear ? 'input-error' : ''}
                />
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
