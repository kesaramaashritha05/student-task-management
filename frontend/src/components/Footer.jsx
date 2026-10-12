import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <p><strong>Student Task & Assignment Management System</strong> • Technical Training Full Stack Project</p>
        <p style={{ marginTop: '0.25rem', fontSize: '0.8rem', color: '#94a3b8' }}>
          Built with React.js, Spring Boot, PostgreSQL, and Maven
        </p>
      </div>
    </footer>
  );
}
