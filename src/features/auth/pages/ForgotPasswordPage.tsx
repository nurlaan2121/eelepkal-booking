import React from 'react';
import { ForgotPasswordFlow } from '../components/ForgotPasswordFlow';
import './AuthPage.css';

const ForgotPasswordPage: React.FC = () => {
    return (
        <div className="auth-page-container">
            <div className="auth-content">
                <ForgotPasswordFlow />
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
