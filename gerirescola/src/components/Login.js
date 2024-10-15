import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate para redirecionamento
import '../styles/Login.css'; // Importa o CSS para o login

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'manager', // Definido como "manager" por padrão
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

  // Função para definir a rota correta com base no cargo selecionado
  const getLoginRoute = () => {
    switch (formData.role) {
      case 'teacher':
        return 'http://localhost:3000/teachers/login';
      case 'coordinator':
        return 'http://localhost:3000/coordinators/login';
      case 'manager':
      default:
        return 'http://localhost:3000/managers/login';
    }
  };

  // Função para enviar os dados ao backend para realizar o login
  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      setErrorMessage('Por favor, preencha todos os campos.');
      return; // Não envia os dados se a validação falhar
    }

    const payload = {
      email: formData.email,
      password: formData.password,
    };

    try {
      const loginRoute = getLoginRoute(); // Obtenha a rota com base no cargo selecionado

      // Fazendo a requisição POST para a rota correta
      const response = await axios.post(loginRoute, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Login realizado com sucesso!', response.data);

      // Redirecionar para o dashboard após o login bem-sucedido
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro ao realizar login:', error);
      setErrorMessage('Erro ao realizar login. Verifique suas credenciais.');
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>

      {/* Exibir mensagem de erro, se houver */}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <form className="login-form">
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

        <div className="role-selection">
          <label>
            <input
              type="radio"
              name="role"
              value="manager"
              checked={formData.role === 'manager'}
              onChange={handleChange}
            />
            Gestor
          </label>

          <label>
            <input
              type="radio"
              name="role"
              value="coordinator"
              checked={formData.role === 'coordinator'}
              onChange={handleChange}
            />
            Coordenador
          </label>

          <label>
            <input
              type="radio"
              name="role"
              value="teacher"
              checked={formData.role === 'teacher'}
              onChange={handleChange}
            />
            Professor
          </label>
        </div>

        <button type="button" onClick={handleSubmit}>
          Entrar
        </button>
      </form>
    </div>
  );
};

export default Login;
