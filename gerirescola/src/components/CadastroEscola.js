import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importa o hook para redirecionamento
import '../styles/CadastroEscola.css';

const CadastroEscola = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    founded_at: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // Hook para redirecionamento

  // Função para atualizar o estado com os valores dos inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrorMessage(''); // Limpa a mensagem de erro ao alterar qualquer campo
  };

  // Função para validar se todos os campos estão preenchidos
  const validateForm = () => {
    const { name, address, phone, email, founded_at } = formData;
    if (!name || !address || !phone || !email || !founded_at) {
      return false;
    }
    return true;
  };

  // Função para enviar os dados ao backend
  const handleSubmit = async () => {
    if (!validateForm()) {
      setErrorMessage('Por favor, preencha todos os campos.');
      return; // Não envia os dados se a validação falhar
    }

    const payload = {
      name: formData.name,
      address: formData.address,
      phone: formData.phone,
      email: formData.email,
      foundedAt: formData.founded_at,
    };

    try {
      const response = await axios.post('http://localhost:3000/schools', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const schoolId = response.data.id; // Salva o id da escola retornado
      console.log('Escola cadastrada com sucesso! ID da escola:', schoolId);

      // Redireciona para a página de cadastro de gestor, passando o ID da escola
      navigate(`/cadastro-gestor`, { state: { schoolId } });
    } catch (error) {
      console.error('Erro ao cadastrar escola:', error);
      setErrorMessage('Erro ao cadastrar a escola.');
    }
  };

  return (
    <div className="form-container">
      <h2>Cadastro de Escola</h2>

      {/* Exibir mensagem de erro, se houver */}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      <form className="school-form">
        <label htmlFor="name">Nome:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
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

        <label htmlFor="founded_at">Data de Fundação:</label>
        <input
          type="date"
          id="founded_at"
          name="founded_at"
          value={formData.founded_at}
          onChange={handleChange}
          required
        />

        <button type="button" onClick={handleSubmit}>
          Cadastrar Escola
        </button>
      </form>
    </div>
  );
};

export default CadastroEscola;
