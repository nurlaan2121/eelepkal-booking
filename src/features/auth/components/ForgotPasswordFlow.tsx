import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, Loader2, Key, ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { InternationalPhoneInput } from './InternationalPhoneInput';
import { useNavigate } from 'react-router-dom';
import './auth.css';

export const ForgotPasswordFlow: React.FC = () => {
    const { forgotPassword, resetPassword, isLoading } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState<1 | 2>(1);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [cooldown, setCooldown] = useState(0);
    const [serverError, setServerError] = useState('');

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (cooldown > 0) {
            timer = setInterval(() => {
                setCooldown(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [cooldown]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleStep1 = async (e: React.FormEvent) => {
        e.preventDefault();
        setServerError('');
        if (!phoneNumber) return;

        const result = await forgotPassword(phoneNumber);
        if (result.success) {
            setStep(2);
        } else if (result.cooldownSeconds) {
            setCooldown(result.cooldownSeconds);
            setServerError(result.message || 'Слишком много попыток. Попробуйте позже.');
        } else {
            setServerError(result.message || 'Пользователь не найден');
        }
    };

    const handleStep2 = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!otpCode || !newPassword || newPassword !== confirmPassword) return;

        const result = await resetPassword({
            phoneNumber,
            otpCode,
            newPassword
        });

        if (result.success) {
            // Success state is handled by toast and reset to login
            setTimeout(() => navigate('/login'), 2000);
        } else {
            setServerError(result.message || 'Неверный код или пароль');
        }
    };

    const isPasswordsMatch = newPassword === confirmPassword;

    return (
        <div className="auth-card animate-in">
            <div className="auth-header">
                <button
                    className="back-button"
                    onClick={() => step === 2 ? setStep(1) : navigate('/login')}
                >
                    <ArrowLeft size={20} />
                </button>
                <h1>{step === 1 ? 'Сброс пароля' : 'Новый пароль'}</h1>
                <p>
                    {step === 1
                        ? 'Введите ваш номер телефона для получения кода'
                        : `Введите код из СМС, отправленный на +${phoneNumber}`}
                </p>
            </div>

            {step === 1 ? (
                <form onSubmit={handleStep1} className="auth-form">
                    <div className="input-group">
                        <label>Номер телефона</label>
                        <InternationalPhoneInput
                            value={phoneNumber}
                            onChange={setPhoneNumber}
                            disabled={isLoading || cooldown > 0}
                        />
                        {serverError && <span className="input-error-text mt-2 block">{serverError}</span>}
                        {cooldown > 0 && (
                            <div className="cooldown-text mt-4">
                                Повторная отправка возможна через <strong>{formatTime(cooldown)}</strong>
                            </div>
                        )}
                    </div>

                    <div className="auth-actions">
                        <button
                            type="submit"
                            className="auth-button primary"
                            disabled={isLoading || !phoneNumber || cooldown > 0}
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : 'Подтвердить'}
                        </button>
                    </div>
                </form>
            ) : (
                <form onSubmit={handleStep2} className="auth-form">
                    <div className="input-group">
                        <label>Код из СМС</label>
                        <div className="input-wrapper">
                            <Key className="input-icon" size={20} />
                            <input
                                type="text"
                                placeholder="0000"
                                value={otpCode}
                                onChange={(e) => setOtpCode(e.target.value)}
                                disabled={isLoading}
                                className="auth-input"
                                maxLength={6}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Новый пароль</label>
                        <div className="input-wrapper">
                            <Lock className="input-icon" size={20} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Минимум 6 символов"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                disabled={isLoading}
                                className="auth-input"
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Повторите пароль</label>
                        <div className="input-wrapper">
                            <Lock className="input-icon" size={20} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Повторите новый пароль"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={isLoading}
                                className={`auth-input ${confirmPassword && !isPasswordsMatch ? 'error-border' : ''}`}
                                required
                            />
                        </div>
                        {confirmPassword && !isPasswordsMatch && (
                            <span className="input-error-text">Пароли не совпадают</span>
                        )}
                    </div>

                    {serverError && <span className="input-error-text text-center block mb-4">{serverError}</span>}

                    <div className="auth-actions">
                        <button
                            type="submit"
                            className="auth-button primary"
                            disabled={isLoading || !otpCode || !newPassword || !isPasswordsMatch}
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : 'Сохранить новый пароль'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};
