import React from 'react';
import '../styles/Menu.css';

const Menu = () => {
  return (
    <nav>
      <ul className="menu">
        <li><a href="/cadastro">Cadastrar</a></li>
        <li><a href="/login">Login</a></li>
      </ul>
    </nav>
  );
};

export default Menu;
