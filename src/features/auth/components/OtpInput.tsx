import React, { useRef, useEffect } from 'react';
import './OtpInput.css';

interface OtpInputProps {
    value: string;
    onChange: (value: string) => void;
    length?: number;
    disabled?: boolean;
    isError?: boolean;
}

export const OtpInput: React.FC<OtpInputProps> = ({
    value,
    onChange,
    length = 4,
    disabled = false,
    isError = false
}) => {
    const inputs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        // Focus first input on mount
        if (inputs.current[0]) {
            inputs.current[0].focus();
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const val = e.target.value;
        if (/^[0-9]$/.test(val)) {
            const newValue = value.split('');
            newValue[index] = val;
            const combinedValue = newValue.join('').slice(0, length);
            onChange(combinedValue);

            // Move to next input
            if (index < length - 1 && inputs.current[index + 1]) {
                inputs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace') {
            if (!value[index] && index > 0) {
                // Move to previous input and clear it
                const newValue = value.split('');
                newValue[index - 1] = '';
                onChange(newValue.join(''));
                inputs.current[index - 1]?.focus();
            } else {
                // Clear current input
                const newValue = value.split('');
                newValue[index] = '';
                onChange(newValue.join(''));
            }
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, length);
        if (/^\d+$/.test(pastedData)) {
            onChange(pastedData);
            // Focus last input or appropriate one
            const targetIndex = Math.min(pastedData.length, length - 1);
            inputs.current[targetIndex]?.focus();
        }
    };

    return (
        <div className={`otp-container ${isError ? 'shake' : ''}`}>
            {Array.from({ length }).map((_, index) => (
                <input
                    key={index}
                    ref={(el) => { inputs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    pattern="\d*"
                    maxLength={1}
                    value={value[index] || ''}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    disabled={disabled}
                    className={`otp-field ${value[index] ? 'has-value' : ''} ${isError ? 'error' : ''}`}
                />
            ))}
        </div>
    );
};
