import React, { useState } from 'react';
import { LoginForm } from '../components/LoginForm';
import { RegisterForm } from '../components/RegisterForm';
import { useNavigate } from 'react-router-dom';
import './AuthPage.css';

const AuthPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
    const navigate = useNavigate();

    const handleOtpSent = (phoneNumber: string, fullName: string, password?: string) => {
        // Navigate to OTP verification with state
        navigate('/otp-verify', {
            state: { phoneNumber, fullName, password, flow: 'register' }
        });
    };

    return (
        <div className="auth-page-container">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="logo-container">
                        <img src="/logo.png" alt="Ээлеп кал" className="auth-logo" />
                    </div>
                    <h1>Ээлеп кал</h1>
                    <p>Бронируйте столы легко и быстро</p>
                </div>

                <div className="auth-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
                        onClick={() => setActiveTab('login')}
                    >
                        Вход
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`}
                        onClick={() => setActiveTab('register')}
                    >
                        Регистрация
                    </button>
                </div>

                <div className="tab-content">
                    {activeTab === 'login' ? (
                        <LoginForm onSwitchToRegister={() => setActiveTab('register')} />
                    ) : (
                        <RegisterForm
                            onOtpSent={handleOtpSent}
                            onSwitchToLogin={() => setActiveTab('login')}
                        />
                    )}
                </div>
            </div>

            <div className="auth-page-footer">
                Работаем по всему Кыргызстану
            </div>
        </div>
    );
};

export default AuthPage;
