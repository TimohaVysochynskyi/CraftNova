export interface User {
    username: string;
    email: string;
    name: string;
    surname: string;
    balance?: number;
    lastOnline?: string;
    isOnline?: boolean;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    accessTokenValidUntil: string;
    refreshTokenValidUntil: string;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
    accessTokenValidUntil: string;
    refreshTokenValidUntil: string;
}

export interface LoginCredentials {
    emailOrNickname: string;
    password: string;
}

export interface RegisterCredentials {
    nickname: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface ApiResponse<T> {
    status: number;
    message: string;
    data: T;
}

export interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}