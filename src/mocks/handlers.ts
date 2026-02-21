import { http, HttpResponse, delay } from 'msw';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const handlers = [
    // Mock Step 1: Send OTP
    http.post(`${API_BASE}/auth/client/send-otp-email`, async ({ request }) => {
        const { email } = (await request.json()) as { email: string };

        await delay(1000); // Simulate network latency

        if (email.includes('error')) {
            return new HttpResponse(null, { status: 400 });
        }

        return HttpResponse.json({
            httpStatus: 'OK',
            message: 'OTP Code sent successfully to ' + email,
        });
    }),

    // Mock Step 2: Verify OTP
    http.post(`${API_BASE}/auth/client/verify-email`, async ({ request }) => {
        const { email, otp } = (await request.json()) as { email: string; otp: string };

        await delay(1000);

        if (otp === '123456') {
            return HttpResponse.json({
                userId: 123,
                token: 'mock-jwt-token-xyz',
            });
        }

        return new HttpResponse(
            JSON.stringify({ message: 'Invalid OTP code' }),
            { status: 401 }
        );
    }),

    // Mock Refresh Token
    http.post(`${API_BASE}/auth/refresh`, async () => {
        await delay(500);
        return HttpResponse.json({
            token: 'new-mock-jwt-token-' + Date.now(),
        });
    }),
];
