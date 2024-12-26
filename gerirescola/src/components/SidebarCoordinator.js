import React from 'react';
import '../styles/Sidebar.css';

const SidebarCoordinator = ({ isOpen }) => {
  return (
    <aside className={`SidebarCoordinator ${isOpen ? 'open' : ''}`}>
      <nav>
        <ul>
          <li><a href="/coordinator/home">Início</a></li>
          <li><a href="/register-teacher">Cadastrar Professor</a></li>
          <li><a href="/register-school">Cadastrar Escola</a></li>
          <li><a href="/register-manager">Cadastrar Gestor</a></li>
        </ul>
      </nav>
    </aside>
  );
};

export default SidebarCoordinator;
