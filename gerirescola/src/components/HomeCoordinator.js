import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import '../styles/HomeCoordinator.css';

const HomeCoordinator = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [coordinatorData, setCoordinatorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchCoordinatorData = async () => {
      const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Usuário não autenticado. Faça login novamente.');
        }

        const decodedToken = jwtDecode(token); // Decodifica o token corretamente
        const coordinatorId = decodedToken.id;

        const response = await fetch(`${API_BASE_URL}/coordinators/${coordinatorId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Erro ao buscar os dados do coordenador');
        }

        const data = await response.json();
        setCoordinatorData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCoordinatorData();
  }, []);

  return (
    <div className="home-coordinator">
      <Header toggleSidebar={toggleSidebar} />
      <div className={`main-layout ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Sidebar isOpen={isSidebarOpen} />
        <main className="content">
          <div className="info-box">
            <h2>Seus dados</h2>
            {loading && <p>Carregando...</p>}
            {error && <p className="error">{error}</p>}
            {coordinatorData && (
              <div>
                <p><strong>Nome:</strong> {coordinatorData.name}</p>
                <p><strong>CPF:</strong> {coordinatorData.cpf}</p>
                <p><strong>Endereço:</strong> {coordinatorData.address}</p>
                <p><strong>Telefone:</strong> {coordinatorData.phone}</p>
                <p><strong>Email:</strong> {coordinatorData.email}</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomeCoordinator;
