import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Dashboard.css'; // CSS para o Dashboard

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h1>Bem-vindo ao Painel de Controle</h1>
      <div className="main-menu">
        <ul>
          <li><Link to="/cadastrar-estudante">Cadastrar Estudante</Link></li>
          <li><Link to="/cadastrar-turma">Cadastrar Turma</Link></li>
          <li><Link to="/cadastrar-professor">Cadastrar Professor</Link></li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
