import { Brand } from '../../src/models';

export const brandData = [
    { name: 'Apple', slug: 'apple', description: 'Think Different', isFeatured: true },
    { name: 'Samsung', slug: 'samsung', description: 'Do What You Can\'t', isFeatured: true },
    { name: 'Sony', slug: 'sony', description: 'Be Moved', isFeatured: true },
    { name: 'LG', slug: 'lg', description: 'Life\'s Good', isFeatured: true },
    { name: 'Microsoft', slug: 'microsoft', description: 'Empowering us all', isFeatured: true },
    { name: 'Dell', slug: 'dell', description: 'Technologies', isFeatured: true },
    { name: 'HP', slug: 'hp', description: 'Keep Reinventing', isFeatured: true },
    { name: 'Lenovo', slug: 'lenovo', description: 'Smarter Technology for All', isFeatured: false },
    { name: 'ASUS', slug: 'asus', description: 'In Search of Incredible', isFeatured: true },
    { name: 'Acer', slug: 'acer', description: 'Explore Beyond Limits', isFeatured: false },
    { name: 'Google', slug: 'google', description: 'Made by Google', isFeatured: true },
    { name: 'OnePlus', slug: 'oneplus', description: 'Never Settle', isFeatured: false },
    { name: 'Xiaomi', slug: 'xiaomi', description: 'Innovation for Everyone', isFeatured: true },
    { name: 'Huawei', slug: 'huawei', description: 'Make It Possible', isFeatured: false },
    { name: 'Bose', slug: 'bose', description: 'Better Sound Through Research', isFeatured: true },
    { name: 'JBL', slug: 'jbl', description: 'Dare to Listen', isFeatured: true },
    { name: 'Canon', slug: 'canon', description: 'Delighting You Always', isFeatured: true },
    { name: 'Nikon', slug: 'nikon', description: 'At the Heart of the Image', isFeatured: false },
    { name: 'Nintendo', slug: 'nintendo', description: 'It\'s on', isFeatured: true },
    { name: 'Razer', slug: 'razer', description: 'For Gamers. By Gamers.', isFeatured: true },
];

export const seedBrands = async (): Promise<void> => {
    const existingCount = await Brand.countDocuments();
    if (existingCount > 0) {
        console.log(`   ⏭️  ${existingCount} brands already exist, skipping...`);
        return;
    }

    await Brand.insertMany(brandData);
    console.log(`   ✓ Created ${brandData.length} brands`);
};
