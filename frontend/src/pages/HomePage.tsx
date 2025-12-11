import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { HiArrowRight, HiOutlineTruck, HiOutlineShieldCheck, HiOutlineCreditCard, HiOutlineSupport } from 'react-icons/hi';
import Button from '@/components/ui/Button';
import ProductCard from '@/components/product/ProductCard';

// Mock data for demo
const featuredProducts = [
    { id: '1', name: 'iPhone 15 Pro Max', slug: 'iphone-15-pro-max', price: 1199.99, compareAtPrice: 1299.99, image: 'https://placehold.co/400x400/1a1a24/f97316?text=iPhone+15', rating: 4.8, reviewCount: 245, isNew: true },
    { id: '2', name: 'Samsung Galaxy S24 Ultra', slug: 'samsung-galaxy-s24-ultra', price: 1299.99, compareAtPrice: 1399.99, image: 'https://placehold.co/400x400/1a1a24/a855f7?text=Galaxy+S24', rating: 4.7, reviewCount: 189, isFeatured: true },
    { id: '3', name: 'MacBook Pro 16" M3', slug: 'macbook-pro-16-m3', price: 3499.99, image: 'https://placehold.co/400x400/1a1a24/ffffff?text=MacBook+Pro', rating: 4.9, reviewCount: 134 },
    { id: '4', name: 'Sony WH-1000XM5', slug: 'sony-wh-1000xm5', price: 349.99, compareAtPrice: 399.99, image: 'https://placehold.co/400x400/1a1a24/f97316?text=Sony+XM5', rating: 4.8, reviewCount: 567, isFeatured: true },
];

const categories = [
    { name: 'Smartphones', icon: '📱', slug: 'smartphones', gradient: 'from-accent to-accent-600' },
    { name: 'Laptops', icon: '💻', slug: 'laptops', gradient: 'from-purple-500 to-purple-700' },
    { name: 'Audio', icon: '🎧', slug: 'audio', gradient: 'from-pink-500 to-rose-600' },
    { name: 'Gaming', icon: '🎮', slug: 'gaming', gradient: 'from-green-500 to-emerald-600' },
    { name: 'Wearables', icon: '⌚', slug: 'wearables', gradient: 'from-accent-400 to-coral' },
    { name: 'Cameras', icon: '📷', slug: 'cameras', gradient: 'from-blue-500 to-cyan-600' },
];

const features = [
    { icon: HiOutlineTruck, title: 'Free Shipping', description: 'On orders over $100' },
    { icon: HiOutlineShieldCheck, title: 'Secure Payment', description: '100% secure checkout' },
    { icon: HiOutlineCreditCard, title: 'Easy Returns', description: '30-day return policy' },
    { icon: HiOutlineSupport, title: '24/7 Support', description: 'Dedicated support team' },
];

const HomePage = () => {
    return (
        <>
            <Helmet>
                <title>Electronics Store - Premium Electronics & Gadgets</title>
                <meta name="description" content="Shop the latest electronics, smartphones, laptops, and tech accessories. Free shipping on orders over $100." />
            </Helmet>

            {/* Hero Section */}
            <section className="relative min-h-[85vh] flex items-center overflow-hidden">
                {/* Background effects */}
                <div className="absolute inset-0 bg-gradient-hero" />
                <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px]" />

                {/* Grid pattern overlay */}
                <div className="absolute inset-0 opacity-[0.02]" style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: '50px 50px'
                }} />

                <div className="container-custom relative z-10 py-12">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <motion.span
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 rounded-full text-accent font-medium mb-6"
                            >
                                🔥 Hot Deals Available
                            </motion.span>

                            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight font-heading">
                                <span className="text-gradient">Premium</span>
                                <br />
                                <span className="text-text-primary">Electronics</span>
                            </h1>

                            <p className="text-lg text-text-secondary mb-2 font-medium">
                                Your One-Stop Tech Destination
                            </p>

                            <p className="text-text-muted mb-8 max-w-lg leading-relaxed">
                                Discover the latest smartphones, laptops, audio gear, and accessories from top brands. Free shipping on orders over $100.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <Link to="/products">
                                    <Button size="lg" rightIcon={<HiArrowRight />}>
                                        Shop Now
                                    </Button>
                                </Link>
                                <Link to="/products?featured=true">
                                    <Button variant="outline" size="lg">
                                        View Deals
                                    </Button>
                                </Link>
                            </div>

                            {/* Trust badges */}
                            <div className="mt-10 flex items-center gap-6 text-sm text-text-muted">
                                <div className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span> Free Shipping
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span> 30-Day Returns
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span> 2-Year Warranty
                                </div>
                            </div>
                        </motion.div>

                        {/* Product showcase - replaces geometric circle */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative hidden lg:block"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                {/* Main featured product */}
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className="col-span-2 bg-background-card border border-border rounded-2xl p-6 shadow-card relative overflow-hidden group"
                                >
                                    <div className="absolute top-4 right-4 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                                        -15% OFF
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="w-32 h-32 bg-gradient-to-br from-accent/20 to-purple-500/20 rounded-xl flex items-center justify-center text-6xl group-hover:scale-110 transition-transform">
                                            📱
                                        </div>
                                        <div>
                                            <p className="text-accent text-sm font-medium mb-1">Featured</p>
                                            <h3 className="text-xl font-bold text-text-primary mb-2">iPhone 15 Pro Max</h3>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-yellow-400">★★★★★</span>
                                                <span className="text-text-muted text-sm">(245 reviews)</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl font-bold text-accent">$1,199</span>
                                                <span className="text-text-muted line-through">$1,299</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Smaller product cards */}
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="bg-background-card border border-border rounded-xl p-4 shadow-card group"
                                >
                                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center text-3xl mb-3 group-hover:scale-110 transition-transform">
                                        🎧
                                    </div>
                                    <h4 className="font-semibold text-text-primary text-sm">Sony WH-1000XM5</h4>
                                    <p className="text-accent font-bold">$349</p>
                                </motion.div>

                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="bg-background-card border border-border rounded-xl p-4 shadow-card group"
                                >
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center text-3xl mb-3 group-hover:scale-110 transition-transform">
                                        💻
                                    </div>
                                    <h4 className="font-semibold text-text-primary text-sm">MacBook Pro 16"</h4>
                                    <p className="text-accent font-bold">$3,499</p>
                                </motion.div>

                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="bg-background-card border border-border rounded-xl p-4 shadow-card group"
                                >
                                    <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg flex items-center justify-center text-3xl mb-3 group-hover:scale-110 transition-transform">
                                        🎮
                                    </div>
                                    <h4 className="font-semibold text-text-primary text-sm">PlayStation 5</h4>
                                    <p className="text-accent font-bold">$499</p>
                                </motion.div>

                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="bg-background-card border border-border rounded-xl p-4 shadow-card group"
                                >
                                    <div className="w-16 h-16 bg-gradient-to-br from-accent/20 to-coral/20 rounded-lg flex items-center justify-center text-3xl mb-3 group-hover:scale-110 transition-transform">
                                        ⌚
                                    </div>
                                    <h4 className="font-semibold text-text-primary text-sm">Apple Watch Ultra</h4>
                                    <p className="text-accent font-bold">$799</p>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-8 border-y border-border">
                <div className="container-custom">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center gap-4 p-4"
                            >
                                <div className="p-3 bg-accent/10 rounded-xl border border-accent/20">
                                    <feature.icon className="w-6 h-6 text-accent" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-text-primary">{feature.title}</h3>
                                    <p className="text-sm text-text-muted">{feature.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="py-20 relative">
                <div className="absolute top-0 left-1/4 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[100px]" />

                <div className="container-custom relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <span className="text-accent font-medium mb-2 block">Browse</span>
                        <h2 className="text-3xl lg:text-4xl font-bold text-text-primary mb-4 font-heading">
                            Shop by Category
                        </h2>
                        <p className="text-text-muted max-w-2xl mx-auto">
                            Explore our wide range of electronics and find exactly what you need
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {categories.map((category, index) => (
                            <motion.div
                                key={category.slug}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Link
                                    to={`/products?category=${category.slug}`}
                                    className="group block p-6 card-hover text-center"
                                >
                                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        {category.icon}
                                    </div>
                                    <h3 className="font-medium text-text-primary group-hover:text-accent transition-colors">
                                        {category.name}
                                    </h3>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-20 relative">
                <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px]" />

                <div className="container-custom relative z-10">
                    <div className="flex items-center justify-between mb-12">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="text-accent font-medium mb-2 block">Discover</span>
                            <h2 className="text-3xl lg:text-4xl font-bold text-text-primary mb-2 font-heading">
                                Featured Products
                            </h2>
                            <p className="text-text-muted">Handpicked products just for you</p>
                        </motion.div>
                        <Link to="/products?featured=true" className="hidden sm:flex items-center gap-2 text-accent font-medium hover:text-accent-400 transition-colors group">
                            View All
                            <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredProducts.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <ProductCard
                                    {...product}
                                    onAddToCart={() => console.log('Add to cart:', product.id)}
                                    onAddToWishlist={() => console.log('Add to wishlist:', product.id)}
                                />
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-8 text-center sm:hidden">
                        <Link to="/products?featured=true">
                            <Button variant="outline">View All Products</Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Promo Banner */}
            <section className="py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-purple-500/10 to-accent/10" />
                <div className="absolute inset-0 opacity-30" style={{
                    backgroundImage: `radial-gradient(circle at 20% 50%, rgba(249, 115, 22, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 80% 50%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)`
                }} />

                <div className="container-custom relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center"
                    >
                        <span className="inline-block px-4 py-2 bg-accent/20 text-accent rounded-full text-sm font-medium mb-6">
                            🔥 Limited Time Offer
                        </span>
                        <h2 className="text-4xl lg:text-6xl font-bold mb-6 font-heading">
                            <span className="text-gradient">Summer Sale</span>
                            <br />
                            <span className="text-text-primary">Up to 50% Off</span>
                        </h2>
                        <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
                            Don't miss out on our biggest sale of the year. Limited time offer on selected electronics.
                        </p>
                        <Link to="/products?sale=true">
                            <Button size="lg" rightIcon={<HiArrowRight />}>
                                Shop Sale
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* New Arrivals */}
            <section className="py-20 relative">
                <div className="container-custom relative z-10">
                    <div className="flex items-center justify-between mb-12">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="text-purple-400 font-medium mb-2 block">Just In</span>
                            <h2 className="text-3xl lg:text-4xl font-bold text-text-primary mb-2 font-heading">
                                New Arrivals
                            </h2>
                            <p className="text-text-muted">Fresh from our latest collection</p>
                        </motion.div>
                        <Link to="/products?newArrivals=true" className="hidden sm:flex items-center gap-2 text-purple-400 font-medium hover:text-purple-300 transition-colors group">
                            View All
                            <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredProducts.slice(0, 4).map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <ProductCard
                                    {...product}
                                    isNew={true}
                                    onAddToCart={() => console.log('Add to cart:', product.id)}
                                    onAddToWishlist={() => console.log('Add to wishlist:', product.id)}
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Brands */}
            <section className="py-20 border-t border-border">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-2xl font-bold text-text-primary mb-4 font-heading">
                            Trusted by Leading Brands
                        </h2>
                    </motion.div>

                    <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-20">
                        {['Apple', 'Samsung', 'Sony', 'LG', 'Microsoft', 'Google'].map((brand, index) => (
                            <motion.div
                                key={brand}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 0.4 }}
                                whileHover={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-2xl font-bold text-text-muted hover:text-accent transition-colors cursor-pointer"
                            >
                                {brand}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default HomePage;
