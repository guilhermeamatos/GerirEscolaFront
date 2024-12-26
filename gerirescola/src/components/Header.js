import React from 'react';
import logoPrincipal from '../assets/logoPrincipal.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faCog } from '@fortawesome/free-solid-svg-icons';
import UserMenu from './UserMenu'; // Importa o componente UserMenu
import '../styles/Header.css';

const Header = ({ toggleSidebarCoordinator }) => {
  return (
    <header className="header">
      <div className="header-left">
        <img src={logoPrincipal} alt="Logo Principal" className="logo-heder" />
        <FontAwesomeIcon
          icon={faBars}
          className="menu-icon"
          onClick={toggleSidebarCoordinator}
        />
      </div>
      <div className="header-right">
        
        <UserMenu /> {/* Adiciona o menu suspenso do usuário */}
      </div>
    </header>
  );
};

export default Header;
