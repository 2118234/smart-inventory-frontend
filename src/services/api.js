import axios from 'axios';

// Use environment variable for flexibility
// Falls back to localhost if not provided
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://smart-inventory-backend-6a8w.onrender.com';

const getAxiosInstance = () => {
  const token = localStorage.getItem('token');
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  });
};

// Auth
export const loginUser = async (credentials) => {
  const response = await axios.post(`${API_BASE_URL}/login`, credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await axios.post(`${API_BASE_URL}/register`, userData);
  return response.data;
};

// Products
export const getProducts = async () => {
  const api = getAxiosInstance();
  const response = await api.get('/products');
  return response.data;
};

export const addProduct = async (product) => {
  const api = getAxiosInstance();
  const response = await api.post('/products', product);
  return response.data;
};

export const updateProduct = async (id, updatedProduct) => {
  const api = getAxiosInstance();
  const response = await api.put(`/products/${id}`, updatedProduct);
  return response.data;
};

export const deleteProduct = async (id) => {
  const api = getAxiosInstance();
  const response = await api.delete(`/products/${id}`);
  return response.data;
};
