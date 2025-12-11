import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { HiOutlineFilter, HiOutlineViewGrid, HiOutlineViewList, HiOutlineSearch, HiOutlineX } from 'react-icons/hi';
import toast from 'react-hot-toast';
import ProductCard from '@/components/product/ProductCard';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import api from '@/services/api';
import { useAppDispatch } from '@/store/hooks';
import { addItem } from '@/store/slices/cartSlice';

interface Product {
    _id: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice?: number;
    images: string[];
    rating: number;
    reviewCount: number;
    isNew?: boolean;
    isFeatured?: boolean;
}

const categories = [
    { name: 'All', slug: '' },
    { name: 'Smartphones', slug: 'smartphones' },
    { name: 'Laptops', slug: 'laptops' },
    { name: 'Audio', slug: 'audio' },
    { name: 'Gaming', slug: 'gaming' },
    { name: 'Wearables', slug: 'wearables' },
    { name: 'Cameras', slug: 'cameras' },
];

const sortOptions = [
    { label: 'Newest', value: 'newest' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Rating', value: 'rating' },
    { label: 'Popular', value: 'popular' },
];

// Fallback mock data in case API fails
const mockProducts = [
    { _id: '1', name: 'iPhone 15 Pro Max', slug: 'iphone-15-pro-max', price: 1199.99, compareAtPrice: 1299.99, images: ['https://placehold.co/400x400/4f46e5/white?text=iPhone+15'], rating: 4.8, reviewCount: 245, isNew: true },
    { _id: '2', name: 'Samsung Galaxy S24 Ultra', slug: 'samsung-galaxy-s24-ultra', price: 1299.99, compareAtPrice: 1399.99, images: ['https://placehold.co/400x400/0d9488/white?text=Galaxy+S24'], rating: 4.7, reviewCount: 189, isFeatured: true },
    { _id: '3', name: 'MacBook Pro 16" M3', slug: 'macbook-pro-16-m3', price: 3499.99, images: ['https://placehold.co/400x400/737373/white?text=MacBook+Pro'], rating: 4.9, reviewCount: 134 },
    { _id: '4', name: 'Sony WH-1000XM5', slug: 'sony-wh-1000xm5', price: 349.99, compareAtPrice: 399.99, images: ['https://placehold.co/400x400/0a0a0a/white?text=Sony+XM5'], rating: 4.8, reviewCount: 567, isFeatured: true },
    { _id: '5', name: 'PlayStation 5', slug: 'playstation-5', price: 499.99, images: ['https://placehold.co/400x400/1e40af/white?text=PS5'], rating: 4.9, reviewCount: 1234 },
    { _id: '6', name: 'Apple Watch Ultra 2', slug: 'apple-watch-ultra-2', price: 799.99, images: ['https://placehold.co/400x400/ea580c/white?text=Watch+Ultra'], rating: 4.8, reviewCount: 234, isNew: true },
    { _id: '7', name: 'Dell XPS 15', slug: 'dell-xps-15', price: 1799.99, compareAtPrice: 1999.99, images: ['https://placehold.co/400x400/374151/white?text=Dell+XPS'], rating: 4.6, reviewCount: 89 },
    { _id: '8', name: 'AirPods Pro 2', slug: 'apple-airpods-pro-2', price: 249.99, images: ['https://placehold.co/400x400/f5f5f5/333?text=AirPods'], rating: 4.7, reviewCount: 890 },
];

const ProductsPage = () => {
    const dispatch = useAppDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);
    const [totalProducts, setTotalProducts] = useState(0);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
    const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'newest');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
    const [apiError, setApiError] = useState(false);

    // Map API product to frontend format
    const mapProduct = (p: Record<string, unknown>): Product => ({
        _id: (p._id || p.id) as string,
        name: p.name as string,
        slug: p.slug as string,
        price: p.price as number,
        compareAtPrice: p.compareAtPrice as number | undefined,
        images: Array.isArray(p.images)
            ? p.images.map((img: unknown) => typeof img === 'string' ? img : (img as { url?: string })?.url || '')
            : [],
        rating: (p.averageRating || p.rating || 0) as number,
        reviewCount: (p.reviewCount || 0) as number,
        isNew: (p.isNewArrival || p.isNew) as boolean | undefined,
        isFeatured: p.isFeatured as boolean | undefined,
    });

    // Add to cart handler
    const handleAddToCart = (product: Product) => {
        dispatch(addItem({
            id: product._id,
            productId: product._id,
            name: product.name,
            price: product.price,
            image: product.images?.[0] || 'https://placehold.co/400x400/1a1a24/f97316?text=Product',
            quantity: 1,
            maxQuantity: 10,
        }));
        toast.success(`${product.name} added to cart!`);
    };

    // Fetch products from API
    const fetchProducts = async () => {
        setIsLoading(true);
        setApiError(false);

        try {
            const params = new URLSearchParams();
            if (selectedCategory) params.set('category', selectedCategory);
            if (searchQuery) params.set('search', searchQuery);
            if (priceRange[0] > 0) params.set('minPrice', priceRange[0].toString());
            if (priceRange[1] < 5000) params.set('maxPrice', priceRange[1].toString());

            // Map sort values to API format
            if (sortBy === 'price-asc') {
                params.set('sortBy', 'price');
                params.set('sortOrder', 'asc');
            } else if (sortBy === 'price-desc') {
                params.set('sortBy', 'price');
                params.set('sortOrder', 'desc');
            } else if (sortBy === 'rating') {
                params.set('sortBy', 'rating');
                params.set('sortOrder', 'desc');
            } else if (sortBy === 'popular') {
                params.set('sortBy', 'popular');
            } else {
                params.set('sortBy', 'newest');
            }

            const response = await api.get(`/products?${params.toString()}`);
            const data = response.data.data;

            if (Array.isArray(data) && data.length > 0) {
                setProducts(data.map(mapProduct));
                setTotalProducts(data.length);
            } else if (data.products && data.products.length > 0) {
                setProducts(data.products.map(mapProduct));
                setTotalProducts(data.total || data.products.length);
            } else {
                // Fallback to mock data if no results
                setProducts(mockProducts);
                setTotalProducts(mockProducts.length);
                setApiError(true);
            }
        } catch (error) {
            console.error('Failed to fetch products:', error);
            setApiError(true);
            // Use mock data as fallback
            let filtered = [...mockProducts];

            // Apply local filtering for demo
            if (selectedCategory) {
                // Simple mock filtering by category name in product name
                const catLower = selectedCategory.toLowerCase();
                if (catLower === 'smartphones') {
                    filtered = filtered.filter(p => p.name.toLowerCase().includes('iphone') || p.name.toLowerCase().includes('galaxy'));
                } else if (catLower === 'laptops') {
                    filtered = filtered.filter(p => p.name.toLowerCase().includes('macbook') || p.name.toLowerCase().includes('xps'));
                } else if (catLower === 'audio') {
                    filtered = filtered.filter(p => p.name.toLowerCase().includes('sony') || p.name.toLowerCase().includes('airpods'));
                } else if (catLower === 'gaming') {
                    filtered = filtered.filter(p => p.name.toLowerCase().includes('playstation'));
                } else if (catLower === 'wearables') {
                    filtered = filtered.filter(p => p.name.toLowerCase().includes('watch'));
                }
            }

            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                filtered = filtered.filter(p => p.name.toLowerCase().includes(query));
            }

            setProducts(filtered);
            setTotalProducts(filtered.length);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [selectedCategory, sortBy, priceRange]);

    const handleCategoryChange = (slug: string) => {
        setSelectedCategory(slug);
        const params = new URLSearchParams(searchParams);
        if (slug) {
            params.set('category', slug);
        } else {
            params.delete('category');
        }
        setSearchParams(params);
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        const value = e.target.value;
        setSortBy(value);
        const params = new URLSearchParams(searchParams);
        params.set('sortBy', value);
        setSearchParams(params);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams);
        if (searchQuery) {
            params.set('search', searchQuery);
        } else {
            params.delete('search');
        }
        setSearchParams(params);
        fetchProducts();
    };

    const clearFilters = () => {
        setSelectedCategory('');
        setSearchQuery('');
        setPriceRange([0, 5000]);
        setSortBy('newest');
        setSearchParams({});
    };

    const categoryName = selectedCategory
        ? categories.find(c => c.slug === selectedCategory)?.name || selectedCategory
        : 'All Products';

    return (
        <>
            <Helmet>
                <title>{categoryName} - Electronics Store</title>
                <meta name="description" content="Browse our collection of electronics, smartphones, laptops, and more." />
            </Helmet>

            <div className="bg-background min-h-screen">
                {/* Header */}
                <div className="bg-background-secondary border-b border-border">
                    <div className="container-custom py-8">
                        <h1 className="text-3xl font-bold text-text-primary mb-4 font-heading">
                            {categoryName}
                        </h1>

                        {/* Search */}
                        <form onSubmit={handleSearch} className="max-w-md">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search products..."
                                    className="w-full px-4 py-3 pr-12 rounded-lg border border-border bg-background-secondary text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50"
                                />
                                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <HiOutlineSearch size={20} className="text-text-muted hover:text-accent transition-colors" />
                                </button>
                            </div>
                        </form>

                        {/* Active filters */}
                        {(selectedCategory || searchQuery) && (
                            <div className="mt-4 flex items-center gap-2 flex-wrap">
                                <span className="text-text-muted text-sm">Active filters:</span>
                                {selectedCategory && (
                                    <button
                                        onClick={() => handleCategoryChange('')}
                                        className="inline-flex items-center gap-1 px-3 py-1 bg-accent/20 text-accent rounded-full text-sm"
                                    >
                                        {categoryName}
                                        <HiOutlineX size={14} />
                                    </button>
                                )}
                                {searchQuery && (
                                    <button
                                        onClick={() => { setSearchQuery(''); fetchProducts(); }}
                                        className="inline-flex items-center gap-1 px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm"
                                    >
                                        "{searchQuery}"
                                        <HiOutlineX size={14} />
                                    </button>
                                )}
                                <button onClick={clearFilters} className="text-text-muted text-sm hover:text-accent">
                                    Clear all
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="container-custom py-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar Filters */}
                        <aside className={`lg:w-64 flex-shrink-0 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
                            <div className="bg-background-card border border-border rounded-xl p-6 sticky top-24">
                                <h3 className="font-semibold text-text-primary mb-4">Categories</h3>
                                <ul className="space-y-2">
                                    {categories.map((category) => (
                                        <li key={category.slug}>
                                            <button
                                                onClick={() => handleCategoryChange(category.slug)}
                                                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedCategory === category.slug
                                                    ? 'bg-accent/20 text-accent'
                                                    : 'hover:bg-background-secondary text-text-secondary'
                                                    }`}
                                            >
                                                {category.name}
                                            </button>
                                        </li>
                                    ))}
                                </ul>

                                <hr className="my-6 border-border" />

                                <h3 className="font-semibold text-text-primary mb-4">Price Range</h3>
                                <div className="space-y-4">
                                    <input
                                        type="range"
                                        min="0"
                                        max="5000"
                                        value={priceRange[1]}
                                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                        className="w-full accent-accent"
                                    />
                                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                                        <span>${priceRange[0]}</span>
                                        <span>-</span>
                                        <span>${priceRange[1]}</span>
                                    </div>
                                </div>

                                {apiError && (
                                    <div className="mt-6 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-400 text-sm">
                                        ⚠️ Using demo data (API unavailable)
                                    </div>
                                )}
                            </div>
                        </aside>

                        {/* Main Content */}
                        <main className="flex-1">
                            {/* Toolbar */}
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                                        className="lg:hidden flex items-center gap-2 px-4 py-2 bg-background-card border border-border rounded-lg text-text-secondary"
                                    >
                                        <HiOutlineFilter size={20} />
                                        Filters
                                    </button>
                                    <span className="text-text-muted">{totalProducts} products</span>
                                </div>

                                <div className="flex items-center gap-4">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => handleSortChange(e.target.value)}
                                        className="px-4 py-2 rounded-lg border border-border bg-background-secondary text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/50"
                                    >
                                        {sortOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>

                                    <div className="hidden sm:flex items-center gap-1 bg-background-card border border-border rounded-lg p-1">
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className={`p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-accent/20 text-accent' : 'text-text-secondary'}`}
                                        >
                                            <HiOutlineViewGrid size={20} />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('list')}
                                            className={`p-2 rounded transition-colors ${viewMode === 'list' ? 'bg-accent/20 text-accent' : 'text-text-secondary'}`}
                                        >
                                            <HiOutlineViewList size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Products Grid */}
                            {isLoading ? (
                                <div className="flex justify-center py-20">
                                    <LoadingSpinner size="lg" />
                                </div>
                            ) : products.length === 0 ? (
                                <div className="text-center py-20">
                                    <p className="text-text-muted text-lg mb-4">No products found</p>
                                    <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
                                </div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className={`grid gap-6 ${viewMode === 'grid'
                                        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                                        : 'grid-cols-1'
                                        }`}
                                >
                                    {products.map((product) => (
                                        <ProductCard
                                            key={product._id}
                                            id={product._id}
                                            name={product.name}
                                            slug={product.slug}
                                            price={product.price}
                                            compareAtPrice={product.compareAtPrice}
                                            image={product.images?.[0] || 'https://placehold.co/400x400/1a1a24/f97316?text=Product'}
                                            rating={product.rating}
                                            reviewCount={product.reviewCount}
                                            isNew={product.isNew}
                                            isFeatured={product.isFeatured}
                                            onAddToCart={() => handleAddToCart(product)}
                                            onAddToWishlist={() => toast.success(`${product.name} added to wishlist!`)}
                                        />
                                    ))}
                                </motion.div>
                            )}

                            {/* Load More */}
                            {products.length > 0 && products.length < totalProducts && (
                                <div className="mt-12 text-center">
                                    <Button variant="outline" size="lg">
                                        Load More Products
                                    </Button>
                                </div>
                            )}
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductsPage;
