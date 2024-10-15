import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom'; // Adiciona o hook useNavigate para redirecionamento
import '../styles/CadastroGestor.css'; // Importa o CSS

const CadastroGestor = () => {
  const location = useLocation();
  const { schoolId } = location.state; // Obtém o school_id do redirecionamento
  const navigate = useNavigate(); // Hook para redirecionamento

  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    address: '',
    phone: '',
    email: '',
    password: '',
    repeatPassword: '', // Campo para repetir a senha
  });
  const [errorMessage, setErrorMessage] = useState('');

  // Função para atualizar o estado com os valores dos inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrorMessage(''); // Limpa a mensagem de erro ao alterar qualquer campo
  };

  // Função para validar se todos os campos estão preenchidos e se as senhas são iguais
  const validateForm = () => {
    const { name, cpf, address, phone, email, password, repeatPassword } = formData;
    if (!name || !cpf || !address || !phone || !email || !password || !repeatPassword) {
      setErrorMessage('Por favor, preencha todos os campos.');
      return false;
    }
    if (password !== repeatPassword) {
      setErrorMessage('As senhas não coincidem.');
      return false;
    }
    return true;
  };

  // Função para enviar os dados ao backend
  const handleSubmit = async () => {
    if (!validateForm()) {
      return; // Não envia os dados se a validação falhar
    }

    // Cria o JSON no formato especificado com o schoolId
    const payload = {
      name: formData.name,
      cpf: formData.cpf,
      address: formData.address,
      phone: formData.phone,
      email: formData.email,
      password: formData.password, // Senha confirmada
      schoolId: schoolId, // Associação com a escola
    };

    try {
      // Fazendo a requisição POST para cadastrar o gestor
      const response = await axios.post('http://localhost:3000/managers', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Gestor cadastrado com sucesso!', response.data);

      // Redireciona para a página de login após o cadastro do gestor
      navigate('/login');
    } catch (error) {
      console.error('Erro ao cadastrar gestor:', error);
      setErrorMessage('Erro ao cadastrar o gestor.');
    }
  };

  return (
    <div className="form-container">
      <h2>Cadastro de Gestor</h2>

      {/* Exibir mensagem de erro, se houver */}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <form className="gestor-form">
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

        <label htmlFor="repeatPassword">Repita a Senha:</label>
        <input
          type="password"
          id="repeatPassword"
          name="repeatPassword"
          value={formData.repeatPassword}
          onChange={handleChange}
          required
        />

        <button type="button" onClick={handleSubmit}>
          Cadastrar Gestor
        </button>
      </form>
    </div>
  );
};

export default CadastroGestor;
