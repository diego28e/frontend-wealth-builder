import {Outlet} from '@tanstack/react-router';
import {Sidebar} from '../components/dashboard/Sidebar';
import {Menu} from 'lucide-react';

export default function DashboardLayout() {
    return (
        <div className="h-full w-full bg-background-light flex overflow-hidden">
            {/* Sidebar - Fixed width, handled by component */}
            <Sidebar />
            
            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden h-full">
                
                {/* Mobile Header */}
                <header className="lg:hidden flex items-center justify-between p-4 bg-surface-light border-b border-border-color shrink-0">
                    <div className="flex items-center gap-2">
                         {/* Fallback to text or use a simple icon if image fails */}
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                             <img src="/wealth-builder-logo.png" alt="Wealth Builder" className="w-5 h-5 object-contain" />
                        </div>
                        <span className="font-bold text-text-main">Wealth Builder</span>
                    </div>
                    <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                        <Menu size={24} />
                    </button>
                </header>

                {/* Scrollable Page Content */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-4 md:p-8 max-w-7xl mx-auto pb-10">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    )
}