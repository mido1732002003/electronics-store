import { Request, Response } from 'express';
import { User, Address, Wishlist, Order } from '../models';
import { ApiResponse, ApiError, asyncHandler } from '../utils';
import { uploadBase64ToCloudinary, deleteFromCloudinary } from '../config/cloudinary';

/**
 * @swagger
 * /users/profile:
 *   get:
 *     tags: [Users]
 *     summary: Get user profile
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: User profile }
 */
export const getProfile = asyncHandler(async (req: Request, res: Response) => {
    const user = await User.findById(req.user!._id);

    if (!user) {
        throw ApiError.notFound('User not found');
    }

    return ApiResponse.success(res, {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
    });
});

/**
 * @swagger
 * /users/profile:
 *   put:
 *     tags: [Users]
 *     summary: Update user profile
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Profile updated }
 */
export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const { firstName, lastName, phone } = req.body;

    const user = await User.findById(req.user!._id);
    if (!user) {
        throw ApiError.notFound('User not found');
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone !== undefined) user.phone = phone;

    await user.save();

    return ApiResponse.success(res, {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        avatar: user.avatar,
    }, 'Profile updated successfully');
});

/**
 * @swagger
 * /users/avatar:
 *   post:
 *     tags: [Users]
 *     summary: Upload avatar
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Avatar uploaded }
 */
export const uploadAvatar = asyncHandler(async (req: Request, res: Response) => {
    const { avatar } = req.body; // Base64 string

    if (!avatar) {
        throw ApiError.badRequest('Avatar image is required');
    }

    const user = await User.findById(req.user!._id);
    if (!user) {
        throw ApiError.notFound('User not found');
    }

    // Delete old avatar if exists
    if (user.avatar) {
        const publicId = user.avatar.split('/').pop()?.split('.')[0];
        if (publicId) {
            try {
                await deleteFromCloudinary(`electronics-store/avatars/${publicId}`);
            } catch (error) {
                console.error('Failed to delete old avatar:', error);
            }
        }
    }

    // Upload new avatar
    const result = await uploadBase64ToCloudinary(avatar, 'avatars');
    user.avatar = result.secureUrl;
    await user.save();

    return ApiResponse.success(res, { avatar: user.avatar }, 'Avatar uploaded successfully');
});

/**
 * @swagger
 * /users/change-password:
 *   post:
 *     tags: [Users]
 *     summary: Change password
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Password changed }
 */
export const changePassword = asyncHandler(async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user!._id).select('+password');
    if (!user) {
        throw ApiError.notFound('User not found');
    }

    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
        throw ApiError.unauthorized('Current password is incorrect');
    }

    user.password = newPassword;
    await user.save();

    return ApiResponse.success(res, null, 'Password changed successfully');
});

// Address Management
/**
 * @swagger
 * /users/addresses:
 *   get:
 *     tags: [Users]
 *     summary: Get user addresses
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: List of addresses }
 */
export const getAddresses = asyncHandler(async (req: Request, res: Response) => {
    const addresses = await Address.find({ user: req.user!._id }).sort({ isDefault: -1, createdAt: -1 });
    return ApiResponse.success(res, addresses);
});

/**
 * @swagger
 * /users/addresses:
 *   post:
 *     tags: [Users]
 *     summary: Add new address
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Address added }
 */
export const addAddress = asyncHandler(async (req: Request, res: Response) => {
    const addressData = { ...req.body, user: req.user!._id };

    // Check if this is the first address
    const count = await Address.countDocuments({ user: req.user!._id });
    if (count === 0) {
        addressData.isDefault = true;
    }

    const address = await Address.create(addressData);
    return ApiResponse.created(res, address, 'Address added successfully');
});

/**
 * @swagger
 * /users/addresses/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Update address
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Address updated }
 */
export const updateAddress = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const address = await Address.findOne({ _id: id, user: req.user!._id });
    if (!address) {
        throw ApiError.notFound('Address not found');
    }

    Object.assign(address, req.body);
    await address.save();

    return ApiResponse.success(res, address, 'Address updated successfully');
});

/**
 * @swagger
 * /users/addresses/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete address
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Address deleted }
 */
export const deleteAddress = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const address = await Address.findOneAndDelete({ _id: id, user: req.user!._id });
    if (!address) {
        throw ApiError.notFound('Address not found');
    }

    // If deleted address was default, make another one default
    if (address.isDefault) {
        const firstAddress = await Address.findOne({ user: req.user!._id });
        if (firstAddress) {
            firstAddress.isDefault = true;
            await firstAddress.save();
        }
    }

    return ApiResponse.success(res, null, 'Address deleted successfully');
});

// Wishlist Management
/**
 * @swagger
 * /users/wishlist:
 *   get:
 *     tags: [Wishlist]
 *     summary: Get user's wishlist
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Wishlist items }
 */
export const getWishlist = asyncHandler(async (req: Request, res: Response) => {
    let wishlist = await Wishlist.findOne({ user: req.user!._id })
        .populate('products', 'name slug price compareAtPrice images averageRating reviewCount');

    if (!wishlist) {
        wishlist = await Wishlist.create({ user: req.user!._id, products: [] });
    }

    return ApiResponse.success(res, wishlist.products);
});

/**
 * @swagger
 * /users/wishlist/{productId}:
 *   post:
 *     tags: [Wishlist]
 *     summary: Add product to wishlist
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Product added to wishlist }
 */
export const addToWishlist = asyncHandler(async (req: Request, res: Response) => {
    const { productId } = req.params;

    let wishlist = await Wishlist.findOne({ user: req.user!._id });
    if (!wishlist) {
        wishlist = await Wishlist.create({ user: req.user!._id, products: [] });
    }

    if (wishlist.products.includes(productId as unknown as never)) {
        throw ApiError.conflict('Product already in wishlist');
    }

    wishlist.products.push(productId as unknown as never);
    await wishlist.save();

    return ApiResponse.success(res, { added: true }, 'Product added to wishlist');
});

/**
 * @swagger
 * /users/wishlist/{productId}:
 *   delete:
 *     tags: [Wishlist]
 *     summary: Remove product from wishlist
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Product removed from wishlist }
 */
export const removeFromWishlist = asyncHandler(async (req: Request, res: Response) => {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: req.user!._id });
    if (!wishlist) {
        throw ApiError.notFound('Wishlist not found');
    }

    wishlist.products = wishlist.products.filter(id => id.toString() !== productId);
    await wishlist.save();

    return ApiResponse.success(res, { removed: true }, 'Product removed from wishlist');
});

/**
 * @swagger
 * /users/dashboard:
 *   get:
 *     tags: [Users]
 *     summary: Get user dashboard data
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Dashboard data }
 */
export const getDashboard = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id;

    const [orderCount, wishlistCount, recentOrders] = await Promise.all([
        Order.countDocuments({ user: userId }),
        Wishlist.findOne({ user: userId }).then(w => w?.products.length || 0),
        Order.find({ user: userId })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('orderNumber total status createdAt')
            .lean(),
    ]);

    return ApiResponse.success(res, {
        stats: {
            totalOrders: orderCount,
            wishlistItems: wishlistCount,
        },
        recentOrders,
    });
});

export default {
    getProfile,
    updateProfile,
    uploadAvatar,
    changePassword,
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    getDashboard,
};
