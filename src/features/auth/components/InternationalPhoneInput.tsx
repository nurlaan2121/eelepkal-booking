import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import './InternationalPhoneInput.css';

export interface Country {
    name: string;
    code: string;
    dialCode: string;
    flag: string;
    mask: string;
}

const COUNTRIES: Country[] = [
    { name: 'Кыргызстан', code: 'KG', dialCode: '+996', flag: '🇰🇬', mask: ' (###) ###-###' },
    { name: 'Казахстан', code: 'KZ', dialCode: '+7', flag: '🇰🇿', mask: ' (###) ###-##-##' },
    { name: 'Россия', code: 'RU', dialCode: '+7', flag: '🇷🇺', mask: ' (###) ###-##-##' },
    { name: 'Узбекистан', code: 'UZ', dialCode: '+998', flag: '🇺🇿', mask: ' (##) ###-##-##' },
    { name: 'Таджикистан', code: 'TJ', dialCode: '+992', flag: '🇹🇯', mask: ' (##) ###-##-##' },
    { name: 'Беларусь', code: 'BY', dialCode: '+375', flag: '🇧🇾', mask: ' (##) ###-##-##' },
    { name: 'Армения', code: 'AM', dialCode: '+374', flag: '🇦🇲', mask: ' (##) ###-###' },
    { name: 'Азербайджан', code: 'AZ', dialCode: '+994', flag: '🇦🇿', mask: ' (##) ###-##-##' },
    { name: 'Турция', code: 'TR', dialCode: '+90', flag: '🇹🇷', mask: ' (###) ###-##-##' },
];

interface InternationalPhoneInputProps {
    value: string; // Full number with dial code
    onChange: (value: string) => void;
    disabled?: boolean;
}

export const InternationalPhoneInput: React.FC<InternationalPhoneInputProps> = ({
    value,
    onChange,
    disabled
}) => {
    const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);
    const [inputValue, setInputValue] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Initialize from value if provided
    useEffect(() => {
        if (value && !inputValue) {
            const country = COUNTRIES.find(c => value.startsWith(c.dialCode.replace('+', '')));
            if (country) {
                setSelectedCountry(country);
                const digits = value.slice(country.dialCode.length - 1);
                setInputValue(applyMask(digits, country.mask));
            }
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const applyMask = (digits: string, mask: string) => {
        let result = '';
        let digitIndex = 0;
        for (let i = 0; i < mask.length && digitIndex < digits.length; i++) {
            if (mask[i] === '#') {
                result += digits[digitIndex];
                digitIndex++;
            } else {
                result += mask[i];
            }
        }
        return result;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const digits = e.target.value.replace(/\D/g, '');
        const maxDigits = selectedCountry.mask.replace(/[^#]/g, '').length;
        const croppedDigits = digits.slice(0, maxDigits);

        setInputValue(applyMask(croppedDigits, selectedCountry.mask));

        const fullNumber = selectedCountry.dialCode.replace('+', '') + croppedDigits;
        onChange(fullNumber);
    };

    const handleCountrySelect = (country: Country) => {
        setSelectedCountry(country);
        setIsDropdownOpen(false);
        setSearchQuery('');

        // Recalculate with new dial code
        const digits = inputValue.replace(/\D/g, '');
        const maxDigits = country.mask.replace(/[^#]/g, '').length;
        const croppedDigits = digits.slice(0, maxDigits);
        setInputValue(applyMask(croppedDigits, country.mask));

        const fullNumber = country.dialCode.replace('+', '') + croppedDigits;
        onChange(fullNumber);
    };

    const filteredCountries = COUNTRIES.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.dialCode.includes(searchQuery)
    );

    return (
        <div className="phone-input-container">
            <div className="country-selector" ref={dropdownRef}>
                <button
                    type="button"
                    className="country-btn"
                    onClick={() => !disabled && setIsDropdownOpen(!isDropdownOpen)}
                    disabled={disabled}
                >
                    <span className="flag">{selectedCountry.flag}</span>
                    <span className="dial-code">{selectedCountry.dialCode}</span>
                    <ChevronDown size={16} className={`chevron ${isDropdownOpen ? 'open' : ''}`} />
                </button>

                {isDropdownOpen && (
                    <div className="country-dropdown">
                        <div className="search-box">
                            <Search size={14} />
                            <input
                                type="text"
                                placeholder="Поиск страны..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <div className="country-list">
                            {filteredCountries.map((country) => (
                                <div
                                    key={country.code}
                                    className={`country-item ${country.code === selectedCountry.code ? 'selected' : ''}`}
                                    onClick={() => handleCountrySelect(country)}
                                >
                                    <span className="flag">{country.flag}</span>
                                    <span className="country-name">{country.name}</span>
                                    <span className="country-dial">{country.dialCode}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <input
                type="tel"
                className="phone-main-input"
                placeholder={selectedCountry.mask.replace(/#/g, '0')}
                value={inputValue}
                onChange={handleInputChange}
                disabled={disabled}
            />
        </div>
    );
};
