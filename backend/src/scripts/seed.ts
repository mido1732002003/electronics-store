import mongoose from 'mongoose';
import 'dotenv/config';
import { Category, Product, Brand } from '../models';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:adminpassword@localhost:27017/electronics_store?authSource=admin';

async function seedDatabase() {
    console.log('🌱 Starting database seeding...\n');

    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await Promise.all([
            Category.deleteMany({}),
            Brand.deleteMany({}),
            Product.deleteMany({}),
        ]);
        console.log('✅ Cleared existing data\n');

        // Seed Categories
        console.log('📁 Seeding categories...');
        const categoriesData = [
            { name: 'Smartphones', nameAr: 'الهواتف الذكية', slug: 'smartphones', icon: '📱', description: 'Latest smartphones and mobile devices', descriptionAr: 'أحدث الهواتف الذكية والأجهزة المحمولة', order: 1 },
            { name: 'Laptops', nameAr: 'أجهزة الكمبيوتر المحمولة', slug: 'laptops', icon: '💻', description: 'Powerful laptops for work and gaming', descriptionAr: 'أجهزة كمبيوتر محمولة قوية للعمل والألعاب', order: 2 },
            { name: 'Audio', nameAr: 'الصوتيات', slug: 'audio', icon: '🎧', description: 'Headphones, speakers, and audio equipment', descriptionAr: 'سماعات ومكبرات صوت ومعدات صوتية', order: 3 },
            { name: 'Gaming', nameAr: 'الألعاب', slug: 'gaming', icon: '🎮', description: 'Gaming consoles, accessories, and peripherals', descriptionAr: 'أجهزة ألعاب وإكسسوارات وملحقات', order: 4 },
            { name: 'Wearables', nameAr: 'الأجهزة القابلة للارتداء', slug: 'wearables', icon: '⌚', description: 'Smartwatches and fitness trackers', descriptionAr: 'ساعات ذكية وأجهزة تتبع اللياقة', order: 5 },
            { name: 'Cameras', nameAr: 'الكاميرات', slug: 'cameras', icon: '📷', description: 'Digital cameras and photography equipment', descriptionAr: 'كاميرات رقمية ومعدات تصوير', order: 6 },
        ];

        const categories: Record<string, mongoose.Types.ObjectId> = {};
        for (const cat of categoriesData) {
            const created = await Category.create(cat);
            categories[cat.slug] = created._id;
            console.log(`  ✅ Created category: ${cat.name}`);
        }
        console.log(`\n✅ Created ${Object.keys(categories).length} categories\n`);

        // Seed Brands
        console.log('🏷️  Seeding brands...');
        const brandsData = [
            { name: 'Apple', slug: 'apple', logo: 'https://placehold.co/100x100/f5f5f5/333?text=Apple' },
            { name: 'Samsung', slug: 'samsung', logo: 'https://placehold.co/100x100/1428a0/fff?text=Samsung' },
            { name: 'Sony', slug: 'sony', logo: 'https://placehold.co/100x100/0a0a0a/fff?text=Sony' },
            { name: 'Microsoft', slug: 'microsoft', logo: 'https://placehold.co/100x100/00a4ef/fff?text=Microsoft' },
            { name: 'Dell', slug: 'dell', logo: 'https://placehold.co/100x100/007db8/fff?text=Dell' },
            { name: 'Canon', slug: 'canon', logo: 'https://placehold.co/100x100/c00/fff?text=Canon' },
            { name: 'Bose', slug: 'bose', logo: 'https://placehold.co/100x100/0a0a0a/fff?text=Bose' },
            { name: 'Nintendo', slug: 'nintendo', logo: 'https://placehold.co/100x100/e60012/fff?text=Nintendo' },
        ];

        const brands: Record<string, mongoose.Types.ObjectId> = {};
        for (const brand of brandsData) {
            const created = await Brand.create(brand);
            brands[brand.slug] = created._id;
            console.log(`  ✅ Created brand: ${brand.name}`);
        }
        console.log(`\n✅ Created ${Object.keys(brands).length} brands\n`);

        // Seed Products
        console.log('📦 Seeding products...');
        const productsData = [
            // Smartphones
            {
                name: 'iPhone 15 Pro Max',
                nameAr: 'آيفون 15 برو ماكس',
                slug: 'iphone-15-pro-max',
                description: 'The most powerful iPhone ever with A17 Pro chip, titanium design, and advanced camera system.',
                descriptionAr: 'أقوى آيفون على الإطلاق مع شريحة A17 Pro وتصميم من التيتانيوم ونظام كاميرا متقدم.',
                shortDescription: 'Titanium design, A17 Pro chip, 48MP camera system',
                shortDescriptionAr: 'تصميم تيتانيوم، شريحة A17 Pro، نظام كاميرا 48 ميجابكسل',
                sku: 'AAPL-IP15PM-256',
                price: 1199.99,
                compareAtPrice: 1299.99,
                quantity: 50,
                category: categories['smartphones'],
                brand: brands['apple'],
                images: [{ url: 'https://placehold.co/400x400/1a1a24/f97316?text=iPhone+15+Pro', publicId: 'iphone15pro', alt: 'iPhone 15 Pro Max', isPrimary: true, order: 0 }],
                isFeatured: true,
                isNewArrival: true,
                averageRating: 4.8,
                reviewCount: 245,
                tags: ['iphone', 'apple', 'smartphone', 'premium'],
            },
            {
                name: 'Samsung Galaxy S24 Ultra',
                nameAr: 'سامسونج جالاكسي S24 الترا',
                slug: 'samsung-galaxy-s24-ultra',
                description: 'The ultimate Galaxy experience with Galaxy AI, S Pen, and 200MP camera.',
                descriptionAr: 'تجربة Galaxy المطلقة مع Galaxy AI وقلم S Pen وكاميرا 200 ميجابكسل.',
                shortDescription: 'Galaxy AI, S Pen included, 200MP camera',
                shortDescriptionAr: 'Galaxy AI، قلم S Pen متضمن، كاميرا 200 ميجابكسل',
                sku: 'SMSG-GS24U-256',
                price: 1299.99,
                compareAtPrice: 1399.99,
                quantity: 35,
                category: categories['smartphones'],
                brand: brands['samsung'],
                images: [{ url: 'https://placehold.co/400x400/1a1a24/a855f7?text=Galaxy+S24', publicId: 'galaxys24', alt: 'Samsung Galaxy S24 Ultra', isPrimary: true, order: 0 }],
                isFeatured: true,
                averageRating: 4.7,
                reviewCount: 189,
                tags: ['samsung', 'galaxy', 'android', 'smartphone'],
            },
            // Laptops
            {
                name: 'MacBook Pro 16" M3 Max',
                nameAr: 'ماك بوك برو 16 بوصة M3 ماكس',
                slug: 'macbook-pro-16-m3-max',
                description: 'The most powerful MacBook Pro ever. With M3 Max chip for unprecedented performance.',
                descriptionAr: 'أقوى ماك بوك برو على الإطلاق. مع شريحة M3 Max للأداء غير المسبوق.',
                shortDescription: 'M3 Max chip, 36GB RAM, 18-hour battery',
                shortDescriptionAr: 'شريحة M3 Max، 36 جيجابايت رام، بطارية 18 ساعة',
                sku: 'AAPL-MBP16-M3MAX',
                price: 3499.99,
                quantity: 20,
                category: categories['laptops'],
                brand: brands['apple'],
                images: [{ url: 'https://placehold.co/400x400/1a1a24/ffffff?text=MacBook+Pro', publicId: 'mbpm3', alt: 'MacBook Pro 16 M3 Max', isPrimary: true, order: 0 }],
                isFeatured: true,
                averageRating: 4.9,
                reviewCount: 134,
                tags: ['macbook', 'apple', 'laptop', 'professional'],
            },
            {
                name: 'Dell XPS 15',
                nameAr: 'ديل XPS 15',
                slug: 'dell-xps-15',
                description: 'Premium Windows laptop with Intel Core i9 and OLED display.',
                descriptionAr: 'كمبيوتر محمول Windows متميز مع معالج Intel Core i9 وشاشة OLED.',
                shortDescription: 'Intel Core i9, 32GB RAM, OLED display',
                shortDescriptionAr: 'معالج Intel Core i9، 32 جيجابايت رام، شاشة OLED',
                sku: 'DELL-XPS15-I9',
                price: 1799.99,
                compareAtPrice: 1999.99,
                quantity: 25,
                category: categories['laptops'],
                brand: brands['dell'],
                images: [{ url: 'https://placehold.co/400x400/1a1a24/374151?text=Dell+XPS', publicId: 'dellxps', alt: 'Dell XPS 15', isPrimary: true, order: 0 }],
                averageRating: 4.6,
                reviewCount: 89,
                tags: ['dell', 'windows', 'laptop', 'business'],
            },
            // Audio
            {
                name: 'Sony WH-1000XM5',
                nameAr: 'سوني WH-1000XM5',
                slug: 'sony-wh-1000xm5',
                description: 'Industry-leading noise cancellation with exceptional sound quality.',
                descriptionAr: 'إلغاء ضوضاء رائد في الصناعة مع جودة صوت استثنائية.',
                shortDescription: 'Best-in-class ANC, 30-hour battery, Hi-Res Audio',
                shortDescriptionAr: 'أفضل إلغاء ضوضاء، بطارية 30 ساعة، صوت عالي الدقة',
                sku: 'SONY-WH1000XM5',
                price: 349.99,
                compareAtPrice: 399.99,
                quantity: 80,
                category: categories['audio'],
                brand: brands['sony'],
                images: [{ url: 'https://placehold.co/400x400/1a1a24/0a0a0a?text=Sony+XM5', publicId: 'sonyxm5', alt: 'Sony WH-1000XM5', isPrimary: true, order: 0 }],
                isFeatured: true,
                averageRating: 4.8,
                reviewCount: 567,
                tags: ['sony', 'headphones', 'noise-cancellation', 'wireless'],
            },
            {
                name: 'Apple AirPods Pro 2',
                nameAr: 'أبل إيربودز برو 2',
                slug: 'apple-airpods-pro-2',
                description: 'Active Noise Cancellation, Adaptive Transparency, and Personalized Spatial Audio.',
                descriptionAr: 'إلغاء الضوضاء النشط، الشفافية التكيفية، والصوت المكاني المخصص.',
                shortDescription: 'ANC, USB-C, 6-hour battery',
                shortDescriptionAr: 'إلغاء ضوضاء، USB-C، بطارية 6 ساعات',
                sku: 'AAPL-APP2-USBC',
                price: 249.99,
                quantity: 100,
                category: categories['audio'],
                brand: brands['apple'],
                images: [{ url: 'https://placehold.co/400x400/1a1a24/f5f5f5?text=AirPods', publicId: 'airpods', alt: 'Apple AirPods Pro 2', isPrimary: true, order: 0 }],
                isNewArrival: true,
                averageRating: 4.7,
                reviewCount: 890,
                tags: ['apple', 'airpods', 'earbuds', 'wireless'],
            },
            // Gaming
            {
                name: 'PlayStation 5',
                nameAr: 'بلايستيشن 5',
                slug: 'playstation-5',
                description: 'Experience lightning-fast loading with an ultra-high speed SSD and deeper immersion with haptic feedback.',
                descriptionAr: 'استمتع بتحميل سريع للغاية مع SSD فائق السرعة وانغماس أعمق مع ردود فعل لمسية.',
                shortDescription: 'Ultra-high speed SSD, 4K gaming, DualSense controller',
                shortDescriptionAr: 'SSD فائق السرعة، ألعاب 4K، يد تحكم DualSense',
                sku: 'SONY-PS5-DISC',
                price: 499.99,
                quantity: 30,
                category: categories['gaming'],
                brand: brands['sony'],
                images: [{ url: 'https://placehold.co/400x400/1a1a24/1e40af?text=PS5', publicId: 'ps5', alt: 'PlayStation 5', isPrimary: true, order: 0 }],
                isBestSeller: true,
                averageRating: 4.9,
                reviewCount: 1234,
                tags: ['sony', 'playstation', 'console', 'gaming'],
            },
            {
                name: 'Xbox Series X',
                nameAr: 'إكسبوكس سيريس إكس',
                slug: 'xbox-series-x',
                description: 'The fastest, most powerful Xbox ever. 12 teraflops of raw graphic processing power.',
                descriptionAr: 'أسرع وأقوى إكسبوكس على الإطلاق. 12 تيرافلوب من قوة معالجة الرسومات.',
                shortDescription: '12 teraflops GPU, 4K 120fps, 1TB SSD',
                shortDescriptionAr: 'معالج رسومات 12 تيرافلوب، 4K 120 إطار، 1 تيرابايت SSD',
                sku: 'MSFT-XBSX-1TB',
                price: 499.99,
                quantity: 25,
                category: categories['gaming'],
                brand: brands['microsoft'],
                images: [{ url: 'https://placehold.co/400x400/1a1a24/107c10?text=Xbox', publicId: 'xbox', alt: 'Xbox Series X', isPrimary: true, order: 0 }],
                averageRating: 4.8,
                reviewCount: 876,
                tags: ['microsoft', 'xbox', 'console', 'gaming'],
            },
            {
                name: 'Nintendo Switch OLED',
                nameAr: 'نينتندو سويتش OLED',
                slug: 'nintendo-switch-oled',
                description: 'Enhanced gaming experience with a vibrant 7-inch OLED screen.',
                descriptionAr: 'تجربة ألعاب محسنة مع شاشة OLED مقاس 7 بوصات.',
                shortDescription: '7-inch OLED, Enhanced audio, Wide adjustable stand',
                shortDescriptionAr: 'شاشة OLED 7 بوصات، صوت محسن، حامل قابل للتعديل',
                sku: 'NTDO-SWOLED-WHT',
                price: 349.99,
                quantity: 40,
                category: categories['gaming'],
                brand: brands['nintendo'],
                images: [{ url: 'https://placehold.co/400x400/1a1a24/e60012?text=Switch', publicId: 'switch', alt: 'Nintendo Switch OLED', isPrimary: true, order: 0 }],
                isNewArrival: true,
                averageRating: 4.7,
                reviewCount: 543,
                tags: ['nintendo', 'switch', 'handheld', 'gaming'],
            },
            // Wearables
            {
                name: 'Apple Watch Ultra 2',
                nameAr: 'أبل واتش ألترا 2',
                slug: 'apple-watch-ultra-2',
                description: 'The most rugged and capable Apple Watch. Titanium case, precision GPS, and up to 36 hours of battery.',
                descriptionAr: 'أقوى وأكثر أبل واتش متانة. هيكل تيتانيوم، GPS دقيق، وبطارية حتى 36 ساعة.',
                shortDescription: 'Titanium, 36-hour battery, Precision GPS',
                shortDescriptionAr: 'تيتانيوم، بطارية 36 ساعة، GPS دقيق',
                sku: 'AAPL-AWU2-49MM',
                price: 799.99,
                quantity: 30,
                category: categories['wearables'],
                brand: brands['apple'],
                images: [{ url: 'https://placehold.co/400x400/1a1a24/ea580c?text=Watch+Ultra', publicId: 'watchultra', alt: 'Apple Watch Ultra 2', isPrimary: true, order: 0 }],
                isFeatured: true,
                isNewArrival: true,
                averageRating: 4.8,
                reviewCount: 234,
                tags: ['apple', 'watch', 'smartwatch', 'fitness'],
            },
            {
                name: 'Samsung Galaxy Watch 6 Classic',
                nameAr: 'سامسونج جالاكسي واتش 6 كلاسيك',
                slug: 'samsung-galaxy-watch-6-classic',
                description: 'Timeless design meets advanced technology. Rotating bezel and comprehensive health tracking.',
                descriptionAr: 'تصميم كلاسيكي يلتقي بالتكنولوجيا المتقدمة. حافة دوارة وتتبع صحي شامل.',
                shortDescription: 'Rotating bezel, Health tracking, Wear OS',
                shortDescriptionAr: 'حافة دوارة، تتبع صحي، Wear OS',
                sku: 'SMSG-GW6C-47MM',
                price: 399.99,
                compareAtPrice: 449.99,
                quantity: 45,
                category: categories['wearables'],
                brand: brands['samsung'],
                images: [{ url: 'https://placehold.co/400x400/1a1a24/1428a0?text=Galaxy+Watch', publicId: 'galaxywatch', alt: 'Samsung Galaxy Watch 6 Classic', isPrimary: true, order: 0 }],
                averageRating: 4.5,
                reviewCount: 167,
                tags: ['samsung', 'watch', 'smartwatch', 'android'],
            },
            // Cameras
            {
                name: 'Canon EOS R5',
                nameAr: 'كانون EOS R5',
                slug: 'canon-eos-r5',
                description: 'Professional mirrorless camera with 45MP full-frame sensor and 8K video recording.',
                descriptionAr: 'كاميرا احترافية بدون مرآة مع مستشعر إطار كامل 45 ميجابكسل وتسجيل فيديو 8K.',
                shortDescription: '45MP sensor, 8K video, In-body stabilization',
                shortDescriptionAr: 'مستشعر 45 ميجابكسل، فيديو 8K، تثبيت داخلي',
                sku: 'CANON-EOSR5-BODY',
                price: 3899.99,
                quantity: 10,
                category: categories['cameras'],
                brand: brands['canon'],
                images: [{ url: 'https://placehold.co/400x400/1a1a24/c00?text=Canon+R5', publicId: 'canonr5', alt: 'Canon EOS R5', isPrimary: true, order: 0 }],
                isFeatured: true,
                averageRating: 4.9,
                reviewCount: 78,
                tags: ['canon', 'camera', 'mirrorless', 'professional'],
            },
            {
                name: 'Sony Alpha a7 IV',
                nameAr: 'سوني ألفا a7 IV',
                slug: 'sony-alpha-a7-iv',
                description: 'Full-frame mirrorless camera with 33MP sensor and advanced autofocus.',
                descriptionAr: 'كاميرا إطار كامل بدون مرآة مع مستشعر 33 ميجابكسل وتركيز تلقائي متقدم.',
                shortDescription: '33MP sensor, 4K 60p video, Real-time Eye AF',
                shortDescriptionAr: 'مستشعر 33 ميجابكسل، فيديو 4K 60p، تركيز عين فوري',
                sku: 'SONY-A7IV-BODY',
                price: 2499.99,
                compareAtPrice: 2799.99,
                quantity: 15,
                category: categories['cameras'],
                brand: brands['sony'],
                images: [{ url: 'https://placehold.co/400x400/1a1a24/ff7b00?text=Sony+A7', publicId: 'sonya7', alt: 'Sony Alpha a7 IV', isPrimary: true, order: 0 }],
                averageRating: 4.8,
                reviewCount: 156,
                tags: ['sony', 'camera', 'mirrorless', 'full-frame'],
            },
        ];

        for (const product of productsData) {
            const created = await Product.create(product);
            console.log(`  ✅ Created product: ${created.name}`);

            // Update category product count
            await Category.findByIdAndUpdate(product.category, { $inc: { productCount: 1 } });
        }
        console.log(`\n✅ Created ${productsData.length} products\n`);

        // Summary
        const categoryCount = await Category.countDocuments();
        const brandCount = await Brand.countDocuments();
        const productCount = await Product.countDocuments();

        console.log('🎉 Database seeding complete!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`📁 Categories: ${categoryCount}`);
        console.log(`🏷️  Brands: ${brandCount}`);
        console.log(`📦 Products: ${productCount}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    }
}

seedDatabase();
