export interface VerifyOtpRequest {
    email: string;
}

export interface VerifyOtpResponse {
    httpStatus: string;
    message: string;
}

export interface SendOtpRequest {
    email: string;
    otp: string;
}

export interface SendOtpResponse {
    userId: number;
    token: string;
}

export interface SignInRequest {
    email: string;
    password: string;
}

export interface SignInResponse {
    token: string;
    userId: number;
    role: string;
    email: string;
}
