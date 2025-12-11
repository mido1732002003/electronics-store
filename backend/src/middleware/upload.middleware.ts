import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { Request } from 'express';
import { ApiError } from '../utils/ApiError';
import { config } from '../config';

// Memory storage for Cloudinary upload
const memoryStorage = multer.memoryStorage();

// File filter for images
const imageFileFilter = (
    _req: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback
): void => {
    if (config.upload.allowedMimeTypes.includes(file.mimetype)) {
        callback(null, true);
    } else {
        callback(
            new ApiError(
                400,
                'Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed.',
                'INVALID_FILE_TYPE'
            )
        );
    }
};

// Single image upload
export const uploadSingleImage = multer({
    storage: memoryStorage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: config.upload.maxFileSize,
    },
}).single('image');

// Multiple images upload
export const uploadMultipleImages = multer({
    storage: memoryStorage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: config.upload.maxFileSize,
        files: config.upload.maxFiles,
    },
}).array('images', config.upload.maxFiles);

// Product images upload with specific field name
export const uploadProductImages = multer({
    storage: memoryStorage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: config.upload.maxFileSize,
        files: config.upload.maxFiles,
    },
}).fields([
    { name: 'images', maxCount: 10 },
    { name: 'thumbnail', maxCount: 1 },
]);

// Avatar upload
export const uploadAvatar = multer({
    storage: memoryStorage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB limit for avatars
    },
}).single('avatar');

// Disk storage for local file uploads (backup/export files)
const diskStorage = multer.diskStorage({
    destination: (_req, _file, callback) => {
        callback(null, path.join(__dirname, '../../uploads'));
    },
    filename: (_req, file, callback) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = path.extname(file.originalname);
        callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
});

export const uploadFile = multer({
    storage: diskStorage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB for general files
    },
}).single('file');

export default {
    uploadSingleImage,
    uploadMultipleImages,
    uploadProductImages,
    uploadAvatar,
    uploadFile,
};
