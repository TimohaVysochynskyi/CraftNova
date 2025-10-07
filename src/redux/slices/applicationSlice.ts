import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { applicationApi } from '../../api/applicationApi';
import type { ApplicationSubmissionData, ApplicationResponse } from '../../api/applicationApi';
import toast from 'react-hot-toast';

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
export const submitApplication = createAsyncThunk(
    'application/submit',
    async (data: ApplicationSubmissionData, { rejectWithValue }) => {
        try {
            const response = await applicationApi.submitApplication(data);
            toast.success('Анкета успішно подана!');
            return response;
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            toast.error(errorMessage);
            return rejectWithValue(errorMessage);
        }
    }
);

export const getMyApplication = createAsyncThunk(
    'application/getMyApplication',
    async (_, { rejectWithValue }) => {
        try {
            const response = await applicationApi.getMyApplication();
            return response;
        } catch (error) {
            // Якщо анкета не знайдена (404), це нормально - просто не показуємо помилку
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response?: { status?: number } };
                if (axiosError.response?.status === 404) {
                    return rejectWithValue('NOT_FOUND');
                }
            }
            const errorMessage = getErrorMessage(error);
            return rejectWithValue(errorMessage);
        }
    }
);

// Initial state
export interface ApplicationState {
    application: ApplicationResponse | null;
    isLoading: boolean;
    isSubmitting: boolean;
    error: string | null;
    isSubmitted: boolean;
}

const initialState: ApplicationState = {
    application: null,
    isLoading: false,
    isSubmitting: false,
    error: null,
    isSubmitted: false,
};

// Application slice
const applicationSlice = createSlice({
    name: 'application',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        resetApplication: (state) => {
            state.application = null;
            state.error = null;
            state.isSubmitted = false;
        },
    },
    extraReducers: (builder) => {
        // Submit application
        builder
            .addCase(submitApplication.pending, (state) => {
                state.isSubmitting = true;
                state.error = null;
            })
            .addCase(submitApplication.fulfilled, (state, action) => {
                state.isSubmitting = false;
                state.application = action.payload;
                state.isSubmitted = true;
                state.error = null;
            })
            .addCase(submitApplication.rejected, (state, action) => {
                state.isSubmitting = false;
                state.error = action.payload as string;
            });

        // Get my application
        builder
            .addCase(getMyApplication.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getMyApplication.fulfilled, (state, action) => {
                state.isLoading = false;
                state.application = action.payload;
                state.error = null;
            })
            .addCase(getMyApplication.rejected, (state, action) => {
                state.isLoading = false;
                // Якщо анкета не знайдена, не встановлюємо помилку
                if (action.payload !== 'NOT_FOUND') {
                    state.error = action.payload as string;
                }
            });
    },
});

export const { clearError, resetApplication } = applicationSlice.actions;
export default applicationSlice.reducer;