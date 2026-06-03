import React, { useState } from 'react';
import { Phone, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import './auth.css';

interface LoginFormProps {
    onSwitchToRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
    const { login, isLoading } = useAuth();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

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
        if (phoneNumber.length < 12) return;
        await login({ phoneNumber, password });
    };

    return (
        <div className="auth-form-container">
            <form onSubmit={handleSubmit} className="auth-form">
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
                        />
                    </div>
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
                </div>

                <button type="submit" className="auth-button primary" disabled={isLoading || phoneNumber.length < 12}>
                    {isLoading ? <Loader2 className="animate-spin" /> : 'Войти'}
                </button>

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
