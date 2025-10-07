import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
    AdminApplication,
    ApplicationFilters,
    UpdateApplicationStatusPayload,
} from '../../types/admin.types';
import * as adminApi from '../../api/adminApi';
import toast from 'react-hot-toast';

interface AdminState {
    applications: AdminApplication[];
    currentApplication: AdminApplication | null;
    total: number;
    page: number;
    totalPages: number;
    limit: number;
    filters: ApplicationFilters;
    loading: boolean;
    error: string | null;
}

const initialState: AdminState = {
    applications: [],
    currentApplication: null,
    total: 0,
    page: 1,
    totalPages: 0,
    limit: 10,
    filters: {
        status: 'all',
        search: '',
        sortBy: 'submittedAt',
        sortOrder: 'desc',
    },
    loading: false,
    error: null,
};

export const fetchApplications = createAsyncThunk(
    'admin/fetchApplications',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState() as { admin: AdminState };
            const { page, limit, filters } = state.admin;
            const response = await adminApi.getAllApplications(page, limit, filters);
            return response;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Помилка завантаження заявок'
            );
        }
    }
);

export const fetchApplicationById = createAsyncThunk(
    'admin/fetchApplicationById',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await adminApi.getApplicationById(id);
            return response;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Помилка завантаження заявки'
            );
        }
    }
);

export const updateStatus = createAsyncThunk(
    'admin/updateStatus',
    async (payload: UpdateApplicationStatusPayload, { rejectWithValue }) => {
        try {
            const response = await adminApi.updateApplicationStatus(payload);
            toast.success('Статус заявки оновлено');
            return response;
        } catch (error: any) {
            const message =
                error.response?.data?.message || 'Помилка оновлення статусу';
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

export const deleteApplicationById = createAsyncThunk(
    'admin/deleteApplication',
    async (id: string, { rejectWithValue }) => {
        try {
            await adminApi.deleteApplication(id);
            toast.success('Заявку видалено');
            return id;
        } catch (error: any) {
            const message =
                error.response?.data?.message || 'Помилка видалення заявки';
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        },
        setFilters: (state, action: PayloadAction<Partial<ApplicationFilters>>) => {
            state.filters = { ...state.filters, ...action.payload };
            state.page = 1; // Reset to first page when filters change
        },
        clearCurrentApplication: (state) => {
            state.currentApplication = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch applications
            .addCase(fetchApplications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchApplications.fulfilled, (state, action) => {
                state.loading = false;
                state.applications = action.payload.applications;
                state.total = action.payload.total;
                state.totalPages = action.payload.totalPages;
                state.page = action.payload.page;
            })
            .addCase(fetchApplications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Fetch application by id
            .addCase(fetchApplicationById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchApplicationById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentApplication = action.payload;
            })
            .addCase(fetchApplicationById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update status
            .addCase(updateStatus.fulfilled, (state, action) => {
                const index = state.applications.findIndex(
                    (app) => app.id === action.payload.id
                );
                if (index !== -1) {
                    state.applications[index] = action.payload;
                }
                if (state.currentApplication?.id === action.payload.id) {
                    state.currentApplication = action.payload;
                }
            })
            // Delete application
            .addCase(deleteApplicationById.fulfilled, (state, action) => {
                state.applications = state.applications.filter(
                    (app) => app.id.toString() !== action.payload
                );
                if (state.currentApplication?.id.toString() === action.payload) {
                    state.currentApplication = null;
                }
            });
    },
});

export const { setPage, setFilters, clearCurrentApplication } =
    adminSlice.actions;
export default adminSlice.reducer;
