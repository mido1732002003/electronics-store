import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineTrash, HiOutlineShoppingCart } from 'react-icons/hi';
import Button from '@/components/ui/Button';
import { formatCurrency } from '@/utils/helpers';

const mockWishlist = [
    { id: '1', name: 'iPhone 15 Pro Max', slug: 'iphone-15-pro-max', price: 1199.99, image: 'https://placehold.co/200x200/4f46e5/white?text=iPhone', inStock: true },
    { id: '2', name: 'PlayStation 5', slug: 'playstation-5', price: 499.99, image: 'https://placehold.co/200x200/1e40af/white?text=PS5', inStock: true },
    { id: '3', name: 'Sony WH-1000XM5', slug: 'sony-wh-1000xm5', price: 349.99, image: 'https://placehold.co/200x200/0a0a0a/white?text=Sony', inStock: false },
];

const WishlistPage = () => {
    return (
        <>
            <Helmet>
                <title>My Wishlist - Electronics Store</title>
            </Helmet>

            <div className="bg-background min-h-screen py-12">
                <div className="container-custom max-w-4xl">
                    <h1 className="text-3xl font-bold text-text-primary mb-8 font-heading">My Wishlist</h1>

                    <div className="space-y-4">
                        {mockWishlist.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-background-card border border-border rounded-xl p-6 flex items-center gap-6"
                            >
                                <Link to={`/products/${item.slug}`} className="flex-shrink-0">
                                    <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover" />
                                </Link>

                                <div className="flex-1">
                                    <Link to={`/products/${item.slug}`}>
                                        <h3 className="font-medium text-text-primary hover:text-accent transition-colors">{item.name}</h3>
                                    </Link>
                                    <p className="text-accent font-semibold mt-1">{formatCurrency(item.price)}</p>
                                    <p className={`text-sm mt-1 ${item.inStock ? 'text-green-500' : 'text-red-500'}`}>
                                        {item.inStock ? 'In Stock' : 'Out of Stock'}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button size="sm" leftIcon={<HiOutlineShoppingCart />} disabled={!item.inStock}>
                                        Add to Cart
                                    </Button>
                                    <button className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg">
                                        <HiOutlineTrash size={20} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {mockWishlist.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-text-muted">Your wishlist is empty.</p>
                            <Link to="/products" className="text-accent font-medium mt-2 inline-block">
                                Browse Products →
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default WishlistPage;
