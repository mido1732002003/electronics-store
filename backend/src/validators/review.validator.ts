import { z } from 'zod';

export const createReviewSchema = z.object({
    rating: z.number().int().min(1).max(5),
    title: z.string().min(1, 'Title is required').max(100),
    comment: z.string().min(10, 'Comment must be at least 10 characters').max(2000),
});

export const updateReviewSchema = z.object({
    rating: z.number().int().min(1).max(5).optional(),
    title: z.string().min(1).max(100).optional(),
    comment: z.string().min(10).max(2000).optional(),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
