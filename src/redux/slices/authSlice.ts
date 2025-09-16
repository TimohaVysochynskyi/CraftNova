import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../api/authApi';
import toast from 'react-hot-toast';
import type {
    AuthState,
    LoginCredentials,
    RegisterCredentials,
} from '../../types/auth.types';

// Helper function to extract user-friendly error message
const getErrorMessage = (error: unknown): string => {
    if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        if (axiosError.response?.data?.message) {
            return axiosError.response.data.message;
        }
    }
    if (error && typeof error === 'object' && 'message' in error) {
        return (error as { message: string }).message;
    }
    return 'Произошла неизвестная ошибка';
};

// Async thunks
export const registerUser = createAsyncThunk(
    'auth/register',
    async (credentials: RegisterCredentials, { rejectWithValue }) => {
        try {
            const response = await authApi.register(credentials);
            toast.success('Регистрация прошла успешно!');
            return response;
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            toast.error(errorMessage);
            return rejectWithValue(errorMessage);
        }
    }
);

export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials: LoginCredentials, { rejectWithValue }) => {
        try {
            const response = await authApi.login(credentials);
            toast.success('Вход выполнен успешно!');
            return response;
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            toast.error(errorMessage);
            return rejectWithValue(errorMessage);
        }
    }
);

export const refreshTokens = createAsyncThunk(
    'auth/refresh',
    async (refreshToken: string, { rejectWithValue }) => {
        try {
            const response = await authApi.refreshTokens(refreshToken);
            return response;
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            return rejectWithValue(errorMessage);
        }
    }
);

export const getCurrentUser = createAsyncThunk(
    'auth/getCurrentUser',
    async (_, { rejectWithValue }) => {
        try {
            const user = await authApi.getCurrentUser();
            return user;
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            return rejectWithValue(errorMessage);
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async () => {
        try {
            await authApi.logout();
            toast.success('Выход выполнен успешно!');
        } catch (error) {
            // Logout anyway even if API call fails
            console.error('Logout error:', error);
        }
    }
);

// Initial state
const initialState: AuthState = {
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
};

// Auth slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        resetAuth: (state) => {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Register
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                state.isAuthenticated = false;
            });

        // Login
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                state.isAuthenticated = false;
            });

        // Refresh tokens
        builder
            .addCase(refreshTokens.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(refreshTokens.rejected, (state) => {
                state.user = null;
                state.accessToken = null;
                state.refreshToken = null;
                state.isAuthenticated = false;
            });

        // Get current user
        builder
            .addCase(getCurrentUser.fulfilled, (state, action) => {
                state.user = action.payload;
            })
            .addCase(getCurrentUser.rejected, (state) => {
                state.user = null;
                state.accessToken = null;
                state.refreshToken = null;
                state.isAuthenticated = false;
            });

        // Logout
        builder.addCase(logoutUser.fulfilled, (state) => {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            state.error = null;
        });
    },
});

export const { clearError, resetAuth } = authSlice.actions;
export default authSlice.reducer;