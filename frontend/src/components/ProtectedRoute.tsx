import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import useAuth from '../hooks/useAuth';

interface ProtectedRouteProps {
    children: ReactNode;
    redirectPath?: string;
}

const ProtectedRoute = ({
    children,
    redirectPath = '/login'
}: ProtectedRouteProps) => {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return <div className="h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!currentUser) {
        return <Navigate to={redirectPath} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
