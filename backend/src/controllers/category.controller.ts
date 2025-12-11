import { Request, Response } from 'express';
import { Category } from '../models';
import { ApiResponse, ApiError, asyncHandler, slugify, generateUniqueSlug } from '../utils';

/**
 * @swagger
 * /categories:
 *   get:
 *     tags: [Categories]
 *     summary: Get all categories
 *     responses:
 *       200: { description: List of categories }
 */
export const getCategories = asyncHandler(async (_req: Request, res: Response) => {
    const categories = await Category.find({ isActive: true, parent: null })
        .populate({
            path: 'subcategories',
            match: { isActive: true },
            options: { sort: { order: 1 } },
        })
        .sort({ order: 1 })
        .lean();

    return ApiResponse.success(res, categories);
});

/**
 * @swagger
 * /categories/{idOrSlug}:
 *   get:
 *     tags: [Categories]
 *     summary: Get category by ID or slug
 *     responses:
 *       200: { description: Category details }
 *       404: { description: Category not found }
 */
export const getCategory = asyncHandler(async (req: Request, res: Response) => {
    const { idOrSlug } = req.params;

    let category;
    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
        category = await Category.findById(idOrSlug).populate('subcategories');
    } else {
        category = await Category.findOne({ slug: idOrSlug }).populate('subcategories');
    }

    if (!category) {
        throw ApiError.notFound('Category not found');
    }

    return ApiResponse.success(res, category);
});

/**
 * @swagger
 * /categories:
 *   post:
 *     tags: [Categories]
 *     summary: Create a new category (Admin)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Category created }
 */
export const createCategory = asyncHandler(async (req: Request, res: Response) => {
    const { name, nameAr, description, descriptionAr, image, icon, parentId, order } = req.body;

    const slug = await generateUniqueSlug(name, Category);

    const categoryData: Record<string, unknown> = {
        name,
        nameAr,
        slug,
        description,
        descriptionAr,
        image,
        icon,
        order: order || 0,
    };

    if (parentId) {
        const parentCategory = await Category.findById(parentId);
        if (!parentCategory) {
            throw ApiError.badRequest('Parent category not found');
        }
        categoryData.parent = parentId;
    }

    const category = await Category.create(categoryData);

    return ApiResponse.created(res, category, 'Category created successfully');
});

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     tags: [Categories]
 *     summary: Update a category (Admin)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Category updated }
 */
export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updates = req.body;

    const category = await Category.findById(id);
    if (!category) {
        throw ApiError.notFound('Category not found');
    }

    if (updates.name && updates.name !== category.name) {
        updates.slug = await generateUniqueSlug(updates.name, Category, 'slug', id);
    }

    Object.assign(category, updates);
    await category.save();

    return ApiResponse.success(res, category, 'Category updated successfully');
});

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     tags: [Categories]
 *     summary: Delete a category (Admin)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Category deleted }
 */
export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
        throw ApiError.notFound('Category not found');
    }

    // Check for subcategories
    const subcategoryCount = await Category.countDocuments({ parent: id });
    if (subcategoryCount > 0) {
        throw ApiError.badRequest('Cannot delete category with subcategories');
    }

    // Check for products
    if (category.productCount > 0) {
        throw ApiError.badRequest('Cannot delete category with products');
    }

    await category.deleteOne();

    return ApiResponse.success(res, null, 'Category deleted successfully');
});

/**
 * @swagger
 * /categories/tree:
 *   get:
 *     tags: [Categories]
 *     summary: Get category tree structure
 *     responses:
 *       200: { description: Category tree }
 */
export const getCategoryTree = asyncHandler(async (_req: Request, res: Response) => {
    const categories = await Category.find({ isActive: true })
        .sort({ order: 1 })
        .lean();

    // Build tree
    const categoryMap = new Map();
    const tree: unknown[] = [];

    categories.forEach(cat => {
        categoryMap.set(cat._id.toString(), { ...cat, children: [] });
    });

    categories.forEach(cat => {
        if (cat.parent) {
            const parent = categoryMap.get(cat.parent.toString());
            if (parent) {
                parent.children.push(categoryMap.get(cat._id.toString()));
            }
        } else {
            tree.push(categoryMap.get(cat._id.toString()));
        }
    });

    return ApiResponse.success(res, tree);
});

export default {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryTree,
};
