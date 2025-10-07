export interface ApplicationData {
    firstName: string;
    lastName: string;
    patronymic: string;
    birthDate: string;
    passportSeries: string;
    passportNumber: string;
    issuingAuthority: string;
    placeOfResidence: string;
    passportPhoto: File | null;
    userPhoto: File | null;
    digitalSignature: string | null;
}

export interface ApplicationState {
    isLoading: boolean;
    error: string | null;
    isSubmitted: boolean;
}