import {useEffect} from 'react';
import {useNavigate} from '@tanstack/react-router';
import {useAuth} from '../contexts/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export function ProtectedRoute({children}: ProtectedRouteProps) {
    const {user, isLoading} = useAuth();
    const navigate = useNavigate();

    useEffect(()=> {
        if (!isLoading && !user) {
            navigate({to:'/login'});
        }
    }, [user,isLoading, navigate]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }
    return <>{children}</>;
}
