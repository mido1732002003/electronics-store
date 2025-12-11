export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s-()]{10,}$/;
    return phoneRegex.test(phone);
};

export const isValidPassword = (password: string): boolean => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};

export const isValidPostalCode = (postalCode: string, country: string = 'US'): boolean => {
    const patterns: Record<string, RegExp> = {
        US: /^\d{5}(-\d{4})?$/,
        UK: /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i,
        CA: /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i,
        DE: /^\d{5}$/,
        FR: /^\d{5}$/,
        AU: /^\d{4}$/,
    };
    const pattern = patterns[country] || /^[\w\s-]{3,10}$/;
    return pattern.test(postalCode);
};

export const isValidCreditCard = (cardNumber: string): boolean => {
    const cleaned = cardNumber.replace(/\D/g, '');
    if (cleaned.length < 13 || cleaned.length > 19) return false;

    // Luhn algorithm
    let sum = 0;
    let isEven = false;
    for (let i = cleaned.length - 1; i >= 0; i--) {
        let digit = parseInt(cleaned[i], 10);
        if (isEven) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        sum += digit;
        isEven = !isEven;
    }
    return sum % 10 === 0;
};

export const isValidCVV = (cvv: string): boolean => {
    return /^\d{3,4}$/.test(cvv);
};

export const isValidExpiryDate = (month: string, year: string): boolean => {
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);
    if (m < 1 || m > 12) return false;

    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;

    if (y < currentYear || (y === currentYear && m < currentMonth)) {
        return false;
    }
    return true;
};

export const isValidUrl = (url: string): boolean => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

export const isValidSKU = (sku: string): boolean => {
    return /^[A-Z0-9-]{5,20}$/.test(sku.toUpperCase());
};

export const isEmpty = (value: unknown): boolean => {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim().length === 0;
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
};

export const isPositiveNumber = (value: number): boolean => {
    return typeof value === 'number' && !isNaN(value) && value > 0;
};

export const isNonNegativeNumber = (value: number): boolean => {
    return typeof value === 'number' && !isNaN(value) && value >= 0;
};

export const isInteger = (value: number): boolean => {
    return typeof value === 'number' && Number.isInteger(value);
};

export const isInRange = (value: number, min: number, max: number): boolean => {
    return value >= min && value <= max;
};
