import { Outlet } from '@tanstack/react-router';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-emerald-600 mb-2">WealthBuilder</h1>
          <p className="text-gray-600">Manage your finances with AI</p>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
