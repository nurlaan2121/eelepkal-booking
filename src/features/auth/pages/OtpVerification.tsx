import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { OtpInput } from '../components/OtpInput';
import { useAuth } from '../hooks/useAuth';
import { ArrowLeft, Loader2, RefreshCw } from 'lucide-react';
import './OtpVerification.css';

const OTP_COOLDOWN = 300; // 5 minutes in seconds

const OtpVerification: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { verifyOtp, sendOtp, isLoading } = useAuth();

    const { phoneNumber, fullName, password } = location.state || {};

    const [otp, setOtp] = useState('');
    const [timeLeft, setTimeLeft] = useState(OTP_COOLDOWN);
    const [canResend, setCanResend] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        if (!phoneNumber) {
            navigate('/login');
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [phoneNumber, navigate]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleVerify = async (otpValue: string) => {
        if (otpValue.length === 4) {
            setIsError(false);
            const success = await verifyOtp({ phoneNumber, otp: otpValue });
            if (!success) {
                setIsError(true);
                setOtp('');
            }
        }
    };

    const handleResend = async () => {
        if (!canResend) return;

        const result = await sendOtp({ phoneNumber, fullName, password });
        if (result === 'SUCCESS') {
            setTimeLeft(OTP_COOLDOWN);
            setCanResend(false);
            setOtp('');
            setIsError(false);
        }
    };

    const maskPhone = (phone: string) => {
        if (!phone) return '';
        return `+996 ${phone.slice(3, 6)} XX XX ${phone.slice(10)}`;
    };

    return (
        <div className="otp-page-container">
            <div className="otp-card">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={24} />
                </button>

                <div className="otp-header">
                    <h1>Подтверждение</h1>
                    <p>Мы отправили код на номер<br /><strong>{maskPhone(phoneNumber)}</strong></p>
                </div>

                <OtpInput
                    value={otp}
                    onChange={(val) => {
                        setOtp(val);
                        if (val.length === 4) handleVerify(val);
                    }}
                    disabled={isLoading}
                    isError={isError}
                />

                <div className="otp-footer">
                    {canResend ? (
                        <button
                            className="resend-btn"
                            onClick={handleResend}
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <RefreshCw size={20} />}
                            <span>Отправить код повторно</span>
                        </button>
                    ) : (
                        <div className="timer-text">
                            Отправить повторно через <span>{formatTime(timeLeft)}</span>
                        </div>
                    )}
                </div>

                {isLoading && (
                    <div className="loading-overlay">
                        <Loader2 className="animate-spin" size={48} color="#3b82f6" />
                        <p>Проверка кода...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OtpVerification;
