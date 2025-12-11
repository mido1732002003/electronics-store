import { Request, Response } from 'express';
import crypto from 'crypto';
import { User, Token } from '../models';
import { ApiResponse, ApiError, asyncHandler, generateTokens, generateRandomToken, generateHashedToken, getTokenExpiration, sendWelcomeEmail, sendPasswordResetEmail } from '../utils';
import { config } from '../config';
import { UserRole } from '../enums';

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, firstName, lastName]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string, minLength: 8 }
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               phone: { type: string }
 *     responses:
 *       201: { description: User registered successfully }
 *       409: { description: Email already exists }
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
    const { email, password, firstName, lastName, phone } = req.body;

    // Check if user exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
        throw ApiError.conflict('Email already exists');
    }

    // Create user
    const user = await User.create({
        email,
        password,
        firstName,
        lastName,
        phone,
        role: UserRole.CUSTOMER,
    });

    // Generate tokens
    const tokens = generateTokens({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
    });

    // Save refresh token
    await Token.create({
        user: user._id,
        token: tokens.refreshToken,
        type: 'refresh',
        expiresAt: getTokenExpiration(config.jwt.refreshExpiration),
    });

    // Send welcome email
    try {
        await sendWelcomeEmail(user.email, { firstName: user.firstName });
    } catch (error) {
        console.error('Failed to send welcome email:', error);
    }

    return ApiResponse.created(res, {
        user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
        },
        tokens,
    }, 'Registration successful');
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string }
 *     responses:
 *       200: { description: Login successful }
 *       401: { description: Invalid credentials }
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Find user with password
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
        throw ApiError.unauthorized('Invalid email or password');
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        throw ApiError.unauthorized('Invalid email or password');
    }

    // Check if account is active
    if (!user.isActive) {
        throw ApiError.unauthorized('Account has been deactivated');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const tokens = generateTokens({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
    });

    // Save refresh token
    await Token.create({
        user: user._id,
        token: tokens.refreshToken,
        type: 'refresh',
        expiresAt: getTokenExpiration(config.jwt.refreshExpiration),
    });

    return ApiResponse.success(res, {
        user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            avatar: user.avatar,
        },
        tokens,
    }, 'Login successful');
});

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout user
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Logout successful }
 */
export const logout = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    // Blacklist refresh token if provided
    if (refreshToken) {
        await Token.findOneAndUpdate(
            { token: refreshToken },
            { blacklisted: true }
        );
    }

    // Blacklist access token
    if (req.token) {
        await Token.create({
            user: req.user!._id,
            token: req.token,
            type: 'access',
            expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
            blacklisted: true,
        });
    }

    return ApiResponse.success(res, null, 'Logout successful');
});

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Refresh access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken: { type: string }
 *     responses:
 *       200: { description: Token refreshed successfully }
 *       401: { description: Invalid refresh token }
 */
export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    // Find token
    const tokenDoc = await Token.findOne({
        token: refreshToken,
        type: 'refresh',
        blacklisted: false,
    });

    if (!tokenDoc || tokenDoc.expiresAt < new Date()) {
        throw ApiError.unauthorized('Invalid or expired refresh token');
    }

    // Get user
    const user = await User.findById(tokenDoc.user);
    if (!user || !user.isActive) {
        throw ApiError.unauthorized('User not found or inactive');
    }

    // Generate new tokens
    const tokens = generateTokens({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
    });

    // Blacklist old refresh token
    tokenDoc.blacklisted = true;
    await tokenDoc.save();

    // Save new refresh token
    await Token.create({
        user: user._id,
        token: tokens.refreshToken,
        type: 'refresh',
        expiresAt: getTokenExpiration(config.jwt.refreshExpiration),
    });

    return ApiResponse.success(res, { tokens }, 'Token refreshed successfully');
});

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     tags: [Auth]
 *     summary: Request password reset
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string, format: email }
 *     responses:
 *       200: { description: Password reset email sent }
 */
export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = await User.findByEmail(email);

    // Always return success to prevent email enumeration
    if (!user) {
        return ApiResponse.success(res, null, 'If the email exists, a password reset link has been sent');
    }

    // Generate reset token
    const resetToken = generateRandomToken();
    const hashedToken = generateHashedToken(resetToken);

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    // Send email
    const resetUrl = `${config.urls.frontend}/reset-password?token=${resetToken}`;

    try {
        await sendPasswordResetEmail(user.email, {
            firstName: user.firstName,
            resetUrl,
        });
    } catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();
        throw ApiError.internal('Failed to send password reset email');
    }

    return ApiResponse.success(res, null, 'If the email exists, a password reset link has been sent');
});

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     tags: [Auth]
 *     summary: Reset password with token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, password]
 *             properties:
 *               token: { type: string }
 *               password: { type: string, minLength: 8 }
 *     responses:
 *       200: { description: Password reset successful }
 *       400: { description: Invalid or expired token }
 */
export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { token, password } = req.body;

    const hashedToken = generateHashedToken(token);

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
        throw ApiError.badRequest('Invalid or expired reset token');
    }

    // Update password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // Invalidate all existing tokens
    await Token.updateMany(
        { user: user._id },
        { blacklisted: true }
    );

    return ApiResponse.success(res, null, 'Password reset successful');
});

/**
 * @swagger
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get current user
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Current user data }
 */
export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
    return ApiResponse.success(res, {
        user: {
            id: req.user!._id,
            email: req.user!.email,
            firstName: req.user!.firstName,
            lastName: req.user!.lastName,
            phone: req.user!.phone,
            avatar: req.user!.avatar,
            role: req.user!.role,
            isEmailVerified: req.user!.isEmailVerified,
            createdAt: req.user!.createdAt,
        },
    });
});

export default {
    register,
    login,
    logout,
    refreshToken,
    forgotPassword,
    resetPassword,
    getCurrentUser,
};
