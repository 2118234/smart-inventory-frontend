import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;

// Example API call
fetch(`${apiUrl}/products`)
  .then(response => response.json())
  .then(data => console.log(data));

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
