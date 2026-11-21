import axios from 'axios';

// Get API base URL with priority:
// 1. VITE_API_URL environment variable (configured in Vercel / production)
// 2. Localhost:5050 when developing locally
// 3. Relative /api as fallback
const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl.trim()) {
    let url = envUrl.trim();
    if (url.endsWith('/')) url = url.slice(0, -1);
    if (!url.endsWith('/api')) url += '/api';
    return url;
  }

  if (typeof window !== 'undefined' && window.location) {
    const host = window.location.hostname || '127.0.0.1';
    if (host === 'localhost' || host === '127.0.0.1') {
      return `http://${host}:5050/api`;
    }
  }

  return '/api';
};

const API = axios.create({
  baseURL: getBaseURL(),
  timeout: 60000,
});

export default API;
