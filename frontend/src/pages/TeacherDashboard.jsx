import React, { useState, useEffect } from 'react';
import { assignmentApi, submissionApi } from '../services/api';
import Modal from '../components/Modal';

export default function TeacherDashboard({ currentUser }) {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Assignment Modal (Create & Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    description: '',
    dueDate: '',
    maxMarks: 100,
  });

  // View Submissions Modal
  const [viewingAssignment, setViewingAssignment] = useState(null);
  const [assignmentSubmissions, setAssignmentSubmissions] = useState([]);

  // Grade Modal
  const [gradingSubmission, setGradingSubmission] = useState(null);
  const [gradeInput, setGradeInput] = useState('');

  useEffect(() => {
    fetchAssignmentsAndSubmissions();
  }, []);

  const fetchAssignmentsAndSubmissions = async () => {
    try {
      setLoading(true);
      setError('');
      const [assigns, subs] = await Promise.all([
        assignmentApi.getAll(),
        submissionApi.getAll()
      ]);
      setAssignments(assigns || []);
      setSubmissions(subs || []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch assignments from Spring Boot backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingAssignment(null);
    setFormData({
      title: '',
      subject: '',
      description: '',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      maxMarks: 100,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (assignment) => {
    setEditingAssignment(assignment);
    setFormData({
      title: assignment.title,
      subject: assignment.subject,
      description: assignment.description,
      dueDate: assignment.dueDate,
      maxMarks: assignment.maxMarks || 100,
    });
    setIsModalOpen(true);
  };

  const handleSaveAssignment = async (e) => {
    e.preventDefault();
    try {
      if (editingAssignment) {
        // UPDATE (PUT)
        await assignmentApi.update(editingAssignment.id, {
          ...formData,
          createdBy: currentUser?.name || 'Teacher'
        });
        setSuccessMsg(`Assignment "${formData.title}" updated successfully!`);
      } else {
        // CREATE (POST)
        await assignmentApi.create({
          ...formData,
          createdBy: currentUser?.name || 'Teacher'
        });
        setSuccessMsg(`New assignment "${formData.title}" created successfully!`);
      }
      setIsModalOpen(false);
      await fetchAssignmentsAndSubmissions();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error(err);
      alert('Error saving assignment: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteAssignment = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete assignment: "${title}"?`)) {
      return;
    }
    try {
      await assignmentApi.delete(id);
      setSuccessMsg(`Assignment "${title}" deleted.`);
      await fetchAssignmentsAndSubmissions();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error(err);
      alert('Error deleting assignment: ' + err.message);
    }
  };

  const handleViewSubmissions = async (assignment) => {
    try {
      setViewingAssignment(assignment);
      const subs = await submissionApi.getByAssignment(assignment.id);
      setAssignmentSubmissions(subs || []);
    } catch (err) {
      console.error(err);
      alert('Failed to load submissions for this assignment.');
    }
  };

  const handleOpenGradeModal = (sub) => {
    setGradingSubmission(sub);
    setGradeInput(sub.grade || 'A');
  };

  const handleSaveGrade = async (e) => {
    e.preventDefault();
    if (!gradingSubmission) return;

    try {
      await submissionApi.grade(gradingSubmission.id, { grade: gradeInput, status: 'GRADED' });
      setGradingSubmission(null);
      // Refresh current viewing list
      if (viewingAssignment) {
        const subs = await submissionApi.getByAssignment(viewingAssignment.id);
        setAssignmentSubmissions(subs || []);
      }
      await fetchAssignmentsAndSubmissions();
    } catch (err) {
      console.error(err);
      alert('Failed to save grade.');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Faculty Assignment Manager</h1>
          <p className="page-subtitle">Add, update, evaluate and track course assignments</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary btn-sm" onClick={fetchAssignmentsAndSubmissions}>
            🔄 Refresh
          </button>
          <button className="btn btn-primary" onClick={handleOpenAddModal}>
            ➕ Add New Assignment
          </button>
        </div>
      </div>

      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-box">
          <div className="stat-icon">📚</div>
          <div>
            <div className="stat-value">{assignments.length}</div>
            <div className="stat-label">Active Assignments</div>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-icon" style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}>
            📥
          </div>
          <div>
            <div className="stat-value">{submissions.length}</div>
            <div className="stat-label">Total Submissions Received</div>
          </div>
        </div>
      </div>

      {/* Assignments Table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Subject & Title</th>
              <th>Due Date</th>
              <th>Max Marks</th>
              <th>Submissions</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                  Loading assignments...
                </td>
              </tr>
            ) : assignments.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                  No assignments created yet. Click "Add New Assignment" to get started!
                </td>
              </tr>
            ) : (
              assignments.map((item) => {
                const count = submissions.filter((s) => s.assignmentId === item.id).length;
                return (
                  <tr key={item.id}>
                    <td><strong>#{item.id}</strong></td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#1e293b' }}>{item.title}</div>
                      <div style={{ fontSize: '0.8rem', color: '#6366f1' }}>{item.subject}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>
                        {item.description.length > 80 ? item.description.substring(0, 80) + '...' : item.description}
                      </div>
                    </td>
                    <td>📅 {item.dueDate}</td>
                    <td>{item.maxMarks} Marks</td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleViewSubmissions(item)}
                      >
                        📥 View ({count})
                      </button>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ marginRight: '0.5rem' }}
                        onClick={() => handleOpenEditModal(item)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteAssignment(item.id, item.title)}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Assignment Modal */}
      <Modal
        isOpen={isModalOpen}
        title={editingAssignment ? `Edit Assignment: #${editingAssignment.id}` : 'Create New Assignment'}
        onClose={() => setIsModalOpen(false)}
      >
        <form onSubmit={handleSaveAssignment}>
          <div className="form-group">
            <label htmlFor="title">Assignment Title *</label>
            <input
              id="title"
              type="text"
              className="form-control"
              placeholder="e.g. Spring Boot REST API Assignment"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="subject">Subject / Course *</label>
              <input
                id="subject"
                type="text"
                className="form-control"
                placeholder="e.g. Full Stack Java"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="dueDate">Due Date *</label>
              <input
                id="dueDate"
                type="date"
                className="form-control"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="maxMarks">Max Marks</label>
            <input
              id="maxMarks"
              type="number"
              className="form-control"
              value={formData.maxMarks}
              onChange={(e) => setFormData({ ...formData, maxMarks: parseInt(e.target.value, 10) || 100 })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Assignment Description & Instructions *</label>
            <textarea
              id="description"
              className="form-control"
              rows={4}
              placeholder="Provide assignment goals, requirements, and instructions..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="modal-footer" style={{ padding: '1rem 0 0', border: 'none', background: 'transparent' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingAssignment ? 'Save Changes' : 'Create Assignment'}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Submissions Modal */}
      <Modal
        isOpen={!!viewingAssignment}
        title={viewingAssignment ? `Submissions for: ${viewingAssignment.title}` : 'Submissions'}
        onClose={() => setViewingAssignment(null)}
      >
        <div>
          {assignmentSubmissions.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
              No student submissions received for this assignment yet.
            </p>
          ) : (
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Notes / Work</th>
                    <th>Submitted At</th>
                    <th>Grade</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {assignmentSubmissions.map((sub) => (
                    <tr key={sub.id}>
                      <td><strong>{sub.studentName}</strong></td>
                      <td style={{ maxWidth: '200px', fontSize: '0.85rem' }}>{sub.submissionNotes}</td>
                      <td style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        {sub.submissionDate ? new Date(sub.submissionDate).toLocaleString() : 'N/A'}
                      </td>
                      <td>
                        <span className="status-badge badge-graded">{sub.grade || 'PENDING'}</span>
                      </td>
                      <td>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleOpenGradeModal(sub)}
                        >
                          ⭐ Grade
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div style={{ marginTop: '1.25rem', textAlign: 'right' }}>
            <button className="btn btn-secondary" onClick={() => setViewingAssignment(null)}>
              Close
            </button>
          </div>
        </div>
      </Modal>

      {/* Grade Submission Modal */}
      <Modal
        isOpen={!!gradingSubmission}
        title={`Grade Submission: ${gradingSubmission?.studentName}`}
        onClose={() => setGradingSubmission(null)}
      >
        <form onSubmit={handleSaveGrade}>
          <p style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#475569' }}>
            <strong>Student Notes:</strong> "{gradingSubmission?.submissionNotes}"
          </p>

          <div className="form-group">
            <label htmlFor="gradeInput">Assign Grade / Marks (e.g. A+, 95/100, Excellent)</label>
            <input
              id="gradeInput"
              type="text"
              className="form-control"
              placeholder="e.g. A+ or 90/100"
              value={gradeInput}
              onChange={(e) => setGradeInput(e.target.value)}
              required
            />
          </div>

          <div className="modal-footer" style={{ padding: '1rem 0 0', border: 'none', background: 'transparent' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setGradingSubmission(null)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Grade
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
