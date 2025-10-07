export interface AdminApplication {
    id: number;
    userId: number;
    username?: string;
    email?: string;
    firstName: string;
    lastName: string;
    patronymic: string;
    birthDate: string;
    passportSeries: string;
    passportNumber: string;
    issuingAuthority: string;
    placeOfResidence: string;
    passportPhotoUrl: string;
    userPhotoUrl: string;
    digitalSignatureUrl: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
    updatedAt: string;
    processedAt: string | null;
    processedBy: number | null;
    processorUsername?: string | null;
    rejectionReason: string | null;
}

export interface AdminApplicationsResponse {
    status: number;
    message: string;
    data: AdminApplication[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface AdminApplicationsResult {
    applications: AdminApplication[];
    total: number;
    page: number;
    totalPages: number;
}

export interface UpdateApplicationStatusPayload {
    applicationId: string;
    status: 'approved' | 'rejected';
    rejectionReason?: string;
}

export interface ApplicationFilters {
    status?: 'pending' | 'approved' | 'rejected' | 'all';
    search?: string;
    sortBy?: 'submittedAt' | 'processedAt' | 'username';
    sortOrder?: 'asc' | 'desc';
}
