import React from 'react';

export default function Navbar({ currentUser, activeTab, setActiveTab, onLogout }) {
  const isTeacher = currentUser?.role === 'TEACHER';

  return (
    <header className="navbar">
      <div className="nav-inner">
        <div className="nav-brand" onClick={() => setActiveTab(isTeacher ? 'teacher_dashboard' : 'student_dashboard')}>
          <div className="nav-brand-icon">📚</div>
          <span>EduTask Manager</span>
        </div>

        {currentUser && (
          <nav className="nav-links">
            {isTeacher ? (
              <>
                <button
                  className={`nav-link ${activeTab === 'teacher_dashboard' ? 'active' : ''}`}
                  onClick={() => setActiveTab('teacher_dashboard')}
                >
                  Assignments
                </button>
                <button
                  className={`nav-link ${activeTab === 'student_management' ? 'active' : ''}`}
                  onClick={() => setActiveTab('student_management')}
                >
                  Student Management
                </button>
              </>
            ) : (
              <button
                className={`nav-link ${activeTab === 'student_dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('student_dashboard')}
              >
                My Assignments & Tasks
              </button>
            )}

            <div className="nav-user">
              <span className={`user-badge ${isTeacher ? 'teacher' : 'student'}`}>
                {currentUser.role}
              </span>
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{currentUser.name}</span>
              <button className="btn btn-secondary btn-sm" onClick={onLogout} title="Sign Out">
                Logout
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
