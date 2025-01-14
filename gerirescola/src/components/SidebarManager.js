import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Sidebar.css';

const SidebarManager = ({ isOpen }) => {
  const navigate = useNavigate();

  const goToRegisterTeacher = (e) => {
    e.preventDefault(); // Previne o comportamento padrão do link
    navigate('/register-teacher', { state: { role: 'manager' } });
  };

  return (
    <aside className={`SidebarCoordinator ${isOpen ? 'open' : ''}`}>
      <nav>
        <ul>
          <li><a href="/manager/home">Início</a></li>
          <li>
            <a href="/register-teacher" onClick={goToRegisterTeacher}>
              Cadastrar Professor
            </a>
          </li>
          <li>
            <a href="/register-class">Cadastrar Turma</a>
          </li>
          <li>
            <a href="/register-student">Cadastrar Estudante</a>
          </li>
          <li>
            <a href="/enroll-student">Matricular Estudante</a>
          </li>
          <li>
            <a href="/assign-teacher-to-class">Alocar Professor</a>
          </li>
          <li>
            <a href="/boletim-class">Boletim</a>
          </li>

        </ul>
      </nav>
    </aside>
  );
};

export default SidebarManager;
