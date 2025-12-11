import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { HiOutlineShoppingCart, HiOutlineHeart, HiOutlineMinus, HiOutlinePlus, HiOutlineCheck, HiOutlineTruck, HiOutlineShieldCheck, HiOutlineStar } from 'react-icons/hi';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import ProductCard from '@/components/product/ProductCard';
import { formatCurrency } from '@/utils/helpers';

// Mock product data
const mockProduct = {
    id: '1',
    name: 'iPhone 15 Pro Max',
    slug: 'iphone-15-pro-max',
    price: 1199.99,
    compareAtPrice: 1299.99,
    images: [
        'https://placehold.co/600x600/4f46e5/white?text=iPhone+1',
        'https://placehold.co/600x600/6366f1/white?text=iPhone+2',
        'https://placehold.co/600x600/818cf8/white?text=iPhone+3',
        'https://placehold.co/600x600/a5b4fc/white?text=iPhone+4',
    ],
    description: 'The most powerful iPhone ever with A17 Pro chip, titanium design, and advanced camera system. Experience the future of mobile technology.',
    specifications: [
        { name: 'Display', value: '6.7" Super Retina XDR' },
        { name: 'Chip', value: 'A17 Pro' },
        { name: 'Storage', value: '256GB' },
        { name: 'Camera', value: '48MP + 12MP + 12MP' },
        { name: 'Battery', value: 'Up to 29 hours video' },
        { name: 'Connectivity', value: '5G, Wi-Fi 6E, Bluetooth 5.3' },
    ],
    features: ['Titanium design', '5x optical zoom', 'Action button', 'USB-C', 'A17 Pro chip', 'ProMotion display'],
    rating: 4.8,
    reviewCount: 245,
    inStock: true,
    quantity: 50,
    category: { name: 'Smartphones', slug: 'smartphones' },
    brand: { name: 'Apple', slug: 'apple' },
};

const relatedProducts = [
    { id: '2', name: 'Samsung Galaxy S24 Ultra', slug: 'samsung-galaxy-s24-ultra', price: 1299.99, image: 'https://placehold.co/400x400/0d9488/white?text=Galaxy+S24', rating: 4.7, reviewCount: 189 },
    { id: '3', name: 'Google Pixel 8 Pro', slug: 'google-pixel-8-pro', price: 999.99, image: 'https://placehold.co/400x400/737373/white?text=Pixel+8', rating: 4.6, reviewCount: 156 },
    { id: '4', name: 'OnePlus 12', slug: 'oneplus-12', price: 799.99, image: 'https://placehold.co/400x400/dc2626/white?text=OnePlus+12', rating: 4.5, reviewCount: 98 },
    { id: '5', name: 'iPhone 15', slug: 'iphone-15', price: 799.99, image: 'https://placehold.co/400x400/6366f1/white?text=iPhone+15', rating: 4.7, reviewCount: 312 },
];

const ProductDetailPage = () => {
    const { slug } = useParams();
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');

    const handleAddToCart = () => {
        toast.success(`Added ${quantity} item(s) to cart`);
    };

    const handleAddToWishlist = () => {
        toast.success('Added to wishlist');
    };

    const discountPercentage = mockProduct.compareAtPrice
        ? Math.round(((mockProduct.compareAtPrice - mockProduct.price) / mockProduct.compareAtPrice) * 100)
        : 0;

    return (
        <>
            <Helmet>
                <title>{mockProduct.name} - Electronics Store</title>
                <meta name="description" content={mockProduct.description} />
            </Helmet>

            <div className="bg-background">
                {/* Breadcrumb */}
                <div className="bg-background-secondary py-4 border-b border-border">
                    <div className="container-custom">
                        <nav className="flex items-center gap-2 text-sm text-text-muted">
                            <Link to="/" className="hover:text-accent">Home</Link>
                            <span>/</span>
                            <Link to="/products" className="hover:text-accent">Products</Link>
                            <span>/</span>
                            <Link to={`/products?category=${mockProduct.category.slug}`} className="hover:text-accent">
                                {mockProduct.category.name}
                            </Link>
                            <span>/</span>
                            <span className="text-text-primary">{mockProduct.name}</span>
                        </nav>
                    </div>
                </div>

                {/* Product Details */}
                <section className="container-custom py-12">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Images */}
                        <div className="space-y-4">
                            <motion.div
                                key={selectedImage}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="aspect-square bg-background-secondary rounded-2xl overflow-hidden"
                            >
                                <img
                                    src={mockProduct.images[selectedImage]}
                                    alt={mockProduct.name}
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>

                            <div className="grid grid-cols-4 gap-4">
                                {mockProduct.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === index ? 'border-accent' : 'border-transparent'
                                            }`}
                                    >
                                        <img src={image} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Info */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Link to={`/products?brand=${mockProduct.brand.slug}`} className="text-sm text-accent font-medium">
                                    {mockProduct.brand.name}
                                </Link>
                                {discountPercentage > 0 && (
                                    <span className="badge bg-red-500 text-white">-{discountPercentage}% OFF</span>
                                )}
                            </div>

                            <h1 className="text-3xl lg:text-4xl font-bold text-text-primary mb-4 font-heading">
                                {mockProduct.name}
                            </h1>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <HiOutlineStar
                                            key={i}
                                            size={20}
                                            className={i < Math.round(mockProduct.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-text-muted'}
                                        />
                                    ))}
                                </div>
                                <span className="text-text-muted">({mockProduct.reviewCount} reviews)</span>
                            </div>

                            <div className="flex items-baseline gap-4 mb-6">
                                <span className="text-4xl font-bold text-accent">{formatCurrency(mockProduct.price)}</span>
                                {mockProduct.compareAtPrice && (
                                    <span className="text-xl text-text-muted line-through">{formatCurrency(mockProduct.compareAtPrice)}</span>
                                )}
                            </div>

                            <p className="text-text-secondary mb-6">{mockProduct.description}</p>

                            {/* Stock status */}
                            <div className="flex items-center gap-2 mb-6">
                                {mockProduct.inStock ? (
                                    <>
                                        <HiOutlineCheck className="text-green-500" size={20} />
                                        <span className="text-green-500">In Stock ({mockProduct.quantity} available)</span>
                                    </>
                                ) : (
                                    <span className="text-red-500">Out of Stock</span>
                                )}
                            </div>

                            {/* Quantity */}
                            <div className="flex items-center gap-4 mb-6">
                                <span className="font-medium text-text-primary">Quantity:</span>
                                <div className="flex items-center border border-border rounded-lg">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="p-3 hover:bg-background-secondary text-text-secondary"
                                        disabled={quantity <= 1}
                                    >
                                        <HiOutlineMinus size={16} />
                                    </button>
                                    <span className="px-6 font-medium text-text-primary">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(mockProduct.quantity, quantity + 1))}
                                        className="p-3 hover:bg-background-secondary text-text-secondary"
                                        disabled={quantity >= mockProduct.quantity}
                                    >
                                        <HiOutlinePlus size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4 mb-8">
                                <Button size="lg" className="flex-1" leftIcon={<HiOutlineShoppingCart size={20} />} onClick={handleAddToCart}>
                                    Add to Cart
                                </Button>
                                <Button size="lg" variant="outline" onClick={handleAddToWishlist}>
                                    <HiOutlineHeart size={24} />
                                </Button>
                            </div>

                            {/* Features */}
                            <div className="grid grid-cols-2 gap-4 p-6 bg-background-secondary rounded-xl mb-6">
                                <div className="flex items-center gap-3">
                                    <HiOutlineTruck size={24} className="text-accent" />
                                    <div>
                                        <p className="font-medium text-text-primary">Free Shipping</p>
                                        <p className="text-sm text-text-muted">On orders over $100</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <HiOutlineShieldCheck size={24} className="text-accent" />
                                    <div>
                                        <p className="font-medium text-text-primary">2 Year Warranty</p>
                                        <p className="text-sm text-text-muted">Full coverage</p>
                                    </div>
                                </div>
                            </div>

                            {/* Key features list */}
                            <div className="flex flex-wrap gap-2">
                                {mockProduct.features.map((feature) => (
                                    <span key={feature} className="px-3 py-1 bg-background-secondary rounded-full text-sm text-text-secondary">
                                        {feature}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Tabs */}
                <section className="border-t border-border">
                    <div className="container-custom py-12">
                        <div className="flex border-b border-border mb-8">
                            {['description', 'specifications', 'reviews'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-4 font-medium capitalize transition-colors ${activeTab === tab
                                        ? 'text-accent border-b-2 border-accent'
                                        : 'text-text-muted hover:text-text-primary'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {activeTab === 'specifications' && (
                            <div className="max-w-2xl">
                                <table className="w-full">
                                    <tbody>
                                        {mockProduct.specifications.map((spec, index) => (
                                            <tr key={spec.name} className={index % 2 === 0 ? 'bg-background-secondary' : ''}>
                                                <td className="px-4 py-3 font-medium text-text-primary">{spec.name}</td>
                                                <td className="px-4 py-3 text-text-secondary">{spec.value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === 'description' && (
                            <div className="prose prose-invert max-w-none">
                                <p className="text-text-secondary">{mockProduct.description}</p>
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="text-center py-12">
                                <p className="text-text-muted">No reviews yet. Be the first to review this product!</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Related Products */}
                <section className="bg-background-secondary py-16">
                    <div className="container-custom">
                        <h2 className="text-2xl font-bold text-text-primary mb-8 font-heading">
                            Related Products
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    {...product}
                                    onAddToCart={() => console.log('Add to cart:', product.id)}
                                    onAddToWishlist={() => console.log('Add to wishlist:', product.id)}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default ProductDetailPage;
