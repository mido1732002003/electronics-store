import { UserRole } from '../enums';

export interface IUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    avatar?: string;
    role: UserRole;
    isEmailVerified: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUserCreate {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
}

export interface IUserUpdate {
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatar?: string;
}

export interface IUserLogin {
    email: string;
    password: string;
}

export interface IAuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface IAuthResponse {
    user: IUser;
    tokens: IAuthTokens;
}
