import apiClient from './apiClient';
import type {
    AdminApplication,
    AdminApplicationsResponse,
    AdminApplicationsResult,
    UpdateApplicationStatusPayload,
    ApplicationFilters,
} from '../types/admin.types';

export const getAllApplications = async (
    page = 1,
    limit = 10,
    filters?: ApplicationFilters
): Promise<AdminApplicationsResult> => {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    });

    if (filters?.status && filters.status !== 'all') {
        params.append('status', filters.status);
    }
    if (filters?.search) {
        params.append('search', filters.search);
    }
    if (filters?.sortBy) {
        params.append('sortBy', filters.sortBy);
    }
    if (filters?.sortOrder) {
        params.append('sortOrder', filters.sortOrder);
    }

    const response = await apiClient.get<AdminApplicationsResponse>(
        `/admin/applications?${params.toString()}`
    );
    return {
        applications: response.data.data,
        total: response.data.pagination.total,
        page: response.data.pagination.page,
        totalPages: response.data.pagination.totalPages,
    };
};

export const getApplicationById = async (
    id: string
): Promise<AdminApplication> => {
    const response = await apiClient.get<{ data: AdminApplication }>(
        `/admin/applications/${id}`
    );
    return response.data.data;
};

export const updateApplicationStatus = async (
    payload: UpdateApplicationStatusPayload
): Promise<AdminApplication> => {
    const response = await apiClient.patch<{ data: AdminApplication }>(
        `/admin/applications/${payload.applicationId}/status`,
        {
            status: payload.status,
            rejectionReason: payload.rejectionReason,
        }
    );
    return response.data.data;
};

export const deleteApplication = async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/applications/${id}`);
};
