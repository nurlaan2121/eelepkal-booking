import { useMutation } from '@tanstack/react-query';
import { authService } from '../../../api/services/authService';
import { useAuthStore } from '../authStore';
import type { VerifyOtpRequest, SendOtpRequest, SendOtpResponse } from '../../../api/dto/authDto';

export const useAuth = () => {
    const { setAuth, logout } = useAuthStore();

    // Mutation for Step 1: Send OTP
    const sendOtpMutation = useMutation({
        mutationFn: (data: VerifyOtpRequest) => authService.sendOtpEmail(data),
    });

    // Mutation for Step 2: Verify OTP
    const verifyOtpMutation = useMutation({
        mutationFn: (data: SendOtpRequest) => authService.verifyOtpEmail(data),
        onSuccess: (data: SendOtpResponse) => {
            // In a real app, you'd fetch the profile after login or the login returns the user
            // For now, we manually construct the user from the response
            setAuth(data.token, { userId: data.userId, email: '' });
        },
    });

    return {
        sendOtp: sendOtpMutation.mutateAsync,
        isSendingOtp: sendOtpMutation.isPending,
        sendOtpError: sendOtpMutation.error,

        verifyOtp: verifyOtpMutation.mutateAsync,
        isVerifying: verifyOtpMutation.isPending,
        verifyError: verifyOtpMutation.error,

        logout,
    };
};
