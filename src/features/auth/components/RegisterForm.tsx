import React, { useState } from 'react';
import { User, Phone, Lock, Eye, EyeOff, Loader2, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import './auth.css';

interface RegisterFormProps {
    onOtpSent: (phone: string, name: string, pass: string) => void;
    onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onOtpSent, onSwitchToLogin }) => {
    const { sendOtp, isLoading } = useAuth();
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showExistsModal, setShowExistsModal] = useState(false);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        if (value.startsWith('+')) {
            value = '+' + value.slice(1).replace(/\D/g, '');
        } else {
            value = value.replace(/\D/g, '');
        }
        setPhoneNumber(value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (phoneNumber.length < 9 || !fullName || !password) return;

        // Remove + for API
        const cleanPhone = phoneNumber.replace('+', '');
        const result = await sendOtp({ phoneNumber: cleanPhone, fullName, password });
        if (result === 'SUCCESS') {
            onOtpSent(cleanPhone, fullName, password);
        } else if (result === 'ACCOUNT_EXISTS') {
            setShowExistsModal(true);
        }
    };

    return (
        <div className="auth-form-container">
            {showExistsModal && (
                <div className="modal-overlay">
                    <div className="auth-modal">
                        <button className="modal-close" onClick={() => setShowExistsModal(false)}>
                            <X size={20} />
                        </button>
                        <div className="modal-header">
                            <h2>У вас уже есть аккаунт</h2>
                            <p>Войдите используя номер телефона и пароль</p>
                        </div>
                        <div className="modal-actions">
                            <button className="auth-button primary" onClick={onSwitchToLogin}>
                                Войти
                            </button>
                            <button className="auth-button secondary" onClick={() => setShowExistsModal(false)}>
                                Закрыть
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <form onSubmit={handleSubmit} className="auth-form">
                <div className="input-group">
                    <label>Имя</label>
                    <div className="input-wrapper">
                        <User className="input-icon" size={20} />
                        <input
                            type="text"
                            placeholder="Ваше имя"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            disabled={isLoading}
                            className="auth-input"
                            required
                        />
                    </div>
                </div>

                <div className="input-group">
                    <label>Номер телефона</label>
                    <div className="input-wrapper">
                        <Phone className="input-icon" size={20} />
                        <input
                            type="tel"
                            placeholder="+996XXXXXXXXX"
                            value={phoneNumber}
                            onChange={handlePhoneChange}
                            disabled={isLoading}
                            className="auth-input"
                            required
                        />
                    </div>
                </div>

                <div className="input-group">
                    <label>Пароль</label>
                    <div className="input-wrapper">
                        <Lock className="input-icon" size={20} />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Придумайте пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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

                <div className="auth-actions">
                    <button
                        type="submit"
                        className="auth-button primary"
                        disabled={isLoading || phoneNumber.length < 9 || !fullName || !password}
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : 'Получить код'}
                    </button>

                    <a
                        href="https://client.eelepkal.com/venues"
                        className="auth-button secondary guest-btn"
                    >
                        Войти как гость
                    </a>
                </div>

                <div className="auth-footer">
                    <span>Уже есть аккаунт?</span>
                    <button type="button" className="link-button" onClick={onSwitchToLogin}>
                        Войти
                    </button>
                </div>
            </form>
        </div>
    );
};
