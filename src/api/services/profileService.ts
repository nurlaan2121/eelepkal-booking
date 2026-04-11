import api from '../instances/apiInstance';
import { ProfileResponse } from '../dto/profile';

export const profileService = {
    getProfile: async (): Promise<ProfileResponse> => {
        const response = await api.get<ProfileResponse>('/client/get-profile');
        return response.data;
    },
};
