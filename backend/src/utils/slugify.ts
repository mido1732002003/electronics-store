export const slugify = (text: string): string => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
};

export const generateUniqueSlug = async <T>(
    baseSlug: string,
    model: { findOne: (query: object) => Promise<T | null> },
    field: string = 'slug',
    excludeId?: string
): Promise<string> => {
    let slug = slugify(baseSlug);
    let counter = 0;
    let candidateSlug = slug;

    while (true) {
        const query: Record<string, unknown> = { [field]: candidateSlug };
        if (excludeId) {
            query._id = { $ne: excludeId };
        }

        const existing = await model.findOne(query);
        if (!existing) {
            return candidateSlug;
        }

        counter++;
        candidateSlug = `${slug}-${counter}`;
    }
};

export default { slugify, generateUniqueSlug };
