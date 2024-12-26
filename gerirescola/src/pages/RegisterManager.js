import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import SidebarCoordinator from '../components/SidebarCoordinator';


const RegisterManager = () => {
  const [isSidebarCoordinatorOpen, setIsSidebarCoordinatorOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    phone: '',
    email: '',
    schoolId: '',
  });
  const [schools, setSchools] = useState([]); // Lista de escolas
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const toggleSidebarCoordinator = () => {
    setIsSidebarCoordinatorOpen(!isSidebarCoordinatorOpen);
  };

  // Busca a lista de escolas ao carregar a página
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/schools`);
        if (!response.ok) {
          throw new Error('Erro ao carregar as escolas.');
        }
        const data = await response.json();
        setSchools(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchSchools();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCPFChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
    const formattedCPF = rawValue
      .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona o primeiro ponto
      .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona o segundo ponto
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Adiciona o traço
    setFormData({
      ...formData,
      cpf: formattedCPF,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Remove formatação do CPF antes de enviar
    const formDataToSend = {
      ...formData,
      cpf: formData.cpf.replace(/\D/g, ''), // Remove os pontos e traços
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/managers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataToSend),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao cadastrar o Gestor.');
      }

      setSuccess('Gestor cadastrado com sucesso!');
      setFormData({
        name: '',
        cpf: '',
        phone: '',
        email: '',
        schoolId: '',
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="register-manager">
      <Header toggleSidebarCoordinator={toggleSidebarCoordinator} />
      <div className={`main-layout ${isSidebarCoordinatorOpen ? 'SidebarCoordinator-open' : 'SidebarCoordinator-closed'}`}>
        <SidebarCoordinator isOpen={isSidebarCoordinatorOpen} />
        <main className="content">
          <div className="form-container">
            <h2>Cadastro de Gestor</h2>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <form className="manager-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nome</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>CPF</label>
                <input
                  type="text"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleCPFChange}
                  maxLength={14}
                  required
                />
              </div>
              <div className="form-group">
                <label>Telefone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Escola</label>
                <select
                  name="schoolId"
                  value={formData.schoolId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione uma escola</option>
                  {schools.map((school) => (
                    <option key={school.id} value={school.id}>
                      {school.name}
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

export default RegisterManager;
