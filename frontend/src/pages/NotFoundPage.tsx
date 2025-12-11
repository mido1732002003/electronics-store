import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

const NotFoundPage = () => {
    return (
        <>
            <Helmet>
                <title>404 - Page Not Found | Electronics Store</title>
            </Helmet>

            <div className="min-h-[70vh] flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <h1 className="text-9xl font-bold text-primary-600 mb-4">404</h1>
                    <h2 className="text-3xl font-bold text-dark-900 dark:text-white mb-4 font-heading">Page Not Found</h2>
                    <p className="text-dark-500 mb-8 max-w-md mx-auto">
                        The page you're looking for doesn't exist or has been moved. Let's get you back on track.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link to="/">
                            <Button size="lg">Go Home</Button>
                        </Link>
                        <Link to="/products">
                            <Button variant="outline" size="lg">Browse Products</Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </>
    );
};

export default NotFoundPage;
