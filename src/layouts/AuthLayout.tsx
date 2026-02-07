import { Outlet } from "@tanstack/react-router";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img
            className="w-64 mx-auto"
            src="wealth-builder-isologo.png"
            alt="logo"
          />
          <p className="text-gray-600">Manage your finances with AI</p>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
