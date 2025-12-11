import { Category } from '../../src/models';

export const categoryData = [
    {
        name: 'Smartphones',
        nameAr: 'الهواتف الذكية',
        slug: 'smartphones',
        description: 'Latest smartphones from top brands',
        descriptionAr: 'أحدث الهواتف الذكية من أفضل العلامات التجارية',
        icon: '📱',
        order: 1,
    },
    {
        name: 'Laptops',
        nameAr: 'أجهزة اللابتوب',
        slug: 'laptops',
        description: 'Powerful laptops for work and gaming',
        descriptionAr: 'أجهزة لابتوب قوية للعمل والألعاب',
        icon: '💻',
        order: 2,
    },
    {
        name: 'Tablets',
        nameAr: 'الأجهزة اللوحية',
        slug: 'tablets',
        description: 'Versatile tablets for productivity and entertainment',
        descriptionAr: 'أجهزة لوحية متعددة الاستخدامات للإنتاجية والترفيه',
        icon: '📲',
        order: 3,
    },
    {
        name: 'TVs & Displays',
        nameAr: 'التلفزيونات والشاشات',
        slug: 'tvs-displays',
        description: 'Smart TVs and monitors for immersive viewing',
        descriptionAr: 'تلفزيونات ذكية وشاشات للمشاهدة الغامرة',
        icon: '📺',
        order: 4,
    },
    {
        name: 'Audio',
        nameAr: 'الصوتيات',
        slug: 'audio',
        description: 'Headphones, speakers, and audio equipment',
        descriptionAr: 'سماعات ومكبرات صوت ومعدات صوتية',
        icon: '🎧',
        order: 5,
    },
    {
        name: 'Gaming',
        nameAr: 'الألعاب',
        slug: 'gaming',
        description: 'Gaming consoles, accessories, and gaming PCs',
        descriptionAr: 'أجهزة الألعاب والملحقات وأجهزة الكمبيوتر للألعاب',
        icon: '🎮',
        order: 6,
    },
    {
        name: 'Cameras',
        nameAr: 'الكاميرات',
        slug: 'cameras',
        description: 'Digital cameras and photography equipment',
        descriptionAr: 'الكاميرات الرقمية ومعدات التصوير',
        icon: '📷',
        order: 7,
    },
    {
        name: 'Wearables',
        nameAr: 'الأجهزة القابلة للارتداء',
        slug: 'wearables',
        description: 'Smartwatches, fitness trackers, and more',
        descriptionAr: 'ساعات ذكية وأجهزة تتبع اللياقة والمزيد',
        icon: '⌚',
        order: 8,
    },
    {
        name: 'Accessories',
        nameAr: 'الإكسسوارات',
        slug: 'accessories',
        description: 'Phone cases, chargers, cables, and more',
        descriptionAr: 'أغطية الهواتف والشواحن والكابلات والمزيد',
        icon: '🔌',
        order: 9,
    },
    {
        name: 'Smart Home',
        nameAr: 'المنزل الذكي',
        slug: 'smart-home',
        description: 'Smart home devices and automation',
        descriptionAr: 'أجهزة المنزل الذكي والأتمتة',
        icon: '🏠',
        order: 10,
    },
];

export const seedCategories = async (): Promise<void> => {
    const existingCount = await Category.countDocuments();
    if (existingCount > 0) {
        console.log(`   ⏭️  ${existingCount} categories already exist, skipping...`);
        return;
    }

    await Category.insertMany(categoryData);
    console.log(`   ✓ Created ${categoryData.length} categories`);
};
