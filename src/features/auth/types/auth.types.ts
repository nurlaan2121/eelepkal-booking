export interface SendOtpSmsRequest {
    phoneNumber: string;
    fullName: string;
    password?: string;
}

export interface SendOtpSmsResponse {
    httpStatus: string;
    message: string;
}

export interface VerifyOtpRequest {
    phoneNumber: string;
    otp: string;
}

export interface VerifyOtpResponse {
    userId: number;
    token: string;
}

export interface SignInRequest {
    phoneNumber: string;
    password?: string;
}

export interface SignInResponse {
    token: string;
    userId: number;
    role: string;
    email: string;
}

export interface SimpleResponse {
    status: string;
    message: string;
}

export interface ForgotPasswordRequest {
    phoneNumber: string;
}

export interface ResetPasswordRequest {
    phoneNumber: string;
    otpCode: string;
    newPassword: string;
}

export interface ApiErrorResponse {
    httpStatus?: string;
    status?: string;
    message: string;
}
