export interface ProfileResponse {
    imageUrl: string | null;
    name: string;
    email: string;
    phoneNumber: string | null;
    dateOfBirth: [number, number, number] | null; // [year, month, day]
    gender: 'MALE' | 'FEMALE' | 'OTHER' | null;
}
