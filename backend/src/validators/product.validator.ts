import { z } from 'zod';

export const createProductSchema = z.object({
    name: z.string().min(1, 'Name is required').max(200),
    nameAr: z.string().min(1, 'Arabic name is required').max(200),
    description: z.string().min(1, 'Description is required').max(5000),
    descriptionAr: z.string().min(1, 'Arabic description is required').max(5000),
    shortDescription: z.string().min(1, 'Short description is required').max(500),
    shortDescriptionAr: z.string().min(1, 'Arabic short description is required').max(500),
    sku: z.string().min(1, 'SKU is required').max(50),
    price: z.number().min(0, 'Price must be positive'),
    compareAtPrice: z.number().min(0).optional(),
    costPrice: z.number().min(0).optional(),
    quantity: z.number().int().min(0, 'Quantity must be non-negative'),
    lowStockThreshold: z.number().int().min(0).default(10),
    categoryId: z.string().min(1, 'Category is required'),
    subcategoryId: z.string().optional(),
    brandId: z.string().optional(),
    specifications: z.array(z.object({
        name: z.string(),
        value: z.string(),
        group: z.string().optional(),
    })).optional(),
    features: z.array(z.string()).optional(),
    featuresAr: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    weight: z.number().min(0).optional(),
    dimensions: z.object({
        length: z.number().min(0),
        width: z.number().min(0),
        height: z.number().min(0),
        unit: z.enum(['cm', 'in']),
    }).optional(),
    isActive: z.boolean().default(true),
    isFeatured: z.boolean().default(false),
    isNewArrival: z.boolean().default(true),
});

export const updateProductSchema = createProductSchema.partial();

export const productQuerySchema = z.object({
    page: z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
    limit: z.string().optional().transform(val => val ? parseInt(val, 10) : 10),
    category: z.string().optional(),
    subcategory: z.string().optional(),
    brand: z.string().optional(),
    minPrice: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
    maxPrice: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
    rating: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
    inStock: z.string().optional().transform(val => val === 'true'),
    search: z.string().optional(),
    sortBy: z.enum(['price', 'rating', 'newest', 'popular', 'name']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    featured: z.string().optional().transform(val => val === 'true'),
    newArrivals: z.string().optional().transform(val => val === 'true'),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;
