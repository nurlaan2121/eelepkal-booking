import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './auth.css';
import { InternationalPhoneInput } from './InternationalPhoneInput';

interface LoginFormProps {
    onSwitchToRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
    const { login, isLoading } = useAuth();
    const navigate = useNavigate();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (phoneNumber.length < 9) return;
        await login({ phoneNumber, password });
    };

    return (
        <div className="auth-form-container">
            <form onSubmit={handleSubmit} className="auth-form">
                <div className="input-group">
                    <label>Номер телефона</label>
                    <InternationalPhoneInput
                        value={phoneNumber}
                        onChange={setPhoneNumber}
                        disabled={isLoading}
                    />
                </div>

                <div className="input-group">
                    <label>Пароль</label>
                    <div className="input-wrapper">
                        <Lock className="input-icon" size={20} />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Введите пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                            className="auth-input"
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    <div className="forgot-password-link">
                        <button type="button" className="link-button" onClick={() => navigate('/forgot-password')}>
                            Забыли пароль?
                        </button>
                    </div>
                </div>

                <div className="auth-actions">
                    <button type="submit" className="auth-button primary" disabled={isLoading || phoneNumber.length < 9}>
                        {isLoading ? <Loader2 className="animate-spin" /> : 'Войти'}
                    </button>

                    <a
                        href="https://client.eelepkal.com/venues"
                        className="auth-button secondary guest-btn"
                    >
                        Войти как гость
                    </a>
                </div>

                <div className="auth-footer">
                    <span>Нет аккаунта?</span>
                    <button type="button" className="link-button" onClick={onSwitchToRegister}>
                        Зарегистрироваться
                    </button>
                </div>
            </form>
        </div>
    );
};
