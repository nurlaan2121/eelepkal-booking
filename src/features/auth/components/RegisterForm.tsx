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
        let value = e.target.value.replace(/\D/g, '');
        if (!value.startsWith('996')) {
            value = '996' + value;
        }
        value = value.slice(0, 12);
        setPhoneNumber(value);
    };

    const displayPhone = (val: string) => {
        if (!val) return '+996 (___) __-__-__';
        const numbers = val.slice(3);
        let res = '+996 (';
        res += numbers.slice(0, 3).padEnd(3, '_');
        res += ') ';
        res += numbers.slice(3, 6).padEnd(3, '_');
        res += '-';
        res += numbers.slice(6, 8).padEnd(2, '_');
        res += '-';
        res += numbers.slice(8, 10).padEnd(2, '_');
        return res;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (phoneNumber.length < 12 || !fullName || !password) return;

        const result = await sendOtp({ phoneNumber, fullName, password });
        if (result === 'SUCCESS') {
            onOtpSent(phoneNumber, fullName, password);
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
                            type="text"
                            placeholder="+996 (___) __-__-__"
                            value={displayPhone(phoneNumber)}
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

                <button
                    type="submit"
                    className="auth-button primary"
                    disabled={isLoading || phoneNumber.length < 12 || !fullName || !password}
                >
                    {isLoading ? <Loader2 className="animate-spin" /> : 'Получить код'}
                </button>

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
