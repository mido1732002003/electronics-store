import mongoose, { Document, Schema } from 'mongoose';

export type NotificationType =
    | 'order_placed'
    | 'order_shipped'
    | 'order_delivered'
    | 'order_cancelled'
    | 'payment_received'
    | 'payment_failed'
    | 'review_approved'
    | 'price_drop'
    | 'back_in_stock'
    | 'promotional'
    | 'system';

export interface INotificationDocument extends Document {
    _id: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    type: NotificationType;
    title: string;
    message: string;
    data?: Record<string, unknown>;
    isRead: boolean;
    readAt?: Date;
    createdAt: Date;
}

const notificationSchema = new Schema<INotificationDocument>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String,
            enum: [
                'order_placed',
                'order_shipped',
                'order_delivered',
                'order_cancelled',
                'payment_received',
                'payment_failed',
                'review_approved',
                'price_drop',
                'back_in_stock',
                'promotional',
                'system',
            ],
            required: true,
        },
        title: {
            type: String,
            required: true,
            maxlength: [100, 'Title cannot exceed 100 characters'],
        },
        message: {
            type: String,
            required: true,
            maxlength: [500, 'Message cannot exceed 500 characters'],
        },
        data: {
            type: Schema.Types.Mixed,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        readAt: Date,
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
);

// Indexes
notificationSchema.index({ user: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 }); // 90 days TTL

export const Notification = mongoose.model<INotificationDocument>('Notification', notificationSchema);

export default Notification;
