import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { config } from '../config';

export interface TokenPayload {
    userId: string;
    email: string;
    role: string;
    type: 'access' | 'refresh';
}

export const generateAccessToken = (payload: Omit<TokenPayload, 'type'>): string => {
    return jwt.sign(
        { ...payload, type: 'access' },
        config.jwt.secret,
        { expiresIn: config.jwt.accessExpiration as any }
    );
};

export const generateRefreshToken = (payload: Omit<TokenPayload, 'type'>): string => {
    return jwt.sign(
        { ...payload, type: 'refresh' },
        config.jwt.secret,
        { expiresIn: config.jwt.refreshExpiration as any }
    );
};

export const generateTokens = (payload: Omit<TokenPayload, 'type'>): { accessToken: string; refreshToken: string } => {
    return {
        accessToken: generateAccessToken(payload),
        refreshToken: generateRefreshToken(payload),
    };
};

export const verifyToken = (token: string): TokenPayload => {
    return jwt.verify(token, config.jwt.secret) as TokenPayload;
};

export const decodeToken = (token: string): TokenPayload | null => {
    try {
        return jwt.decode(token) as TokenPayload;
    } catch {
        return null;
    }
};

export const generateRandomToken = (length: number = 32): string => {
    return crypto.randomBytes(length).toString('hex');
};

export const generateHashedToken = (token: string): string => {
    return crypto.createHash('sha256').update(token).digest('hex');
};

export const getTokenExpiration = (duration: string): Date => {
    const match = duration.match(/^(\d+)([smhd])$/);
    if (!match) {
        throw new Error('Invalid duration format');
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    const multipliers: Record<string, number> = {
        s: 1000,
        m: 60 * 1000,
        h: 60 * 60 * 1000,
        d: 24 * 60 * 60 * 1000,
    };

    return new Date(Date.now() + value * multipliers[unit]);
};

export default {
    generateAccessToken,
    generateRefreshToken,
    generateTokens,
    verifyToken,
    decodeToken,
    generateRandomToken,
    generateHashedToken,
    getTokenExpiration,
};
