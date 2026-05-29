const BASE_URL = 'http://localhost:4000/api';

const api = {
  get: async <T>(endpoint: string): Promise<T> => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
  },
  post: async <T>(endpoint: string, body: unknown): Promise<T> => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
  },
};

export default api;