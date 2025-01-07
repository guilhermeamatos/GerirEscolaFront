import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Sidebar.css';

const SidebarTeacher = ({ isOpen }) => {
  const navigate = useNavigate();

  const goToRegisterTeacher = (e) => {
    e.preventDefault(); // Previne o comportamento padrão do link
    navigate('/register-teacher', { state: { role: 'manager' } });
  };

  return (
    <aside className={`SidebarCoordinator ${isOpen ? 'open' : ''}`}>
      <nav>
        <ul>{/*  */}
          <li><a href="/teacher/home">Início</a></li>
          <li><a href="/teacher/classes">Minhas Turmas</a></li>
         
        </ul>
      </nav>
    </aside>
  );
};

export default SidebarTeacher;
