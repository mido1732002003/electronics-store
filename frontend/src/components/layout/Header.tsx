import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineShoppingCart, HiOutlineHeart, HiOutlineUser, HiOutlineSearch, HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectCartItemCount } from '@/store/slices/cartSlice';
import { logout } from '@/store/slices/authSlice';

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const cartItemCount = useAppSelector(selectCartItemCount);
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
            setIsSearchOpen(false);
            setSearchQuery('');
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        setIsProfileDropdownOpen(false);
        navigate('/');
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Products', path: '/products' },
        { name: 'Smartphones', path: '/products?category=smartphones' },
        { name: 'Laptops', path: '/products?category=laptops' },
        { name: 'Gaming', path: '/products?category=gaming' },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
            <div className="container-custom py-4">
                <div className="flex items-center justify-between gap-4">
                    {/* Mobile menu button */}
                    <button
                        className="lg:hidden p-2 text-text-secondary hover:text-accent transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <HiOutlineX size={24} /> : <HiOutlineMenu size={24} />}
                    </button>

                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0">
                        <h1 className="text-xl font-bold text-accent font-heading tracking-wide">
                            ES
                        </h1>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="text-text-secondary hover:text-text-primary transition-colors font-medium text-sm relative group"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full" />
                            </Link>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Search */}
                        <button
                            className="p-2 text-text-secondary hover:text-accent transition-colors"
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                        >
                            <HiOutlineSearch size={20} />
                        </button>

                        {/* Wishlist */}
                        <Link
                            to={isAuthenticated ? '/account/wishlist' : '/login'}
                            className="hidden sm:flex p-2 text-text-secondary hover:text-accent transition-colors"
                        >
                            <HiOutlineHeart size={20} />
                        </Link>

                        {/* Cart */}
                        <div
                            onClick={() => navigate('/cart')}
                            className="relative p-2 text-text-secondary hover:text-accent transition-colors cursor-pointer"
                        >
                            <HiOutlineShoppingCart size={20} />
                            {cartItemCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 bg-accent text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                    {cartItemCount > 9 ? '9+' : cartItemCount}
                                </span>
                            )}
                        </div>

                        {/* Profile */}
                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                    className="flex items-center gap-2 p-2 text-text-secondary hover:text-accent transition-colors"
                                >
                                    <HiOutlineUser size={20} />
                                </button>
                                <AnimatePresence>
                                    {isProfileDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute right-0 mt-2 w-48 bg-background-card border border-border rounded-xl shadow-card py-2"
                                        >
                                            <div className="px-4 py-2 border-b border-border">
                                                <p className="text-sm font-medium text-text-primary">{user?.firstName} {user?.lastName}</p>
                                                <p className="text-xs text-text-muted">{user?.email}</p>
                                            </div>
                                            <Link
                                                to="/account/profile"
                                                className="block px-4 py-2 text-sm text-text-secondary hover:bg-accent/10 hover:text-accent transition-colors"
                                                onClick={() => setIsProfileDropdownOpen(false)}
                                            >
                                                Profile
                                            </Link>
                                            <Link
                                                to="/account/orders"
                                                className="block px-4 py-2 text-sm text-text-secondary hover:bg-accent/10 hover:text-accent transition-colors"
                                                onClick={() => setIsProfileDropdownOpen(false)}
                                            >
                                                Orders
                                            </Link>
                                            {(['admin', 'super_admin'].includes(user?.role?.toLowerCase() || '')) && (
                                                <Link
                                                    to="/admin"
                                                    className="block px-4 py-2 text-sm text-text-secondary hover:bg-accent/10 hover:text-accent transition-colors"
                                                    onClick={() => setIsProfileDropdownOpen(false)}
                                                >
                                                    Admin Dashboard
                                                </Link>
                                            )}
                                            <Link
                                                to="/account/wishlist"
                                                className="block px-4 py-2 text-sm text-text-secondary hover:bg-accent/10 hover:text-accent transition-colors"
                                                onClick={() => setIsProfileDropdownOpen(false)}
                                            >
                                                Wishlist
                                            </Link>
                                            <hr className="my-2 border-border" />
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                                            >
                                                Logout
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="flex items-center gap-2 p-2 text-text-secondary hover:text-accent transition-colors"
                            >
                                <HiOutlineUser size={20} />
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile search */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-border overflow-hidden"
                    >
                        <form onSubmit={handleSearch} className="container-custom py-4">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                                className="input"
                            />
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="lg:hidden border-t border-border overflow-hidden"
                    >
                        <nav className="container-custom py-4">
                            <ul className="space-y-1">
                                {navLinks.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            to={link.path}
                                            className="block py-3 px-4 text-text-secondary hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;
