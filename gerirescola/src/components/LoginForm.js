import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import logoPrincipal from '../assets/logoPrincipal.png';
import '../styles/LoginForm.css';

const LoginForm = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    role: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Atualiza os campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  // Define a rota com base na role
  const getRoleEndpoint = (role) => {
    switch (role) {
      case 'Coordenador':
        return 'http://localhost:3000/api/coordinators/login/';
      case 'Diretor':
        return 'http://localhost:3000/api/directors/login/';
      case 'Professor':
        return 'http://localhost:3000/api/teachers/login/';
      case 'Aluno':
        return 'http://localhost:3000/api/students/login/';
      default:
        return null;
    }
  };

  // Envia os dados para o backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const endpoint = getRoleEndpoint(credentials.role);
    if (!endpoint) {
      setError('Selecione um papel para continuar.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro desconhecido');
      }

      console.log('Login bem-sucedido:', data);

      // Armazena o token no localStorage
      localStorage.setItem('token', data.token);

      // Redireciona para a página inicial
      navigate('coordinator/home');
    } catch (err) {
      console.error('Erro ao fazer login:', err.message);
      setError(err.message || 'Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <img src={logoPrincipal} alt="Logo Principal" className="logo" />

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <span className="icon">
              <FontAwesomeIcon icon={faUser} />
            </span>
            <input
              type="email"
              name="email"
              placeholder="E-mail"
              value={credentials.email}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div className="input-container">
            <span className="icon">
              <FontAwesomeIcon icon={faLock} />
            </span>
            <input
              type="password"
              name="password"
              placeholder="Senha"
              value={credentials.password}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div className="radio-options">
            <label>
              <input
                type="radio"
                name="role"
                value="Coordenador"
                onChange={handleChange}
                required
              />{' '}
              Coordenador
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="Diretor"
                onChange={handleChange}
              />{' '}
              Diretor
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="Professor"
                onChange={handleChange}
              />{' '}
              Professor
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="Aluno"
                onChange={handleChange}
              />{' '}
              Aluno
            </label>
          </div>

          {error && <p className="error-message">{error}</p>}
          {loading && <p className="loading-message">Carregando...</p>}

          <button type="submit" className="button" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p className="help-text">Está com dúvidas? <a href="/">Acesse o manual.</a></p>
      </div>
    </div>
  );
};

export default LoginForm;
