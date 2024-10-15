import React, { useState } from 'react';
import axios from 'axios';
import '../styles/CadastroProfessor.css'; // CSS para o cadastro de professor

const CadastroProfessor = () => {
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    address: '',
    phone: '',
    email: '',
    password: '',
    specialization: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.cpf || !formData.address || !formData.phone || !formData.email || !formData.password || !formData.specialization) {
      setErrorMessage('Por favor, preencha todos os campos.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/teachers', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Professor cadastrado com sucesso!', response.data);
      setSuccessMessage('Professor cadastrado com sucesso!');
      setFormData({
        name: '',
        cpf: '',
        address: '',
        phone: '',
        email: '',
        password: '',
        specialization: ''
      });
    } catch (error) {
      console.error('Erro ao cadastrar professor:', error);
      setErrorMessage('Erro ao cadastrar professor. Tente novamente.');
    }
  };

  return (
    <div className="form-container">
      <h2>Cadastro de Professor</h2>

      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <form onSubmit={handleSubmit} className="teacher-form">
        <label htmlFor="name">Nome:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="cpf">CPF:</label>
        <input
          type="text"
          id="cpf"
          name="cpf"
          value={formData.cpf}
          onChange={handleChange}
          required
        />

        <label htmlFor="address">Endereço:</label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
        />

        <label htmlFor="phone">Telefone:</label>
        <input
          type="text"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Senha:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <label htmlFor="specialization">Especialização:</label>
        <input
          type="text"
          id="specialization"
          name="specialization"
          value={formData.specialization}
          onChange={handleChange}
          required
        />

        <button type="submit">Cadastrar Professor</button>
      </form>
    </div>
  );
};

export default CadastroProfessor;
