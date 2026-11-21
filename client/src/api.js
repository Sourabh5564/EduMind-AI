import axios from 'axios';

// Dynamically connect to the backend server on port 5050
const getBaseURL = () => {
  if (typeof window !== 'undefined' && window.location) {
    const host = window.location.hostname || '127.0.0.1';
    return `http://${host}:5050/api`;
  }
  return 'http://127.0.0.1:5050/api';
};

const API = axios.create({
  baseURL: getBaseURL(),
  timeout: 60000,
});

export default API;
