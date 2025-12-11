import mongoose, { Document, Schema } from 'mongoose';

export interface ICategoryDocument extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    nameAr: string;
    slug: string;
    description?: string;
    descriptionAr?: string;
    image?: string;
    icon?: string;
    parent?: mongoose.Types.ObjectId;
    ancestors: mongoose.Types.ObjectId[];
    isActive: boolean;
    order: number;
    productCount: number;
    createdAt: Date;
    updatedAt: Date;
}

const categorySchema = new Schema<ICategoryDocument>(
    {
        name: {
            type: String,
            required: [true, 'Category name is required'],
            trim: true,
            maxlength: [100, 'Category name cannot exceed 100 characters'],
        },
        nameAr: {
            type: String,
            required: [true, 'Arabic category name is required'],
            trim: true,
            maxlength: [100, 'Arabic category name cannot exceed 100 characters'],
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
            maxlength: [500, 'Description cannot exceed 500 characters'],
        },
        descriptionAr: {
            type: String,
            maxlength: [500, 'Arabic description cannot exceed 500 characters'],
        },
        image: String,
        icon: String,
        parent: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            default: null,
        },
        ancestors: [{
            type: Schema.Types.ObjectId,
            ref: 'Category',
        }],
        isActive: {
            type: Boolean,
            default: true,
        },
        order: {
            type: Number,
            default: 0,
        },
        productCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Virtual for subcategories
categorySchema.virtual('subcategories', {
    ref: 'Category',
    localField: '_id',
    foreignField: 'parent',
});

// Indexes
categorySchema.index({ slug: 1 });
categorySchema.index({ parent: 1 });
categorySchema.index({ isActive: 1 });
categorySchema.index({ order: 1 });

// Pre-save to update ancestors
categorySchema.pre('save', async function (next) {
    if (this.isModified('parent') && this.parent) {
        const parentCategory = await Category.findById(this.parent);
        if (parentCategory) {
            this.ancestors = [...parentCategory.ancestors, parentCategory._id];
        }
    } else if (!this.parent) {
        this.ancestors = [];
    }
    next();
});

export const Category = mongoose.model<ICategoryDocument>('Category', categorySchema);

export default Category;
