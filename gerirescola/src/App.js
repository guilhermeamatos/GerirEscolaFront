import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Menu from './components/Menu';
import TextSection from './components/TextSection';
import CadastroEscola from './components/CadastroEscola';
import CadastroGestor from './components/CadastroGestor';
import Login from './components/Login'; 
import Dashboard from './components/Dashboard';
import CadastroProfessor from './components/CadastroProfessor';
import './styles/App.css';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <div className="main-content">
          <Menu />
          <Routes>
            <Route path="/" element={<TextSection />} />
            <Route path="/cadastro" element={<CadastroEscola />} />
            <Route path="/cadastro-gestor" element={<CadastroGestor />} />
            <Route path="/cadastrar-professor" element={<CadastroProfessor />} /> {/* Nova rota */}
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
