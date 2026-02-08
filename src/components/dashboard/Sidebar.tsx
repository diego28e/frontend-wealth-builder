import { Link, useLocation } from "@tanstack/react-router";
import {LayoutDashboard, Home, TrendingUp, Settings, PiggyBank} from 'lucide-react';

export function Sidebar() {
    const location = useLocation(); 

    const navItems = [
        {to: '/', icon:Home, label: 'Home'},
        {to: '/dashboard', icon:LayoutDashboard, label: 'Dashboard'}
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
        </aside>
    )
}

