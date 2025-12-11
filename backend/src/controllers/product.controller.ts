import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Product, Category, Brand } from '../models';
import { ApiResponse, ApiError, asyncHandler, getPagination, getPaginationMeta, slugify, generateUniqueSlug } from '../utils';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary';

/**
 * @swagger
 * /products:
 *   get:
 *     tags: [Products]
 *     summary: Get all products with filters
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: brand
 *         schema: { type: string }
 *       - in: query
 *         name: minPrice
 *         schema: { type: number }
 *       - in: query
 *         name: maxPrice
 *         schema: { type: number }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, enum: [price, rating, newest, popular, name] }
 *       - in: query
 *         name: sortOrder
 *         schema: { type: string, enum: [asc, desc] }
 *     responses:
 *       200: { description: List of products }
 */
export const getProducts = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, skip } = getPagination(req.query);

    const {
        category,
        subcategory,
        brand,
        minPrice,
        maxPrice,
        rating,
        inStock,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        featured,
        newArrivals,
    } = req.query;

    // Build filter
    const filter: Record<string, unknown> = { isActive: true };

    if (category) {
        const cat = await Category.findOne({ slug: category });
        if (cat) filter.category = cat._id;
    }

    if (subcategory) {
        const subcat = await Category.findOne({ slug: subcategory });
        if (subcat) filter.subcategory = subcat._id;
    }

    if (brand) {
        const brandDoc = await Brand.findOne({ slug: brand });
        if (brandDoc) filter.brand = brandDoc._id;
    }

    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) (filter.price as Record<string, number>).$gte = Number(minPrice);
        if (maxPrice) (filter.price as Record<string, number>).$lte = Number(maxPrice);
    }

    if (rating) {
        filter.averageRating = { $gte: Number(rating) };
    }

    if (inStock === 'true') {
        filter.quantity = { $gt: 0 };
    }

    if (featured === 'true') {
        filter.isFeatured = true;
    }

    if (newArrivals === 'true') {
        filter.isNewArrival = true;
    }

    if (search) {
        filter.$text = { $search: search as string };
    }

    // Build sort
    const sortOptions: Record<string, Record<string, 1 | -1>> = {
        price: { price: sortOrder === 'asc' ? 1 : -1 },
        rating: { averageRating: -1 },
        newest: { createdAt: -1 },
        popular: { soldCount: -1 },
        name: { name: sortOrder === 'asc' ? 1 : -1 },
    };

    const sort = sortOptions[sortBy as string] || { createdAt: -1 };

    // Execute query
    const [products, total] = await Promise.all([
        Product.find(filter)
            .populate('category', 'name slug')
            .populate('brand', 'name slug logo')
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean(),
        Product.countDocuments(filter),
    ]);

    const meta = getPaginationMeta(total, page, limit);

    return ApiResponse.paginated(res, products, total, page, limit);
});

/**
 * @swagger
 * /products/{idOrSlug}:
 *   get:
 *     tags: [Products]
 *     summary: Get product by ID or slug
 *     parameters:
 *       - in: path
 *         name: idOrSlug
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Product details }
 *       404: { description: Product not found }
 */
export const getProduct = asyncHandler(async (req: Request, res: Response) => {
    const { idOrSlug } = req.params;

    let product;

    if (mongoose.isValidObjectId(idOrSlug)) {
        product = await Product.findById(idOrSlug)
            .populate('category', 'name slug')
            .populate('subcategory', 'name slug')
            .populate('brand', 'name slug logo');
    } else {
        product = await Product.findOne({ slug: idOrSlug })
            .populate('category', 'name slug')
            .populate('subcategory', 'name slug')
            .populate('brand', 'name slug logo');
    }

    if (!product) {
        throw ApiError.notFound('Product not found');
    }

    // Increment view count
    product.viewCount += 1;
    await product.save();

    return ApiResponse.success(res, product);
});

/**
 * @swagger
 * /products:
 *   post:
 *     tags: [Products]
 *     summary: Create a new product
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProduct'
 *     responses:
 *       201: { description: Product created }
 *       400: { description: Validation error }
 */
export const createProduct = asyncHandler(async (req: Request, res: Response) => {
    const {
        name,
        nameAr,
        description,
        descriptionAr,
        shortDescription,
        shortDescriptionAr,
        sku,
        price,
        compareAtPrice,
        costPrice,
        quantity,
        lowStockThreshold,
        categoryId,
        subcategoryId,
        brandId,
        specifications,
        features,
        featuresAr,
        tags,
        weight,
        dimensions,
        isActive,
        isFeatured,
        isNewArrival,
    } = req.body;

    // Check if SKU exists
    const existingProduct = await Product.findOne({ sku: sku.toUpperCase() });
    if (existingProduct) {
        throw ApiError.conflict('Product with this SKU already exists');
    }

    // Generate unique slug
    const slug = await generateUniqueSlug(name, Product);

    // Verify category exists
    const category = await Category.findById(categoryId);
    if (!category) {
        throw ApiError.badRequest('Category not found');
    }

    const product = await Product.create({
        name,
        nameAr,
        slug,
        description,
        descriptionAr,
        shortDescription,
        shortDescriptionAr,
        sku: sku.toUpperCase(),
        price,
        compareAtPrice,
        costPrice,
        quantity,
        lowStockThreshold,
        category: categoryId,
        subcategory: subcategoryId,
        brand: brandId,
        specifications,
        features,
        featuresAr,
        tags,
        weight,
        dimensions,
        isActive,
        isFeatured,
        isNewArrival,
        images: [],
    });

    // Update category product count
    await Category.findByIdAndUpdate(categoryId, { $inc: { productCount: 1 } });
    if (brandId) {
        await Brand.findByIdAndUpdate(brandId, { $inc: { productCount: 1 } });
    }

    await product.populate(['category', 'brand']);

    return ApiResponse.created(res, product, 'Product created successfully');
});

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     tags: [Products]
 *     summary: Update a product
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Product updated }
 *       404: { description: Product not found }
 */
export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updates = req.body;

    const product = await Product.findById(id);
    if (!product) {
        throw ApiError.notFound('Product not found');
    }

    // Update slug if name changed
    if (updates.name && updates.name !== product.name) {
        updates.slug = await generateUniqueSlug(updates.name, Product, 'slug', id);
    }

    // Handle category change
    if (updates.categoryId && updates.categoryId !== product.category.toString()) {
        await Category.findByIdAndUpdate(product.category, { $inc: { productCount: -1 } });
        await Category.findByIdAndUpdate(updates.categoryId, { $inc: { productCount: 1 } });
        updates.category = updates.categoryId;
        delete updates.categoryId;
    }

    Object.assign(product, updates);
    await product.save();

    await product.populate(['category', 'brand']);

    return ApiResponse.success(res, product, 'Product updated successfully');
});

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     tags: [Products]
 *     summary: Delete a product
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Product deleted }
 *       404: { description: Product not found }
 */
export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
        throw ApiError.notFound('Product not found');
    }

    // Delete images from Cloudinary
    for (const image of product.images) {
        try {
            await deleteFromCloudinary(image.publicId);
        } catch (error) {
            console.error('Failed to delete image:', error);
        }
    }

    // Update counts
    await Category.findByIdAndUpdate(product.category, { $inc: { productCount: -1 } });
    if (product.brand) {
        await Brand.findByIdAndUpdate(product.brand, { $inc: { productCount: -1 } });
    }

    await product.deleteOne();

    return ApiResponse.success(res, null, 'Product deleted successfully');
});

/**
 * @swagger
 * /products/featured:
 *   get:
 *     tags: [Products]
 *     summary: Get featured products
 *     responses:
 *       200: { description: List of featured products }
 */
export const getFeaturedProducts = asyncHandler(async (_req: Request, res: Response) => {
    const products = await Product.find({ isActive: true, isFeatured: true })
        .populate('category', 'name slug')
        .populate('brand', 'name slug logo')
        .sort({ createdAt: -1 })
        .limit(12)
        .lean();

    return ApiResponse.success(res, products);
});

/**
 * @swagger
 * /products/new-arrivals:
 *   get:
 *     tags: [Products]
 *     summary: Get new arrival products
 *     responses:
 *       200: { description: List of new arrival products }
 */
export const getNewArrivals = asyncHandler(async (_req: Request, res: Response) => {
    const products = await Product.find({ isActive: true, isNewArrival: true })
        .populate('category', 'name slug')
        .populate('brand', 'name slug logo')
        .sort({ createdAt: -1 })
        .limit(12)
        .lean();

    return ApiResponse.success(res, products);
});

/**
 * @swagger
 * /products/best-sellers:
 *   get:
 *     tags: [Products]
 *     summary: Get best selling products
 *     responses:
 *       200: { description: List of best selling products }
 */
export const getBestSellers = asyncHandler(async (_req: Request, res: Response) => {
    const products = await Product.find({ isActive: true })
        .populate('category', 'name slug')
        .populate('brand', 'name slug logo')
        .sort({ soldCount: -1 })
        .limit(12)
        .lean();

    return ApiResponse.success(res, products);
});

/**
 * @swagger
 * /products/{id}/related:
 *   get:
 *     tags: [Products]
 *     summary: Get related products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: List of related products }
 */
export const getRelatedProducts = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
        throw ApiError.notFound('Product not found');
    }

    const relatedProducts = await Product.find({
        _id: { $ne: id },
        isActive: true,
        $or: [
            { category: product.category },
            { brand: product.brand },
            { tags: { $in: product.tags } },
        ],
    })
        .populate('category', 'name slug')
        .populate('brand', 'name slug logo')
        .limit(8)
        .lean();

    return ApiResponse.success(res, relatedProducts);
});

export default {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getFeaturedProducts,
    getNewArrivals,
    getBestSellers,
    getRelatedProducts,
};
