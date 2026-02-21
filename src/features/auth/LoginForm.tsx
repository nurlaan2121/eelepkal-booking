import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { Mail, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';

const LoginForm: React.FC = () => {
    const navigate = useNavigate();
    const { sendOtp, verifyOtp, isSendingOtp, isVerifying, sendOtpError, verifyError } = useAuth();

    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<1 | 2>(1);
    const [error, setError] = useState<string | null>(null);

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            console.log('Attempting to send OTP to:', email);
            await sendOtp({ email });
            setStep(2);
        } catch (err: any) {
            console.error('Send OTP Error Details:', {
                status: err.response?.status,
                data: err.response?.data,
                message: err.message,
                config: err.config
            });
            setError(err.response?.data?.message || err.message || 'Failed to send OTP. Please try again.');
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            console.log('Attempting to verify OTP for:', email);
            await verifyOtp({ email, otp });
            navigate('/venues');
        } catch (err: any) {
            console.error('Verify OTP Error Details:', {
                status: err.response?.status,
                data: err.response?.data,
                message: err.message,
                config: err.config
            });
            setError(err.response?.data?.message || err.message || 'Invalid OTP. Please check and try again.');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                {/* Logo / Title Section */}
                <div style={styles.header}>
                    <div style={styles.logoPlaceholder}>
                        <ShieldCheck size={48} color="#FF9800" />
                    </div>
                    <h1 style={styles.title}>ElevAuto</h1>
                    <p style={styles.subtitle}>
                        {step === 1 ? 'Введите ваш email для входа' : 'Введите код подтверждения'}
                    </p>
                </div>

                {/* Form Section */}
                <form onSubmit={step === 1 ? handleSendOtp : handleVerifyOtp} style={styles.form}>
                    {step === 1 ? (
                        <div style={styles.inputGroup}>
                            <div style={styles.iconWrapper}>
                                <Mail size={20} color="#757575" />
                            </div>
                            <input
                                type="email"
                                placeholder="E-mail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isSendingOtp}
                                style={styles.input}
                            />
                        </div>
                    ) : (
                        <div style={styles.inputGroup}>
                            <div style={styles.iconWrapper}>
                                <ShieldCheck size={20} color="#757575" />
                            </div>
                            <input
                                type="text"
                                placeholder="OTP Код"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                maxLength={6}
                                disabled={isVerifying}
                                style={styles.input}
                            />
                        </div>
                    )}

                    {/* Error Message */}
                    {(error || sendOtpError || verifyError) && (
                        <div style={styles.errorText}>
                            {error || (sendOtpError as any)?.message || (verifyError as any)?.message}
                        </div>
                    )}

                    {/* Action Button */}
                    <button
                        type="submit"
                        disabled={isSendingOtp || isVerifying}
                        style={{
                            ...styles.button,
                            opacity: (isSendingOtp || isVerifying) ? 0.7 : 1,
                        }}
                    >
                        {isSendingOtp || isVerifying ? (
                            <Loader2 size={24} className="animate-spin" />
                        ) : (
                            <>
                                <span>{step === 1 ? 'Отправить OTP' : 'Подтвердить'}</span>
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </form>

                {/* Footer / Toggle Step */}
                {step === 2 ? (
                    <button
                        onClick={() => setStep(1)}
                        style={styles.linkButton}
                        disabled={isVerifying}
                    >
                        Изменить email
                    </button>
                ) : (
                    <div style={styles.footer}>
                        <p style={styles.footerText}>
                            Нет аккаунта? <Link to="/register" style={styles.link}>Зарегистрируйтеся</Link>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    // ... existing styles ...
    footer: {
        textAlign: 'center',
    },
    footerText: {
        fontSize: '18px',
        color: '#000000',
    },
    link: {
        color: '#FF9800',
        fontWeight: '600',
        textDecoration: 'none',
        marginLeft: '5px',
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#FFFFFF',
        padding: '20px',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Nunito", "Roboto", sans-serif',
    },
    content: {
        width: '100%',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
    },
    header: {
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
    },
    logoPlaceholder: {
        marginBottom: '16px',
    },
    title: {
        fontSize: '32px',
        fontWeight: '700',
        color: '#000000',
        margin: 0,
    },
    subtitle: {
        fontSize: '16px',
        color: '#757575',
        margin: 0,
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    inputGroup: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
    },
    iconWrapper: {
        position: 'absolute',
        left: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        width: '100%',
        height: '58px',
        padding: '0 16px 0 48px',
        fontSize: '16px',
        borderRadius: '10px',
        border: '1px solid #E0E0E0',
        outline: 'none',
        transition: 'border-color 0.2s',
        boxSizing: 'border-box',
    },
    button: {
        height: '58px',
        backgroundColor: '#FF9800',
        color: '#FFFFFF',
        border: 'none',
        borderRadius: '15px',
        fontSize: '20px',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        boxShadow: '0 4px 6px rgba(255, 152, 0, 0.2)',
        marginTop: '12px',
    },
    errorText: {
        color: '#C43B3B',
        fontSize: '14px',
        textAlign: 'left',
    },
    linkButton: {
        background: 'none',
        border: 'none',
        color: '#FF9800',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        textDecoration: 'underline',
        marginTop: '8px',
    },
};

export default LoginForm;
