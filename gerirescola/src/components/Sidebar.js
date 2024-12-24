import React from 'react';
import '../styles/Sidebar.css';

const Sidebar = ({ isOpen }) => {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <nav>
        <ul>
          <li><a href="/home">Início</a></li>
          <li><a href="/register-teacher">Cadastrar Professor</a></li>
          <li><a href="/register-school">Cadastrar Escola</a></li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
