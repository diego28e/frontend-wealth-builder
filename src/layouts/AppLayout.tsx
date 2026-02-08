import { Link, Outlet } from "@tanstack/react-router";
import {useAuth} from '../contexts/AuthContext';

export default function AppLayout() {
  const {user, isLoading, logout} = useAuth();

  const handleLogout = async ()=> {
    await logout();
    window.location.href = '/login';
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-2xl font-bold text-emerald-600">
                <img
                  className="w-64 mx-auto"
                  src="wealth-builder-isologo.png"
                  alt="logo"
                />
              </Link>
              <div className="hidden md:flex space-x-4">
                <Link
                  to="/"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50"
                >
                  Home
                </Link>
                <Link
                  to="/dashboard"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50"
                >
                  Dashboard
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50"
                >
                  Register
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              {user && (
                <span className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600">
                  {user.first_name} {user.last_name}
                </span>
              )}
              <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50 cursor-pointer">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
