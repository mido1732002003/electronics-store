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

                {/* Admin Routes */}
                {/* Admin Routes - Protected and Suspense Wrapped */}
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
                        {/* TODO: Add Orders and Users pages when ready, currently they were missing in the debug block but present in original file? 
                             Wait, I need to check the ORIGINAL file content from step 19 to see what was there.
                             Original had: 
                             <Route path="/admin" element={<AdminLayout />}>
                                <Route index element={<AdminDashboardPage />} />
                                <Route path="products" element={<AdminProductsPage />} />
                             </Route>
                             The user said "orders, users are 404".
                             Looking at the screenshot sidebar, there are links to "Orders" and "Users".
                             But in the Original App.tsx (Step 19), lines 230-233 ONLY had Dashboard and Products!
                             
                             <Route path="/admin" element={<AdminLayout />}>
                                <Route index element={<AdminDashboardPage />} />
                                <Route path="products" element={<AdminProductsPage />} />
                             </Route>
                             
                             So they were ALWAYS missing. I need to add routes for Orders and Users.
                         */}
                        <Route
                            path="orders"
                            element={
                                <div className="p-8 text-center text-text-secondary">
                                    <h2 className="text-2xl font-bold">Orders Management</h2>
                                    <p>Coming Soon</p>
                                </div>
                            }
                        />
                        <Route
                            path="users"
                            element={
                                <div className="p-8 text-center text-text-secondary">
                                    <h2 className="text-2xl font-bold">User Management</h2>
                                    <p>Coming Soon</p>
                                </div>
                            }
                        />
                    </Route>
                </Route>
            </Routes>
            <Toaster position="top-right" reverseOrder={false} />
        </>
    );
}

export default App;
