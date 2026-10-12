import React, { useState, useEffect } from 'react';
import { assignmentApi, submissionApi, studentApi } from '../services/api';
import Modal from '../components/Modal';

export default function StudentDashboard({ currentUser }) {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [studentProfile, setStudentProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Submission Modal state
  const [activeAssignment, setActiveAssignment] = useState(null);
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchData();
  }, [currentUser]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      // 1. Fetch Assignments
      const assignData = await assignmentApi.getAll();
      setAssignments(assignData || []);

      // 2. Fetch or find Student record for current user
      let studentId = currentUser?.id;
      try {
        const student = await studentApi.getByEmail(currentUser.email);
        if (student && student.id) {
          setStudentProfile(student);
          studentId = student.id;
        }
      } catch (err) {
        console.warn('Student profile not found in students table, using user ID');
      }

      // 3. Fetch Student Submissions
      if (studentId) {
        const subs = await submissionApi.getByStudent(studentId);
        setSubmissions(subs || []);
      }
    } catch (err) {
      console.error(err);
      setError('Could not connect to Spring Boot backend. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const getSubmissionForAssignment = (assignmentId) => {
    return submissions.find((s) => s.assignmentId === assignmentId);
  };

  const openSubmitModal = (assignment) => {
    const existing = getSubmissionForAssignment(assignment.id);
    setActiveAssignment(assignment);
    setSubmissionNotes(existing ? existing.submissionNotes : '');
  };

  const handleSubmission = async (e) => {
    e.preventDefault();
    if (!activeAssignment) return;

    try {
      setSubmitting(true);
      const studentId = studentProfile?.id || currentUser?.id || 1;
      const studentName = currentUser?.name || 'Student';

      const payload = {
        assignmentId: activeAssignment.id,
        studentId: studentId,
        studentName: studentName,
        submissionNotes: submissionNotes,
      };

      await submissionApi.submit(payload);
      setSuccessMsg(`Successfully submitted "${activeAssignment.title}"!`);
      setActiveAssignment(null);
      setSubmissionNotes('');
      // Refresh data
      await fetchData();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error(err);
      alert('Failed to submit assignment. Check server logs.');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter & Search Logic
  const filteredAssignments = assignments.filter((item) => {
    const sub = getSubmissionForAssignment(item.id);
    const isSubmitted = !!sub;

    if (filter === 'SUBMITTED' && !isSubmitted) return false;
    if (filter === 'PENDING' && isSubmitted) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.subject.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalSubmitted = submissions.length;
  const totalPending = Math.max(0, assignments.length - totalSubmitted);

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Student Assignment Dashboard</h1>
          <p className="page-subtitle">
            Welcome, <strong>{currentUser.name}</strong> ({studentProfile?.rollNumber || 'Enrolled Student'})
          </p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={fetchData}>
          🔄 Refresh
        </button>
      </div>

      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Stats Row */}
      <div className="stats-row">
        <div className="stat-box">
          <div className="stat-icon">📑</div>
          <div>
            <div className="stat-value">{assignments.length}</div>
            <div className="stat-label">Total Assignments</div>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-icon" style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}>
            ✅
          </div>
          <div>
            <div className="stat-value">{totalSubmitted}</div>
            <div className="stat-label">Submitted Tasks</div>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-icon" style={{ backgroundColor: '#fffbeb', color: '#f59e0b' }}>
            ⏳
          </div>
          <div>
            <div className="stat-value">{totalPending}</div>
            <div className="stat-label">Pending Due</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          className="form-control"
          placeholder="Search by title or subject..."
          style={{ maxWidth: '320px' }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className={`btn btn-sm ${filter === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('ALL')}
          >
            All ({assignments.length})
          </button>
          <button
            className={`btn btn-sm ${filter === 'PENDING' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('PENDING')}
          >
            Pending ({totalPending})
          </button>
          <button
            className={`btn btn-sm ${filter === 'SUBMITTED' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('SUBMITTED')}
          >
            Submitted ({totalSubmitted})
          </button>
        </div>
      </div>

      {/* Assignments List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
          Loading assignments and submissions...
        </div>
      ) : filteredAssignments.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
          <h3>No assignments found</h3>
          <p style={{ marginTop: '0.5rem' }}>
            {filter !== 'ALL' ? 'No assignments match the selected filter.' : 'No assignments have been assigned yet.'}
          </p>
        </div>
      ) : (
        <div className="card-grid">
          {filteredAssignments.map((assignment) => {
            const submission = getSubmissionForAssignment(assignment.id);
            const isSubmitted = !!submission;

            return (
              <div className="card" key={assignment.id}>
                <div className="card-header">
                  <div>
                    <span className="card-subject">{assignment.subject}</span>
                    <h2 className="card-title">{assignment.title}</h2>
                  </div>
                  <span className={`status-badge ${isSubmitted ? 'badge-submitted' : 'badge-pending'}`}>
                    {isSubmitted ? '● Submitted' : '● Pending'}
                  </span>
                </div>

                <p className="card-body">{assignment.description}</p>

                <div style={{ marginBottom: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
                  <div>📅 <strong>Due Date:</strong> {assignment.dueDate}</div>
                  <div>🎯 <strong>Max Marks:</strong> {assignment.maxMarks}</div>
                  {assignment.createdBy && <div>👤 <strong>Assigned By:</strong> {assignment.createdBy}</div>}
                  {isSubmitted && submission.grade && (
                    <div style={{ marginTop: '0.5rem', color: '#4f46e5', fontWeight: 600 }}>
                      ⭐ Grade / Evaluation: <span className="status-badge badge-graded">{submission.grade}</span>
                    </div>
                  )}
                </div>

                <div className="card-footer">
                  <button
                    className={`btn btn-block ${isSubmitted ? 'btn-secondary' : 'btn-primary'}`}
                    onClick={() => openSubmitModal(assignment)}
                  >
                    {isSubmitted ? '✏️ Update Submission' : '📤 Mark as Submitted'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Submit Assignment Modal */}
      <Modal
        isOpen={!!activeAssignment}
        title={activeAssignment ? `Submit: ${activeAssignment.title}` : 'Submit Assignment'}
        onClose={() => setActiveAssignment(null)}
      >
        <form onSubmit={handleSubmission}>
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '0.5rem' }}>
              <strong>Subject:</strong> {activeAssignment?.subject} | <strong>Due Date:</strong> {activeAssignment?.dueDate}
            </p>
            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
              {activeAssignment?.description}
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="submissionNotes">Submission Notes / GitHub Link / Answer *</label>
            <textarea
              id="submissionNotes"
              className="form-control"
              rows={4}
              placeholder="Provide assignment solution details, summary of work done, or project repository link..."
              value={submissionNotes}
              onChange={(e) => setSubmissionNotes(e.target.value)}
              required
            />
          </div>

          <div className="modal-footer" style={{ padding: '1rem 0 0', border: 'none', background: 'transparent' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setActiveAssignment(null)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Confirm Submission'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
