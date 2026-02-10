
import { Link, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, Receipt, Target, Wallet, LogOut, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const location = useLocation(); 
    const { user, logout } = useAuth();

    const navItems = [
        {to: '/dashboard', icon:LayoutDashboard, label: 'Dashboard'},
        {to: '/transactions', icon:Receipt, label: 'Transactions'},
        {to: '/accounts', icon:Wallet, label: 'Accounts'},
        {to: '/goals', icon:Target, label: 'Goals'},
    ]

    return (
        <>
            {/* Mobile Backdrop */}
            <div 
                className={`fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
                    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Sidebar Panel */}
            <aside className={`
                fixed lg:sticky top-0 left-0 z-50 h-full w-64 bg-surface-light border-r border-border-color flex flex-col 
                transition-transform duration-300 ease-in-out shadow-xl lg:shadow-none
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Header */}
                <div className="p-6 border-b border-border-color flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="/wealth-builder-logo.png" alt="Wealth Builder" className="w-10 h-10 object-contain" />
                        <span className="font-bold text-xl text-text-main"> Wealth Builder</span>
                    </div>
                    {/* Close button for mobile */}
                    <button 
                        onClick={onClose}
                        className="p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 lg:hidden transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems.map((item)=> {
                        const isActive = location.pathname === item.to;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.to}
                                to={item.to}
                                onClick={onClose} // Close sidebar on navigation (mobile)
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                                    isActive 
                                    ? 'bg-primary text-white shadow-lg shadow-primary/25 font-semibold' 
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium'
                                }`}
                            >
                                <Icon size={20} className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-primary transition-colors'} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* User Info & Logout */}
                <div className="p-4 border-t border-border-color bg-gray-50/50">
                    <div className="flex items-center gap-3 p-2 rounded-xl border border-transparent hover:border-gray-200 hover:bg-white transition-all">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-bold shadow-sm border border-primary/20">
                            {user?.first_name?.[0]}{user?.last_name?.[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">
                            {user?.first_name} {user?.last_name}
                            </p>
                            <p className="text-xs text-text-secondary truncate font-medium">{user?.email}</p>
                        </div>
                        <button
                            onClick={logout}
                            className="flex items-center justify-center p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0 cursor-pointer"
                            title="Logout"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </aside>
        </>
    )
}

