import { v2 as cloudinary } from 'cloudinary';
import { config } from './index';

cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
    secure: true,
});

export interface UploadResult {
    publicId: string;
    url: string;
    secureUrl: string;
    width: number;
    height: number;
    format: string;
    bytes: number;
}

export const uploadToCloudinary = async (
    filePath: string,
    folder: string = 'products',
    options: Record<string, unknown> = {}
): Promise<UploadResult> => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: `electronics-store/${folder}`,
            resource_type: 'auto',
            transformation: [
                { width: 1200, height: 1200, crop: 'limit' },
                { quality: 'auto:good' },
                { format: 'auto' },
            ],
            ...options,
        });

        return {
            publicId: result.public_id,
            url: result.url,
            secureUrl: result.secure_url,
            width: result.width,
            height: result.height,
            format: result.format,
            bytes: result.bytes,
        };
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw error;
    }
};

export const uploadBase64ToCloudinary = async (
    base64String: string,
    folder: string = 'products'
): Promise<UploadResult> => {
    try {
        const result = await cloudinary.uploader.upload(base64String, {
            folder: `electronics-store/${folder}`,
            resource_type: 'auto',
            transformation: [
                { width: 1200, height: 1200, crop: 'limit' },
                { quality: 'auto:good' },
                { format: 'auto' },
            ],
        });

        return {
            publicId: result.public_id,
            url: result.url,
            secureUrl: result.secure_url,
            width: result.width,
            height: result.height,
            format: result.format,
            bytes: result.bytes,
        };
    } catch (error) {
        console.error('Cloudinary base64 upload error:', error);
        throw error;
    }
};

export const deleteFromCloudinary = async (publicId: string): Promise<boolean> => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result.result === 'ok';
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        throw error;
    }
};

export const getOptimizedUrl = (publicId: string, options: Record<string, unknown> = {}): string => {
    return cloudinary.url(publicId, {
        fetch_format: 'auto',
        quality: 'auto',
        ...options,
    });
};

export const getThumbnailUrl = (publicId: string, width: number = 300): string => {
    return cloudinary.url(publicId, {
        width,
        height: width,
        crop: 'fill',
        fetch_format: 'auto',
        quality: 'auto:low',
    });
};

export default cloudinary;
