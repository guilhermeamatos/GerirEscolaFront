import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm'; // Página de login
import HomePageCoordinator from './pages/HomePageCoordinator';
import RegisterTeacher from './pages/RegisterTeacher.js'; 
import RegisterSchool from './pages/RegisterSchool.js';
import './index.css'; // Estilos globais (se houver)

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes>
        {/* Rota da página de login */}
        <Route path="/" element={<LoginForm />} />

        {/* Rota da página inicial do coordenador */}
        <Route path="/coordinator/home" element={<HomePageCoordinator />} />
        <Route path="/register-teacher" element={<RegisterTeacher />} />
        <Route path="/register-school" element={<RegisterSchool />} />


      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
