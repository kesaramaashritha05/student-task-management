import axios from 'axios';

// Spring Boot Backend Base URL
const API_BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
});

// Authentication APIs
export const authApi = {
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },
  getUsers: async () => {
    const response = await apiClient.get('/auth/users');
    return response.data;
  }
};

// Student CRUD APIs
export const studentApi = {
  getAll: async () => {
    const response = await apiClient.get('/students');
    return response.data;
  },
  getById: async (id) => {
    const response = await apiClient.get(`/students/${id}`);
    return response.data;
  },
  getByEmail: async (email) => {
    const response = await apiClient.get(`/students/email/${email}`);
    return response.data;
  },
  create: async (student) => {
    const response = await apiClient.post('/students', student);
    return response.data;
  },
  update: async (id, student) => {
    const response = await apiClient.put(`/students/${id}`, student);
    return response.data;
  },
  delete: async (id) => {
    const response = await apiClient.delete(`/students/${id}`);
    return response.data;
  }
};

// Assignment CRUD APIs
export const assignmentApi = {
  getAll: async () => {
    const response = await apiClient.get('/assignments');
    return response.data;
  },
  getById: async (id) => {
    const response = await apiClient.get(`/assignments/${id}`);
    return response.data;
  },
  create: async (assignment) => {
    const response = await apiClient.post('/assignments', assignment);
    return response.data;
  },
  update: async (id, assignment) => {
    const response = await apiClient.put(`/assignments/${id}`, assignment);
    return response.data;
  },
  delete: async (id) => {
    const response = await apiClient.delete(`/assignments/${id}`);
    return response.data;
  }
};

// Submission APIs
export const submissionApi = {
  submit: async (submissionData) => {
    const response = await apiClient.post('/submissions/submit', submissionData);
    return response.data;
  },
  getByStudent: async (studentId) => {
    const response = await apiClient.get(`/submissions/student/${studentId}`);
    return response.data;
  },
  getByAssignment: async (assignmentId) => {
    const response = await apiClient.get(`/submissions/assignment/${assignmentId}`);
    return response.data;
  },
  getAll: async () => {
    const response = await apiClient.get('/submissions');
    return response.data;
  },
  grade: async (id, gradePayload) => {
    const response = await apiClient.put(`/submissions/${id}/grade`, gradePayload);
    return response.data;
  }
};

export default apiClient;
