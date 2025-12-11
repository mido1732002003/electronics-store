import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HiOutlineHome,
    HiOutlineCube,
    HiOutlineUsers,
    HiOutlineShoppingBag,
    HiOutlineLogout,
    HiOutlineMenu,
    HiOutlineX,
    HiOutlineChartBar
} from 'react-icons/hi';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/admin', icon: HiOutlineChartBar },
        { name: 'Products', path: '/admin/products', icon: HiOutlineCube },
        { name: 'Orders', path: '/admin/orders', icon: HiOutlineShoppingBag },
        { name: 'Users', path: '/admin/users', icon: HiOutlineUsers },
    ];

    const isActive = (path: string) => {
        if (path === '/admin') {
            return location.pathname === '/admin';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <div className="min-h-screen bg-background text-text-primary flex dark">
            {/* Sidebar Desktop */}
            <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-background-card fixed h-full z-30">
                <div className="p-6 border-b border-border">
                    <Link to="/" className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-accent font-heading tracking-wide">ES Admin</span>
                    </Link>
                </div>

                <div className="px-4 py-2 border-b border-border bg-background-secondary/50">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                            {user?.firstName?.charAt(0) || 'A'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium truncate">{user ? `${user.firstName} ${user.lastName}` : 'Admin User'}</p>
                            <p className="text-xs text-text-muted truncate capitalize">{user?.role?.replace('_', ' ') || 'Admin'}</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link
                            key={`desktop-nav-${item.path}`}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive(item.path)
                                ? 'bg-accent text-white shadow-lg shadow-accent/20'
                                : 'text-text-secondary hover:bg-background-secondary hover:text-text-primary'
                                }`}
                        >
                            <item.icon size={20} />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-border">
                    <Link
                        to="/"
                        className="flex items-center gap-3 px-4 py-3 text-text-secondary hover:bg-background-secondary hover:text-text-primary rounded-xl transition-colors mb-1"
                    >
                        <HiOutlineHome size={20} />
                        <span className="font-medium">View Store</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                    >
                        <HiOutlineLogout size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-background-card border-b border-border px-4 py-3 flex items-center justify-between">
                <Link to="/admin" className="text-xl font-bold text-accent">ES Admin</Link>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 text-text-primary"
                >
                    {isSidebarOpen ? <HiOutlineX size={24} /> : <HiOutlineMenu size={24} />}
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSidebarOpen(false)}
                            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 bottom-0 w-64 bg-background-card border-r border-border z-50 lg:hidden flex flex-col"
                        >
                            <div className="p-6 border-b border-border flex justify-between items-center">
                                <span className="text-xl font-bold text-accent">Menu</span>
                                <button onClick={() => setIsSidebarOpen(false)}>
                                    <HiOutlineX size={24} className="text-text-secondary" />
                                </button>
                            </div>

                            <nav className="flex-1 p-4 space-y-1">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setIsSidebarOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive(item.path)
                                            ? 'bg-accent text-white'
                                            : 'text-text-secondary hover:bg-background-secondary'
                                            }`}
                                    >
                                        <item.icon size={20} />
                                        <span className="font-medium">{item.name}</span>
                                    </Link>
                                ))}
                            </nav>

                            <div className="p-4 border-t border-border">
                                <Link
                                    to="/"
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 text-text-secondary hover:bg-background-secondary rounded-xl transition-colors mb-1"
                                >
                                    <HiOutlineHome size={20} />
                                    <span className="font-medium">View Store</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                                >
                                    <HiOutlineLogout size={20} />
                                    <span className="font-medium">Logout</span>
                                </button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 lg:ml-64 p-4 lg:p-8 pt-20 lg:pt-8 min-h-screen">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
