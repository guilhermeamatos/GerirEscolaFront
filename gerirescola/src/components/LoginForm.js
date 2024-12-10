import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import logoPrincipal from '../assets/logoPrincipal.png';
import '../styles/LoginForm.css';

const LoginForm = () => {
  return (
    <div className="login-page">
      {/* Logo */}
      <img src={logoPrincipal} alt="Logo Principal" className="logo" />

      {/* Formulário */}
      <div className="form-container">
        <div className="input-container">
          <span className="icon">
            <FontAwesomeIcon icon={faUser} />
          </span>
          <input type="text" placeholder="Matrícula/Usuário" />
        </div>

        <div className="input-container">
          <span className="icon">
            <FontAwesomeIcon icon={faLock} />
          </span>
          <input type="password" placeholder="Senha" />
        </div>

        {/* Opções de Login */}
        <div className="radio-options">
          <label><input type="radio" name="role" /> Professor</label>
          <label><input type="radio" name="role" /> Diretor</label>
          <label><input type="radio" name="role" /> Aluno/Responsável</label>
          <label><input type="radio" name="role" /> Coordenador</label>
        </div>

        {/* Botão Entrar */}
        <button className="button">Entrar</button>
        <p className="help-text">Está com dúvidas? <a href="/">Acesse o manual.</a></p>
      </div>
    </div>
  );
};

export default LoginForm;
