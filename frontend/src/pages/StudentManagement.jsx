import React, { useState, useEffect } from 'react';
import { studentApi } from '../services/api';
import Modal from '../components/Modal';

export default function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rollNumber: '',
    course: 'B.Tech',
    department: 'Computer Science and Engineering',
    semester: 6,
    phoneNumber: '',
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await studentApi.getAll();
      setStudents(data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch students from Spring Boot backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingStudent(null);
    setFormData({
      name: '',
      email: '',
      rollNumber: '',
      course: 'B.Tech',
      department: 'Computer Science and Engineering',
      semester: 6,
      phoneNumber: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      email: student.email,
      rollNumber: student.rollNumber,
      course: student.course || '',
      department: student.department || '',
      semester: student.semester || 1,
      phoneNumber: student.phoneNumber || '',
    });
    setIsModalOpen(true);
  };

  const handleSaveStudent = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        // UPDATE (PUT)
        await studentApi.update(editingStudent.id, formData);
        setSuccessMsg(`Student "${formData.name}" updated successfully!`);
      } else {
        // CREATE (POST)
        await studentApi.create(formData);
        setSuccessMsg(`New student "${formData.name}" added successfully!`);
      }
      setIsModalOpen(false);
      await fetchStudents();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error(err);
      alert('Error saving student: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteStudent = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete student: "${name}"?`)) {
      return;
    }
    try {
      await studentApi.delete(id);
      setSuccessMsg(`Student "${name}" deleted successfully.`);
      await fetchStudents();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error(err);
      alert('Error deleting student: ' + err.message);
    }
  };

  const filteredStudents = students.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.rollNumber.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Student Records Management</h1>
          <p className="page-subtitle">Perform CRUD operations on college student data</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary btn-sm" onClick={fetchStudents}>
            🔄 Refresh
          </button>
          <button className="btn btn-primary" onClick={handleOpenAddModal}>
            ➕ Add New Student
          </button>
        </div>
      </div>

      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Search and stats bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <input
          type="text"
          className="form-control"
          placeholder="Search by name, roll number, or department..."
          style={{ maxWidth: '380px' }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>
          Total Enrolled Students: <strong>{students.length}</strong>
        </div>
      </div>

      {/* Students Table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Roll Number</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Course & Dept</th>
              <th>Semester</th>
              <th>Phone</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>
                  Loading student records...
                </td>
              </tr>
            ) : filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                  No students found matching your search.
                </td>
              </tr>
            ) : (
              filteredStudents.map((s) => (
                <tr key={s.id}>
                  <td><strong>#{s.id}</strong></td>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#4f46e5' }}>
                      {s.rollNumber}
                    </span>
                  </td>
                  <td><strong>{s.name}</strong></td>
                  <td>{s.email}</td>
                  <td>
                    <div>{s.course}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{s.department}</div>
                  </td>
                  <td>Sem {s.semester}</td>
                  <td>{s.phoneNumber || '—'}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ marginRight: '0.5rem' }}
                      onClick={() => handleOpenEditModal(s)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteStudent(s.id, s.name)}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Student Modal */}
      <Modal
        isOpen={isModalOpen}
        title={editingStudent ? `Edit Student: ${editingStudent.name}` : 'Add New Student'}
        onClose={() => setIsModalOpen(false)}
      >
        <form onSubmit={handleSaveStudent}>
          <div className="form-group">
            <label htmlFor="studentName">Student Full Name *</label>
            <input
              id="studentName"
              type="text"
              className="form-control"
              placeholder="e.g. Aashritha Kesarapu"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="studentEmail">Email Address *</label>
              <input
                id="studentEmail"
                type="email"
                className="form-control"
                placeholder="student@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="studentRoll">Roll Number *</label>
              <input
                id="studentRoll"
                type="text"
                className="form-control"
                placeholder="e.g. 21B91A0501"
                value={formData.rollNumber}
                onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="studentCourse">Course</label>
              <input
                id="studentCourse"
                type="text"
                className="form-control"
                placeholder="e.g. B.Tech"
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="studentSemester">Semester</label>
              <select
                id="studentSemester"
                className="form-control"
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value, 10) })}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="studentDept">Department</label>
            <input
              id="studentDept"
              type="text"
              className="form-control"
              placeholder="e.g. Computer Science and Engineering"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="studentPhone">Phone Number</label>
            <input
              id="studentPhone"
              type="text"
              className="form-control"
              placeholder="e.g. 9876543210"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            />
          </div>

          <div className="modal-footer" style={{ padding: '1rem 0 0', border: 'none', background: 'transparent' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingStudent ? 'Save Changes' : 'Add Student'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
