import { Outlet } from "@tanstack/react-router";
import { TrendingUp, ShieldCheck, PieChart } from "lucide-react";

export default function AuthLayout() {
  return (
    <div className="h-full w-full bg-gray-50 flex overflow-hidden">
      {/* Left Side - Branding & Testimonials (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-900 text-white relative flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=2071&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-gray-900/90"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
             <div className="bg-primary/20 p-2 rounded-lg backdrop-blur-sm border border-primary/30">
               <img src="/wealth-builder-isologo.png" alt="Wealth Builder" className="w-8 h-8 object-contain brightness-0 invert" />
             </div>
             <span className="text-xl font-bold tracking-tight">Wealth Builder</span>
          </div>
          
          <h1 className="text-5xl font-extrabold leading-tight mb-6">
            Master your money,<br />
            <span className="text-primary">Build your future.</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-md">
            The AI-powered financial companion that helps you track, save, and grow your wealth with intelligent insights.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-6">
            <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-700">
                <TrendingUp className="text-primary mb-3" size={24} />
                <h3 className="font-bold text-sm mb-1">Smart Tracking</h3>
                <p className="text-xs text-gray-400">Automated expense categorization</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-700">
                <ShieldCheck className="text-primary mb-3" size={24} />
                <h3 className="font-bold text-sm mb-1">Secure & Private</h3>
                <p className="text-xs text-gray-400">Bank-level encryption for your data</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-700">
                <PieChart className="text-primary mb-3" size={24} />
                <h3 className="font-bold text-sm mb-1">Visual Insights</h3>
                <p className="text-xs text-gray-400">Beautiful charts and reports</p>
            </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 overflow-y-auto h-full">
        <div className="w-full max-w-md">
            <div className="lg:hidden text-center mb-8">
                <img src="/wealth-builder-isologo.png" alt="Wealth Builder" className="w-12 h-12 mx-auto mb-3" />
                <h2 className="text-2xl font-bold text-gray-900">Wealth Builder</h2>
            </div>
            <Outlet />
        </div>
      </div>
    </div>
  );
}
