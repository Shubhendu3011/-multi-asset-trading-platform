import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  role: string;
  isEmailVerified: boolean;
  isKycVerified: boolean;
  createdAt: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export class AuthService {
  /**
   * Register a new user
   */
  static async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/auth/register', data);
    return response.data;
  }

  /**
   * Login user
   */
  static async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post('/auth/login', data);
    return response.data;
  }

  /**
   * Get current user profile
   */
  static async getProfile(): Promise<{ user: User }> {
    const response = await api.get('/auth/me');
    return response.data;
  }

  /**
   * Update user profile
   */
  static async updateProfile(data: { firstName?: string; lastName?: string }): Promise<AuthResponse> {
    const response = await api.put('/auth/profile', data);
    return response.data;
  }

  /**
   * Change password
   */
  static async changePassword(data: { currentPassword: string; newPassword: string }): Promise<{ message: string }> {
    const response = await api.put('/auth/change-password', data);
    return response.data;
  }

  /**
   * Logout user
   */
  static async logout(): Promise<{ message: string }> {
    const response = await api.post('/auth/logout');
    return response.data;
  }

  /**
   * Refresh token
   */
  static async refreshToken(): Promise<AuthResponse> {
    const response = await api.post('/auth/refresh');
    return response.data;
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  /**
   * Get stored token
   */
  static getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Set token in localStorage
   */
  static setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  /**
   * Remove token from localStorage
   */
  static removeToken(): void {
    localStorage.removeItem('token');
  }
}

export default AuthService; 