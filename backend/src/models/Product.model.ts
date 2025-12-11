import mongoose, { Document, Schema } from 'mongoose';
import { ProductStatus } from '../enums';

export interface IProductImage {
    url: string;
    publicId: string;
    alt: string;
    isPrimary: boolean;
    order: number;
}

export interface IProductSpecification {
    name: string;
    value: string;
    group?: string;
}

export interface IProductDimensions {
    length: number;
    width: number;
    height: number;
    unit: 'cm' | 'in';
}

export interface IProductDocument extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    nameAr: string;
    slug: string;
    description: string;
    descriptionAr: string;
    shortDescription: string;
    shortDescriptionAr: string;
    sku: string;
    barcode?: string;
    price: number;
    compareAtPrice?: number;
    costPrice?: number;
    quantity: number;
    lowStockThreshold: number;
    images: IProductImage[];
    category: mongoose.Types.ObjectId;
    subcategory?: mongoose.Types.ObjectId;
    brand?: mongoose.Types.ObjectId;
    specifications: IProductSpecification[];
    features: string[];
    featuresAr: string[];
    tags: string[];
    weight?: number;
    dimensions?: IProductDimensions;
    status: ProductStatus;
    isActive: boolean;
    isFeatured: boolean;
    isNewArrival: boolean;
    isBestSeller: boolean;
    averageRating: number;
    reviewCount: number;
    soldCount: number;
    viewCount: number;
    metaTitle?: string;
    metaDescription?: string;
    createdAt: Date;
    updatedAt: Date;
    discountPercentage: number;
    isInStock: boolean;
    primaryImage: string | null;
}

const productImageSchema = new Schema<IProductImage>(
    {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
        alt: { type: String, default: '' },
        isPrimary: { type: Boolean, default: false },
        order: { type: Number, default: 0 },
    },
    { _id: false }
);

const productSpecificationSchema = new Schema<IProductSpecification>(
    {
        name: { type: String, required: true },
        value: { type: String, required: true },
        group: String,
    },
    { _id: false }
);

const productDimensionsSchema = new Schema<IProductDimensions>(
    {
        length: { type: Number, required: true },
        width: { type: Number, required: true },
        height: { type: Number, required: true },
        unit: { type: String, enum: ['cm', 'in'], default: 'cm' },
    },
    { _id: false }
);

const productSchema = new Schema<IProductDocument>(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
            maxlength: [200, 'Product name cannot exceed 200 characters'],
        },
        nameAr: {
            type: String,
            required: [true, 'Arabic product name is required'],
            trim: true,
            maxlength: [200, 'Arabic product name cannot exceed 200 characters'],
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Product description is required'],
            maxlength: [5000, 'Description cannot exceed 5000 characters'],
        },
        descriptionAr: {
            type: String,
            required: [true, 'Arabic product description is required'],
            maxlength: [5000, 'Arabic description cannot exceed 5000 characters'],
        },
        shortDescription: {
            type: String,
            required: [true, 'Short description is required'],
            maxlength: [500, 'Short description cannot exceed 500 characters'],
        },
        shortDescriptionAr: {
            type: String,
            required: [true, 'Arabic short description is required'],
            maxlength: [500, 'Arabic short description cannot exceed 500 characters'],
        },
        sku: {
            type: String,
            required: [true, 'SKU is required'],
            unique: true,
            uppercase: true,
            trim: true,
        },
        barcode: String,
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price cannot be negative'],
        },
        compareAtPrice: {
            type: Number,
            min: [0, 'Compare at price cannot be negative'],
        },
        costPrice: {
            type: Number,
            min: [0, 'Cost price cannot be negative'],
        },
        quantity: {
            type: Number,
            required: true,
            min: [0, 'Quantity cannot be negative'],
            default: 0,
        },
        lowStockThreshold: {
            type: Number,
            default: 10,
            min: [0, 'Low stock threshold cannot be negative'],
        },
        images: [productImageSchema],
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'Category is required'],
        },
        subcategory: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
        },
        brand: {
            type: Schema.Types.ObjectId,
            ref: 'Brand',
        },
        specifications: [productSpecificationSchema],
        features: [String],
        featuresAr: [String],
        tags: [String],
        weight: Number,
        dimensions: productDimensionsSchema,
        status: {
            type: String,
            enum: Object.values(ProductStatus),
            default: ProductStatus.ACTIVE,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        isNewArrival: {
            type: Boolean,
            default: true,
        },
        isBestSeller: {
            type: Boolean,
            default: false,
        },
        averageRating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        reviewCount: {
            type: Number,
            default: 0,
        },
        soldCount: {
            type: Number,
            default: 0,
        },
        viewCount: {
            type: Number,
            default: 0,
        },
        metaTitle: String,
        metaDescription: String,
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function () {
    if (this.compareAtPrice && this.compareAtPrice > this.price) {
        return Math.round(((this.compareAtPrice - this.price) / this.compareAtPrice) * 100);
    }
    return 0;
});

// Virtual for in-stock status
productSchema.virtual('isInStock').get(function () {
    return this.quantity > 0;
});

// Virtual for primary image
productSchema.virtual('primaryImage').get(function () {
    const primary = this.images.find((img) => img.isPrimary);
    return primary?.url || this.images[0]?.url || null;
});

// Indexes
productSchema.index({ slug: 1 });
productSchema.index({ sku: 1 });
productSchema.index({ category: 1 });
productSchema.index({ subcategory: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ price: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ averageRating: -1 });
productSchema.index({ soldCount: -1 });
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

export const Product = mongoose.model<IProductDocument>('Product', productSchema);

export default Product;
