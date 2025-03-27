import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Serviços para usuários
export const userService = {
  // Registrar um novo usuário
  register: async (userData) => {
    try {
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Verificar email/whatsapp para acessar o perfil
  verifyCredentials: async (email, whatsapp) => {
    try {
      const response = await api.post('/users/verify', { email, whatsapp });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Atualizar dados de usuário
  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// Serviços para busca de parceiros
export const searchService = {
  // Buscar parceiros com filtros
  searchPartners: async (filters) => {
    try {
      const response = await api.get('/search/partners', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Buscar parceiros por proximidade
  searchNearby: async (cep, radius, filters) => {
    try {
      const params = { ...filters, cep, radius };
      const response = await api.get('/search/nearby', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default api;