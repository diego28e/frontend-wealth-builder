import { Link, useLocation } from "@tanstack/react-router";
import {LayoutDashboard, Home, Receipt, Target, Wallet, PiggyBank, LogOut} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function Sidebar() {
    const location = useLocation(); 
    const { user, logout } = useAuth();

    const navItems = [
        {to: '/', icon:Home, label: 'Home'},
        {to: '/dashboard', icon:LayoutDashboard, label: 'Dashboard'},
        {to: '/transactions', icon:Receipt, label: 'Transactions'},
        {to: '/accounts', icon:Wallet, label: 'Accounts'},
        {to: '/goals', icon:Target, label: 'Goals'},
    ]

    return (
        <aside className="hidden lg:flex flex-col w-64 bg-surface-light border-r border-border-color h-screen sticky top-0">
            <div className="p-6 border-b border-border-color">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                        <PiggyBank className="mx-auto" size={24} />
                    </div>
                    <span className="font-bold text-xl text-text-main"> Wealth Builder</span>
                </div>

            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item)=> {
                    const isActive = location.pathname === item.to;
                    const Icon = item.icon;
                    return (
                        <Link
                        key={item.to}
                        to={item.to}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-primary hover:text-primary-foreground ${isActive ? 'bg-primary text-white' : 'text-text-secondary hover:bg-gray-100'}`}>
                        <Icon size={20} />
                        <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
            {/* User Info & Logout */}
      <div className="p-4 border-t border-border-color">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-primary font-bold text-sm">
              {user?.first_name?.[0]}{user?.last_name?.[0]}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-main truncate">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-xs text-text-secondary truncate">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center justify-center p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0 cursor-pointer"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
        </aside>
    )
}

