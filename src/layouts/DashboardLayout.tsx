import {Outlet} from '@tanstack/react-router';
import {Sidebar} from '../components/dashboard/Sidebar';
import {Menu, PiggyBank} from 'lucide-react';

export default function DashboardLayout() {
    return (
        <div className="bg-background-light min-h-screen flex overflow-hidden">
            <Sidebar />
            <main className="flex-1 flex-col h-screen overflow-hidden">
            {/* Mobile Header */}
            <header className="flex lg:hidden items-center justify-between p-4 border-b border-border-color bg-surface-light sticky top-0 z-20">
                          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <PiggyBank size={20} className="text-white" />
            </div>
            <span className="font-bold text-text-main">Wealth Builder</span>
          </div>
                <button className="p-2 rounded-lg hover:bg-gray-100">
                    <Menu size={24} />
                </button>
            </header>
            <div className='flex-1 overflow-y-auto p-4 md:p-8'>
                <div className="max-w-7xl mx-auto space-y-8 pb-12">
                    <Outlet />
                </div>
            </div>
            </main>
        </div>
    )
}