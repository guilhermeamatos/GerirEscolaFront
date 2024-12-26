import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const RegisterSchool = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    nivel: '',
    phone: '',
    email: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/schools`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao cadastrar a escola.');
      }

      setSuccess('Escola cadastrada com sucesso!');
      setFormData({
        name: '',
        address: '',
        nivel: '',
        phone: '',
        email: '',
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="register-school">
      <Header toggleSidebar={toggleSidebar} />
      <div className={`main-layout ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Sidebar isOpen={isSidebarOpen} />
        <main className="content">
          <div className="form-container">
            <h2>Cadastro de Escola</h2>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <form className="school-form" onSubmit={handleSubmit}>
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
                <label>Endereço</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Nível</label>
                <select
                  name="nivel"
                  value={formData.nivel}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione o nível</option>
                  <option value="INFANTIL">Infantil</option>
                  <option value="FUNDAMENTAL_1">Fundamental 1</option>
                  <option value="FUNDAMENTAL_2">Fundamental 2</option>
                  <option value="FUNDAMENTAL_1_2">Fundamental 1 e 2</option>
                  <option value="INFANTIL_FUNDAMENTAL_1">Infantil e Fundamental 1</option>
                  <option value="INFANTIL_FUNDAMENTAL_1_2">Infantil, Fundamental 1 e 2</option>
                </select>
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

export default RegisterSchool;
