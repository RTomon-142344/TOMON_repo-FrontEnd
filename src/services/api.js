// src/services/api.js
// Central API service — all backend calls go through here

const BASE_URL = 'http://localhost:8000/api';

function getToken() {
  return localStorage.getItem('token');
}

async function request(method, path, body = null) {
  const headers = {
    'Content-Type': 'application/json',
    'Accept':       'application/json',
  };

  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${path}`, options);

  // Token expired or invalid — clear and reload
  if (res.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
    return;
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export const api = {
  get:    (path)        => request('GET',    path),
  post:   (path, body)  => request('POST',   path, body),
  put:    (path, body)  => request('PUT',    path, body),
  delete: (path)        => request('DELETE', path),
};

// ── Specific API calls ───────────────────────────────────────
export const getDashboard  = ()      => api.get('/dashboard');
export const getStudents   = (params = '') => api.get(`/students${params}`);
export const getCourses    = ()      => api.get('/courses');
export const logout        = ()      => api.post('/logout');