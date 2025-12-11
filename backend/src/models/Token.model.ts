import mongoose, { Document, Schema } from 'mongoose';

export type TokenType = 'access' | 'refresh' | 'passwordReset' | 'emailVerification';

export interface ITokenDocument extends Document {
    _id: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    token: string;
    type: TokenType;
    expiresAt: Date;
    blacklisted: boolean;
    createdAt: Date;
}

const tokenSchema = new Schema<ITokenDocument>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        token: {
            type: String,
            required: true,
            index: true,
        },
        type: {
            type: String,
            enum: ['access', 'refresh', 'passwordReset', 'emailVerification'],
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
        blacklisted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
);

// Indexes
tokenSchema.index({ user: 1, type: 1 });
tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index for auto-deletion

export const Token = mongoose.model<ITokenDocument>('Token', tokenSchema);

export default Token;
