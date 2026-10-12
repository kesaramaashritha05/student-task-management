import React, { useState } from 'react';
import { authApi } from '../services/api';

export default function Login({ onLoginSuccess, switchToRegister }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      const data = await authApi.login(formData);
      onLoginSuccess(data.user);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed. Please verify credentials or backend status.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (role) => {
    if (role === 'TEACHER') {
      setFormData({ email: 'teacher@example.com', password: 'teacher123' });
    } else {
      setFormData({ email: 'student@example.com', password: 'student123' });
    }
    setError('');
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="nav-brand-icon" style={{ margin: '0 auto 1rem', width: '48px', height: '48px', fontSize: '1.5rem' }}>
            🎓
          </div>
          <h1>Welcome Back</h1>
          <p>Login to your Student & Assignment Portal</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              className="form-control"
              placeholder="e.g. student@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              className="form-control"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading} style={{ marginTop: '0.5rem' }}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Quick Demo Credentials Box */}
        <div style={{ marginTop: '1.5rem', padding: '0.85rem', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.5rem', textAlign: 'center' }}>
            ⚡ QUICK DEMO CREDENTIALS:
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, fontSize: '0.75rem' }}
              onClick={() => handleQuickFill('TEACHER')}
            >
              Fill Teacher
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, fontSize: '0.75rem' }}
              onClick={() => handleQuickFill('STUDENT')}
            >
              Fill Student
            </button>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#64748b' }}>
          Don't have an account?{' '}
          <button
            type="button"
            onClick={switchToRegister}
            style={{ color: '#4f46e5', background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer', padding: 0 }}
          >
            Register here
          </button>
        </div>
      </div>
    </div>
  );
}
