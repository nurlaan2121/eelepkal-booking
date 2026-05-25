import api from '../instances/apiInstance';
import { ProfileResponse, ProfileUpdateRequest } from '../dto/profile';

export const profileService = {
    getProfile: async (): Promise<ProfileResponse> => {
        const response = await api.get<ProfileResponse>('/client/get-profile');
        return response.data;
    },

    updateProfile: async (data: ProfileUpdateRequest): Promise<ProfileResponse> => {
        const response = await api.put<ProfileResponse>('/client/edit', data);
        return response.data;
    },
};
