import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCog, faKey, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom'; // Importação do hook de navegação
import '../styles/UserMenu.css';

const UserMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate(); // Hook para navegação

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    // Remove o token do localStorage e redireciona para a página de login
    localStorage.removeItem('token');
    navigate('/'); // Redireciona para a página de login
  };

  const handleChangePassword = () => {
    // Lógica para alterar senha (pode ser redirecionamento ou abrir modal)
    console.log('Alterar senha');
  };

  return (
    <div className="user-menu">
      <div className="user-icon" onClick={toggleMenu}>
        <FontAwesomeIcon icon={faUser} />
      </div>
      {isMenuOpen && (
        <div className="menu-dropdown">
          <button className="menu-item" onClick={handleChangePassword}>
            <FontAwesomeIcon icon={faKey} className="menu-icon" /> Alterar Senha
          </button>
          <button className="menu-item" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} className="menu-icon" /> Sair
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
