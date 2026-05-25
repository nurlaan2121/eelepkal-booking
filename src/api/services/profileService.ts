import api from '../instances/apiInstance';
import { ProfileResponse, ProfileUpdateRequest } from '../dto/profile';

export interface S3UploadResponse {
    url: string;
    fileName: string;
    fileType: string;
    size: number;
}

export const profileService = {
    getProfile: async (): Promise<ProfileResponse> => {
        const response = await api.get<ProfileResponse>('/client/get-profile');
        return response.data;
    },

    updateProfile: async (data: ProfileUpdateRequest): Promise<ProfileResponse> => {
        const response = await api.put<ProfileResponse>('/client/edit', data);
        return response.data;
    },

    uploadProfilePhoto: async (file: File): Promise<S3UploadResponse> => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post<S3UploadResponse>('/s3', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log('📤 Raw axios response:', response);
        console.log('📤 response.data:', response.data);
        
        // Server returns the URL directly in response.data as a string
        // Or it might be in response.data.url
        const url = typeof response.data === 'string' ? response.data : response.data.url;
        
        return {
            url: url,
            fileName: response.data.fileName || '',
            fileType: response.data.fileType || '',
            size: response.data.size || 0
        };
    },
};
