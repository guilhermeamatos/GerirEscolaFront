import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm'; // Página de login
import HomePageCoordinator from './pages/HomePageCoordinator';
import HomePageManager from './pages/HomePageManager.js';
import RegisterTeacher from './pages/RegisterTeacher.js'; 
import RegisterSchool from './pages/RegisterSchool.js';
import RegisterManager from './pages/RegisterManager.js';
import RegisterClass from './pages/RegisterClass.js';
import RegisterStudent from './pages/RegisterStudent.js';
import EnrollStudent from './pages/EnrollStudent.js';
import AssignTeacherToClass from './pages/AssignTeacherToClass.js';
import HomeTeacher from './pages/HomePageTeacher.js';
import TeacherClasses from './pages/TeacherClasses.js';
import SubjectPageFundamental1 from './pages/SubjectPageFundamental1.js';
import GradeRegistrationPage from './pages/GradeRegistrationPage.js';
import AttendancePage from './pages/AttendancePage.js';
import PerformanceRegistrationPage from './pages/PerformanceRegistrationPage.js';
import BoletimByClass from './pages/BoletimByclass.js';
import ClassPage from './pages/ClassPage.js';
import './index.css'; // Estilos globais (se houver)

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes>
        {/* Rota da página de login */}
        <Route path="/" element={<LoginForm />} />

        {/* Rota da página inicial do coordenador */}
        <Route path="/coordinator/home" element={<HomePageCoordinator />} />
        <Route path="/manager/home" element={<HomePageManager />} />
        <Route path="/register-teacher" element={<RegisterTeacher />} />
        <Route path="/register-school" element={<RegisterSchool />} />
        <Route path="/register-manager" element={<RegisterManager />} />
        <Route path="/register-class" element={<RegisterClass />} />
        <Route path="/register-student" element={<RegisterStudent />} />
        <Route path="/enroll-student" element={<EnrollStudent />} />
        <Route path="/assign-teacher-to-class" element={<AssignTeacherToClass />} />
        <Route path="/teacher/home" element={<HomeTeacher />} />
        <Route path="/teacher/classes" element={<TeacherClasses />} />
        <Route path="/subject/:subjectId" element={<SubjectPageFundamental1 />} />
        <Route path="/attendance/:lessonId" element={<AttendancePage />} />
        <Route path="/grade-registration/:subjectId" element={<GradeRegistrationPage />} />
        <Route path="/performance-registration/:subjectId" element={<PerformanceRegistrationPage />} />
        <Route path="/boletim-class" element={<BoletimByClass />} />
        <Route path="/class/:classId" element={<ClassPage />} />
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
