import mongoose, { Document, Schema } from 'mongoose';

export interface IAddressDocument extends Document {
    _id: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    label: string;
    firstName: string;
    lastName: string;
    company?: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
    isDefault: boolean;
    isDefaultBilling: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const addressSchema = new Schema<IAddressDocument>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        label: {
            type: String,
            required: [true, 'Address label is required'],
            trim: true,
            maxlength: [50, 'Label cannot exceed 50 characters'],
        },
        firstName: {
            type: String,
            required: [true, 'First name is required'],
            trim: true,
        },
        lastName: {
            type: String,
            required: [true, 'Last name is required'],
            trim: true,
        },
        company: {
            type: String,
            trim: true,
        },
        address1: {
            type: String,
            required: [true, 'Address is required'],
            trim: true,
        },
        address2: {
            type: String,
            trim: true,
        },
        city: {
            type: String,
            required: [true, 'City is required'],
            trim: true,
        },
        state: {
            type: String,
            required: [true, 'State is required'],
            trim: true,
        },
        postalCode: {
            type: String,
            required: [true, 'Postal code is required'],
            trim: true,
        },
        country: {
            type: String,
            required: [true, 'Country is required'],
            trim: true,
            default: 'US',
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            trim: true,
        },
        isDefault: {
            type: Boolean,
            default: false,
        },
        isDefaultBilling: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Indexes
addressSchema.index({ user: 1 });
addressSchema.index({ user: 1, isDefault: 1 });

// Pre-save to handle default address logic
addressSchema.pre('save', async function (next) {
    if (this.isDefault) {
        await Address.updateMany(
            { user: this.user, _id: { $ne: this._id } },
            { isDefault: false }
        );
    }
    if (this.isDefaultBilling) {
        await Address.updateMany(
            { user: this.user, _id: { $ne: this._id } },
            { isDefaultBilling: false }
        );
    }
    next();
});

export const Address = mongoose.model<IAddressDocument>('Address', addressSchema);

export default Address;
