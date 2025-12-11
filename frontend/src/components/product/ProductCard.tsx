import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineShoppingCart, HiOutlineHeart, HiOutlineStar } from 'react-icons/hi';
import { formatCurrency } from '@/utils/helpers';

interface ProductCardProps {
    id: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice?: number;
    image: string;
    rating: number;
    reviewCount: number;
    isNew?: boolean;
    isFeatured?: boolean;
    onAddToCart?: () => void;
    onAddToWishlist?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
    name,
    slug,
    price,
    compareAtPrice,
    image,
    rating,
    reviewCount,
    isNew,
    isFeatured,
    onAddToCart,
    onAddToWishlist,
}) => {
    const discountPercentage = compareAtPrice
        ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
        : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="group card-hover"
        >
            {/* Image */}
            <div className="relative aspect-square overflow-hidden bg-background-tertiary rounded-xl mb-4">
                <Link to={`/products/${slug}`}>
                    <img
                        src={image || '/placeholder-product.png'}
                        alt={name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                </Link>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {isNew && (
                        <span className="badge-purple">New</span>
                    )}
                    {isFeatured && (
                        <span className="badge-accent">Featured</span>
                    )}
                    {discountPercentage > 0 && (
                        <span className="badge-danger">-{discountPercentage}%</span>
                    )}
                </div>

                {/* Quick actions */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            onAddToWishlist?.();
                        }}
                        className="p-2 bg-background-card/80 backdrop-blur rounded-lg hover:bg-accent/20 transition-colors border border-border"
                    >
                        <HiOutlineHeart size={18} className="text-text-secondary hover:text-accent" />
                    </button>
                </div>

                {/* Add to cart button */}
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            onAddToCart?.();
                        }}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent-600 transition-colors shadow-glow"
                    >
                        <HiOutlineShoppingCart size={18} />
                        Add to Cart
                    </button>
                </div>
            </div>

            {/* Content */}
            <div>
                <Link to={`/products/${slug}`}>
                    <h3 className="font-medium text-text-primary mb-2 line-clamp-2 hover:text-accent transition-colors">
                        {name}
                    </h3>
                </Link>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <HiOutlineStar
                                key={i}
                                size={14}
                                className={i < Math.round(rating) ? 'text-accent fill-accent' : 'text-border-light'}
                            />
                        ))}
                    </div>
                    <span className="text-xs text-text-muted">({reviewCount})</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-accent">{formatCurrency(price)}</span>
                    {compareAtPrice && (
                        <span className="text-sm text-text-muted line-through">{formatCurrency(compareAtPrice)}</span>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
