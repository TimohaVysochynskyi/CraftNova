import axios from 'axios';

const API_URL = 'http://localhost:3000/api';
// const API_URL = 'https://triplegeneralapi.onrender.com/api';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
    (config) => {
        // Get token from localStorage
        const persistedState = localStorage.getItem('persist:root');
        if (persistedState) {
            try {
                const parsedState = JSON.parse(persistedState);
                const authState = JSON.parse(parsedState.auth);

                if (authState.accessToken) {
                    config.headers.Authorization = `Bearer ${authState.accessToken}`;
                }
            } catch (error) {
                console.error('Error parsing persisted state:', error);
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for token refresh
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Get refresh token from localStorage
                const persistedState = localStorage.getItem('persist:root');
                if (persistedState) {
                    const parsedState = JSON.parse(persistedState);
                    const authState = JSON.parse(parsedState.auth);

                    if (authState.refreshToken) {
                        // Try to refresh tokens
                        const refreshResponse = await axios.post(
                            `${API_URL}/auth/refresh`,
                            { refreshToken: authState.refreshToken }
                        );

                        const newTokens = refreshResponse.data.data;

                        // Update localStorage with new tokens
                        authState.accessToken = newTokens.accessToken;
                        authState.refreshToken = newTokens.refreshToken;
                        authState.user = newTokens.user;

                        parsedState.auth = JSON.stringify(authState);
                        localStorage.setItem('persist:root', JSON.stringify(parsedState));

                        // Retry original request with new token
                        originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
                        return apiClient(originalRequest);
                    }
                }
            } catch (refreshError) {
                // Refresh failed, logout user
                localStorage.removeItem('persist:root');
                window.location.href = '/auth/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
