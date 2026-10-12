import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentManagement from './pages/StudentManagement';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('task_mgmt_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [authView, setAuthView] = useState('login'); // 'login' | 'register'
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'TEACHER') {
        setActiveTab('teacher_dashboard');
      } else {
        setActiveTab('student_dashboard');
      }
    }
  }, [currentUser]);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem('task_mgmt_user', JSON.stringify(user));
    if (user.role === 'TEACHER') {
      setActiveTab('teacher_dashboard');
    } else {
      setActiveTab('student_dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('task_mgmt_user');
    setAuthView('login');
  };

  return (
    <div className="app-container">
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      <main className="main-content">
        {!currentUser ? (
          authView === 'login' ? (
            <Login
              onLoginSuccess={handleLoginSuccess}
              switchToRegister={() => setAuthView('register')}
            />
          ) : (
            <Register
              onRegisterSuccess={handleLoginSuccess}
              switchToLogin={() => setAuthView('login')}
            />
          )
        ) : (
          <>
            {activeTab === 'student_dashboard' && (
              <StudentDashboard currentUser={currentUser} />
            )}

            {activeTab === 'teacher_dashboard' && (
              <TeacherDashboard currentUser={currentUser} />
            )}

            {activeTab === 'student_management' && (
              <StudentManagement />
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
