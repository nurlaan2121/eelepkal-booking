import api from '../../../api/instances/apiInstance';
import type {
    SendOtpSmsRequest,
    SendOtpSmsResponse,
    VerifyOtpRequest,
    VerifyOtpResponse,
    SignInRequest,
    SignInResponse
} from '../types/auth.types';

export const authService = {
    /**
     * Register step 1: Send OTP to phone number
     */
    sendOtpSms: async (data: SendOtpSmsRequest): Promise<SendOtpSmsResponse> => {
        const response = await api.post<SendOtpSmsResponse>('/auth/client/send-otp-sms', data);
        return response.data;
    },

    /**
     * Register step 2: Verify OTP
     */
    verifyOtp: async (data: VerifyOtpRequest): Promise<VerifyOtpResponse> => {
        const response = await api.post<VerifyOtpResponse>('/auth/client/verify', data);
        return response.data;
    },

    /**
     * Login with phone and password
     */
    signIn: async (data: SignInRequest): Promise<SignInResponse> => {
        const response = await api.post<SignInResponse>('/auth/sign-in', data);
        return response.data;
    }
};
