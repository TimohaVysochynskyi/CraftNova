import apiClient from './apiClient';
import type {
    AuthResponse,
    LoginCredentials,
    RegisterCredentials,
    User,
    ApiResponse,
} from '../types/auth.types';

export const authApi = {
    register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
        const response = await apiClient.post<ApiResponse<AuthResponse>>(
            '/auth/register',
            credentials
        );
        return response.data.data;
    },

    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const response = await apiClient.post<ApiResponse<AuthResponse>>(
            '/auth/login',
            credentials
        );
        return response.data.data;
    },

    refreshTokens: async (refreshToken: string): Promise<AuthResponse> => {
        const response = await apiClient.post<ApiResponse<AuthResponse>>(
            '/auth/refresh',
            { refreshToken }
        );
        return response.data.data;
    },

    getCurrentUser: async (): Promise<User> => {
        const response = await apiClient.get<ApiResponse<User>>('/auth/me');
        return response.data.data;
    },

    logout: async (): Promise<void> => {
        await apiClient.post('/auth/logout');
    },
};