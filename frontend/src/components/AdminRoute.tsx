import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import { UserRole } from '@/types';
import LoadingSpinner from './ui/LoadingSpinner';

const AdminRoute = () => {
    const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        // Redirect to login but save the attempted url
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check if user has admin role
    const userRole = user.role?.toLowerCase();
    const allowedRoles = [UserRole.ADMIN, UserRole.SUPER_ADMIN] as string[];

    console.log('AdminRoute: Checking Access', { isAuthenticated, role: user.role, userRole, allowed: allowedRoles.includes(userRole) });

    if (!allowedRoles.includes(userRole)) {
        console.log('AdminRoute: Access Denied');
        // Redirect to home if authenticated but not admin
        return <Navigate to="/" replace />;
    }

    console.log('AdminRoute: Access Granted, Rendering Outlet');
    return <Outlet />;
};

export default AdminRoute;
