import apiClient from './apiClient';

export interface ApplicationSubmissionData {
    firstName: string;
    lastName: string;
    patronymic: string;
    birthDate: string;
    passportSeries: string;
    passportNumber: string;
    issuingAuthority: string;
    placeOfResidence: string;
    passportPhoto?: File;
    userPhoto?: File;
    digitalSignature: string; // "true" for now
}

export interface ApplicationResponse {
    id: number;
    firstName: string;
    lastName: string;
    patronymic: string;
    birthDate: string;
    passportSeries: string;
    passportNumber: string;
    issuingAuthority: string;
    placeOfResidence: string;
    passportPhotoUrl?: string;
    userPhotoUrl?: string;
    digitalSignatureUrl?: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
    updatedAt?: string;
    processedAt?: string | null;
    rejectionReason?: string | null;
}

export interface ApiResponse<T> {
    status: number;
    message: string;
    data: T;
}

export const applicationApi = {
    submitApplication: async (data: ApplicationSubmissionData): Promise<ApplicationResponse> => {
        const formData = new FormData();

        // Додаємо текстові поля
        formData.append('firstName', data.firstName);
        formData.append('lastName', data.lastName);
        formData.append('patronymic', data.patronymic);
        formData.append('birthDate', data.birthDate);
        formData.append('passportSeries', data.passportSeries);
        formData.append('passportNumber', data.passportNumber);
        formData.append('issuingAuthority', data.issuingAuthority);
        formData.append('placeOfResidence', data.placeOfResidence);
        formData.append('digitalSignature', data.digitalSignature);

        // Додаємо файли (якщо є)
        if (data.passportPhoto) {
            formData.append('passportPhoto', data.passportPhoto);
        }
        if (data.userPhoto) {
            formData.append('userPhoto', data.userPhoto);
        }

        const response = await apiClient.post<ApiResponse<ApplicationResponse>>(
            '/applications/submit',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        return response.data.data;
    },

    getMyApplication: async (): Promise<ApplicationResponse> => {
        const response = await apiClient.get<ApiResponse<ApplicationResponse>>('/applications/my');
        return response.data.data;
    },
};