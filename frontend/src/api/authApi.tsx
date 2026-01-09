import api from './axios';

interface LoginResponse {
  token: string;
}

export const login = async (username: string, password: string): Promise<void> => {
  try {
    const response = await api.post<LoginResponse>('/auth/login', { username, password });
    localStorage.setItem('token', response.data.token);
  } catch (error) {
    throw new Error('Login failed');
  }
};