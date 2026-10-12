import React, { useState } from 'react';
import { authApi, studentApi } from '../services/api';

export default function Register({ onRegisterSuccess, switchToLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STUDENT',
    rollNumber: '',
    course: 'B.Tech',
    department: 'Computer Science and Engineering',
    semester: '6',
    phoneNumber: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setLoading(true);
      // 1. Register User in backend
      const userPayload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };
      const userRes = await authApi.register(userPayload);

      // 2. If student role, also create student profile record in students table
      if (formData.role === 'STUDENT' && formData.rollNumber) {
        try {
          await studentApi.create({
            name: formData.name,
            email: formData.email,
            rollNumber: formData.rollNumber,
            course: formData.course,
            department: formData.department,
            semester: parseInt(formData.semester, 10) || 1,
            phoneNumber: formData.phoneNumber,
          });
        } catch (studentErr) {
          console.warn('Student profile auto-creation note:', studentErr);
        }
      }

      onRegisterSuccess(userRes.user);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper" style={{ padding: '2rem 1rem' }}>
      <div className="auth-card" style={{ maxWidth: '520px' }}>
        <div className="auth-header">
          <div className="nav-brand-icon" style={{ margin: '0 auto 1rem', width: '48px', height: '48px', fontSize: '1.5rem' }}>
            📝
          </div>
          <h1>Create Account</h1>
          <p>Register as a Student or Teacher</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              id="name"
              type="text"
              name="name"
              className="form-control"
              placeholder="e.g. Aashritha Kesarapu"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
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

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input
                id="password"
                type="password"
                name="password"
                className="form-control"
                placeholder="Choose password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">Account Role *</label>
              <select
                id="role"
                name="role"
                className="form-control"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="STUDENT">Student</option>
                <option value="TEACHER">Teacher / Faculty</option>
              </select>
            </div>
          </div>

          {formData.role === 'STUDENT' && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="rollNumber">Roll Number *</label>
                  <input
                    id="rollNumber"
                    type="text"
                    name="rollNumber"
                    className="form-control"
                    placeholder="e.g. 21B91A0501"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    required={formData.role === 'STUDENT'}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="semester">Semester</label>
                  <select
                    id="semester"
                    name="semester"
                    className="form-control"
                    value={formData.semester}
                    onChange={handleChange}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <option key={sem} value={sem}>Semester {sem}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="course">Course</label>
                  <input
                    id="course"
                    type="text"
                    name="course"
                    className="form-control"
                    placeholder="e.g. B.Tech"
                    value={formData.course}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="department">Department</label>
                  <input
                    id="department"
                    type="text"
                    name="department"
                    className="form-control"
                    placeholder="e.g. CSE"
                    value={formData.department}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  id="phoneNumber"
                  type="text"
                  name="phoneNumber"
                  className="form-control"
                  placeholder="e.g. 9876543210"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          <button type="submit" className="btn btn-primary btn-block" disabled={loading} style={{ marginTop: '0.75rem' }}>
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#64748b' }}>
          Already have an account?{' '}
          <button
            type="button"
            onClick={switchToLogin}
            style={{ color: '#4f46e5', background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer', padding: 0 }}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
