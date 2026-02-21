import api from '../instances/apiInstance';
import type {
    VerifyOtpRequest,
    VerifyOtpResponse,
    SendOtpRequest,
    SendOtpResponse,
    SignInRequest,
    SignInResponse
} from '../dto/authDto';

export const authService = {
    // Client Auth: Step 1 - Send OTP
    sendOtpEmail: async (data: VerifyOtpRequest): Promise<VerifyOtpResponse> => {
        const response = await api.post<VerifyOtpResponse>('/auth/client/send-otp-email', data);
        return response.data;
    },

    // Client Auth: Step 2 - Verify OTP and login
    verifyOtpEmail: async (data: SendOtpRequest): Promise<SendOtpResponse> => {
        const response = await api.post<SendOtpResponse>('/auth/client/verify-email', data);
        return response.data;
    },

    // Admin Auth
    adminSignIn: async (data: SignInRequest): Promise<SignInResponse> => {
        const response = await api.post<SignInResponse>('/auth/admins/sign-in', data);
        return response.data;
    },

    // Logout placeholder (usually just clearing local state if stateless JWT)
    logout: async (): Promise<void> => {
        // Optional: api.post('/auth/logout');
    },

    // Refresh Token placeholder
    refreshToken: async (): Promise<{ token: string }> => {
        const response = await api.post<{ token: string }>('/auth/refresh');
        return response.data;
    },
};
