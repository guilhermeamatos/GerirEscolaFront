import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import '../styles/HomeCoordinator.css';

const HomeCoordinator = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="home-coordinator">
      <Header toggleSidebar={toggleSidebar} />
      <div className={`main-layout ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Sidebar isOpen={isSidebarOpen} />
        <main className="content">
          <div className="info-box">
            <h2>Seus dados</h2>
            <p>Matrícula: 12345678</p>
            <p>Nome: Coordenador Teste</p>
            <p>Email: coordenador@email.com</p>
            <p>Campus: 1 - Teste</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomeCoordinator;
