import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCog, faKey, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import '../styles/UserMenu.css';

const UserMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    // Lógica para sair do sistema
    console.log('Sair do sistema');
  };

  const handleChangePassword = () => {
    // Lógica para alterar senha
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
