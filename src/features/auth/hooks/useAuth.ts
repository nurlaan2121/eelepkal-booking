import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuthStore } from '../authStore';
import { useToastStore } from '../../../store/useToastStore';
import type {
    SendOtpSmsRequest,
    SignInRequest,
    VerifyOtpRequest,
    ApiErrorResponse
} from '../types/auth.types';
import axios from 'axios';

export const useAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { setAuth, logout } = useAuthStore();
    const { addToast } = useToastStore();
    const navigate = useNavigate();

    const handleApiError = (error: any) => {
        if (axios.isAxiosError(error) && error.response) {
            const data = error.response.data as ApiErrorResponse;
            const status = error.response.status;

            if (status === 429 || (status === 400 && data.message?.includes('Повторная отправка'))) {
                addToast(data.message || 'Слишком много запросов. Попробуйте позже.', 'error');
                return data.message;
            }

            if (data.message === 'У вас уже есть аккаунт войдите') {
                // This will be handled in the component to show the modal
                return 'ACCOUNT_EXISTS';
            }

            if (data.message === 'Вы не клиент' || data.message === 'Этот номер принадлежит сотруднику системы') {
                addToast('Этот номер принадлежит сотруднику системы', 'error');
                return 'NOT_A_CLIENT';
            }

            if (status === 502 || data.message?.includes('Шлюз SMS')) {
                addToast('Ошибка SMS сервиса. Попробуйте позже.', 'error');
                return 'GATEWAY_ERROR';
            }

            if (status === 402 || data.message?.includes('Недостаточно средств')) {
                addToast('Сервис временно недоступен', 'error');
                return 'PAYMENT_REQUIRED';
            }

            if (status === 404 && data.message === 'User not found') {
                addToast('Пользователь не найден', 'error');
                return 'USER_NOT_FOUND';
            }

            if (data.message?.includes('Превышено количество попыток')) {
                addToast('Превышено количество попыток. Запросите новый код.', 'error');
                return 'TOO_MANY_ATTEMPTS';
            }

            if (data.message?.includes('Срок действия кода истёк')) {
                addToast('Срок действия кода истёк', 'error');
                return 'OTP_EXPIRED';
            }

            if (data.message?.includes('Неверный код подтверждения')) {
                addToast('Неверный код подтверждения', 'error');
                return 'WRONG_OTP';
            }

            addToast(data.message || 'Произошла ошибка. Попробуйте еще раз.', 'error');
            return data.message;
        }

        addToast('Ошибка сети. Проверьте подключение.', 'error');
        return 'NETWORK_ERROR';
    };

    const login = async (data: SignInRequest) => {
        setIsLoading(true);
        try {
            const response = await authService.signIn(data);

            if (response.role !== 'CLIENT') {
                addToast('Доступ разрешён только клиентам', 'error');
                setIsLoading(false);
                return false;
            }

            setAuth(response.token, {
                userId: response.userId,
                email: response.email,
                role: response.role
            });

            addToast('С возвращением!', 'success');
            navigate('/');
            return true;
        } catch (error) {
            handleApiError(error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const sendOtp = async (data: SendOtpSmsRequest) => {
        setIsLoading(true);
        try {
            const response = await authService.sendOtpSms(data);
            // Status 200 (OK) or 202 (ACCEPTED) are successful
            if (response.httpStatus === 'OK' || response.httpStatus === 'ACCEPTED') {
                return 'SUCCESS';
            }
            return response.message;
        } catch (error) {
            return handleApiError(error);
        } finally {
            setIsLoading(false);
        }
    };

    const verifyOtp = async (data: VerifyOtpRequest) => {
        setIsLoading(true);
        try {
            const response = await authService.verifyOtp(data);

            setAuth(response.token, {
                userId: response.userId,
                email: '', // Backend doesn't return email here, but store expects it
                role: 'CLIENT'
            });

            addToast('Регистрация успешно завершена!', 'success');
            navigate('/');
            return true;
        } catch (error) {
            return handleApiError(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return {
        login,
        sendOtp,
        verifyOtp,
        logout: handleLogout,
        isLoading
    };
};
