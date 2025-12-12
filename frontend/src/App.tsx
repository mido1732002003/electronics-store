import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MainLayout from './layouts/MainLayout';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const ProfilePage = lazy(() => import('./pages/account/ProfilePage'));
const OrdersPage = lazy(() => import('./pages/account/OrdersPage'));
const WishlistPage = lazy(() => import('./pages/account/WishlistPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Info pages
const AboutPage = lazy(() => import('./pages/info/InfoPage').then(m => ({ default: m.AboutPage })));
const CareersPage = lazy(() => import('./pages/info/InfoPage').then(m => ({ default: m.CareersPage })));
const BlogPage = lazy(() => import('./pages/info/InfoPage').then(m => ({ default: m.BlogPage })));
const ContactPage = lazy(() => import('./pages/info/InfoPage').then(m => ({ default: m.ContactPage })));
const FAQsPage = lazy(() => import('./pages/info/InfoPage').then(m => ({ default: m.FAQsPage })));
const ShippingPage = lazy(() => import('./pages/info/InfoPage').then(m => ({ default: m.ShippingPage })));
const ReturnsPage = lazy(() => import('./pages/info/InfoPage').then(m => ({ default: m.ReturnsPage })));
const WarrantyPage = lazy(() => import('./pages/info/InfoPage').then(m => ({ default: m.WarrantyPage })));
const PrivacyPage = lazy(() => import('./pages/info/InfoPage').then(m => ({ default: m.PrivacyPage })));
const TermsPage = lazy(() => import('./pages/info/InfoPage').then(m => ({ default: m.TermsPage })));

// Admin Pages (Static Imports)
import AdminLayout from './layouts/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminRoute from './components/AdminRoute';

const PageLoader = () => (
    <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
    </div>
);

function App() {
    console.log('App: Rendering');
    return (
        <>
            <Routes>
                {/* Admin Routes - Protected and Suspense Wrapped */}
                {/* Placed BEFORE MainLayout to avoid falling into catch-all or default structure issues */}
                <Route
                    element={
                        <Suspense fallback={<PageLoader />}>
                            <AdminRoute />
                        </Suspense>
                    }
                >
                    <Route
                        path="/admin"
                        element={
                            <Suspense fallback={<PageLoader />}>
                                <AdminLayout />
                            </Suspense>
                        }
                    >
                        <Route
                            index
                            element={
                                <Suspense fallback={<PageLoader />}>
                                    <AdminDashboardPage />
                                </Suspense>
                            }
                        />
                        <Route
                            path="products"
                            element={
                                <Suspense fallback={<PageLoader />}>
                                    <AdminProductsPage />
                                </Suspense>
                            }
                        />
                        <Route
                            path="orders"
                            element={
                                <Suspense fallback={<PageLoader />}>
                                    <AdminOrdersPage />
                                </Suspense>
                            }
                        />
                        <Route
                            path="users"
                            element={
                                <Suspense fallback={<PageLoader />}>
                                    <AdminUsersPage />
                                </Suspense>
                            }
                        />
                    </Route>
                </Route>

                <Route path="/" element={<MainLayout />}>
                    <Route
                        index
                        element={
                            <Suspense fallback={<PageLoader />}>
                                <HomePage />
                            </Suspense>
                        }
                    />
                    <Route
                        path="products"
                        element={
                            <Suspense fallback={<PageLoader />}>
                                <ProductsPage />
                            </Suspense>
                        }
                    />
                    <Route
                        path="products/:slug"
                        element={
                            <Suspense fallback={<PageLoader />}>
                                <ProductDetailPage />
                            </Suspense>
                        }
                    />
                    <Route
                        path="cart"
                        element={
                            <Suspense fallback={<PageLoader />}>
                                <CartPage />
                            </Suspense>
                        }
                    />
                    <Route
                        path="checkout"
                        element={
                            <Suspense fallback={<PageLoader />}>
                                <CheckoutPage />
                            </Suspense>
                        }
                    />
                    <Route
                        path="login"
                        element={
                            <Suspense fallback={<PageLoader />}>
                                <LoginPage />
                            </Suspense>
                        }
                    />
                    <Route
                        path="register"
                        element={
                            <Suspense fallback={<PageLoader />}>
                                <RegisterPage />
                            </Suspense>
                        }
                    />
                    <Route
                        path="account/profile"
                        element={
                            <Suspense fallback={<PageLoader />}>
                                <ProfilePage />
                            </Suspense>
                        }
                    />
                    <Route
                        path="account/orders"
                        element={
                            <Suspense fallback={<PageLoader />}>
                                <OrdersPage />
                            </Suspense>
                        }
                    />
                    <Route
                        path="account/wishlist"
                        element={
                            <Suspense fallback={<PageLoader />}>
                                <WishlistPage />
                            </Suspense>
                        }
                    />

                    {/* Company Pages */}
                    <Route
                        path="about"
                        element={
                            <Suspense fallback={<PageLoader />}>
                                <AboutPage />
                            </Suspense>
                        }
                    />
                    <Route
                        path="careers"
                        element={
                            <Suspense fallback={<PageLoader />}>
                                <CareersPage />
                            </Suspense>
                        }
                    />
                    <Route
                        path="blog"
                        element={
                            <Suspense fallback={<PageLoader />}>
                                <BlogPage />
                            </Suspense>
                        }
                    />
                    <Route
                        path="contact"
                        element={
                            <Suspense fallback={<PageLoader />}>
                                <ContactPage />
                            </Suspense>
                        }
                    />

                    {/* Support Pages */}
                    <Route
                        path="faqs"
                        element={
                            <Suspense fallback={<PageLoader />}>
                                <FAQsPage />
                            </Suspense>
                        }
                    />
                    <Route
                        path="shipping"
                        element={
                            <Suspense fallback={<PageLoader />}>
                                <ShippingPage />
                            </Suspense>
                        }
                    />
                    <Route
                        path="returns"
                        element={
                            <Suspense fallback={<PageLoader />}>
                                <ReturnsPage />
                            </Suspense>
                        }
                    />
                    <Route
                        path="warranty"
                        element={
                            <Suspense fallback={<PageLoader />}>
                                <WarrantyPage />
                            </Suspense>
                        }
                    />

                    {/* Legal Pages */}
                    <Route
                        path="privacy"
                        element={
                            <Suspense fallback={<PageLoader />}>
                                <PrivacyPage />
                            </Suspense>
                        }
                    />
                    <Route
                        path="terms"
                        element={
                            <Suspense fallback={<PageLoader />}>
                                <TermsPage />
                            </Suspense>
                        }
                    />

                    {/* 404 */}
                    <Route
                        path="*"
                        element={
                            <Suspense fallback={<PageLoader />}>
                                <NotFoundPage />
                            </Suspense>
                        }
                    />
                </Route>
            </Routes>
            <Toaster position="top-right" reverseOrder={false} />
        </>
    );
}

export default App;
