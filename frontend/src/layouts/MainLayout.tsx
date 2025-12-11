import { Outlet } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';

const MainLayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <ScrollToTop />
            <Header />
            <main className="flex-1 pt-16">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;

