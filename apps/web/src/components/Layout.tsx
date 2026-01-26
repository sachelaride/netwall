import React, { useState } from 'react';
import { Share2, Activity, Shield, Server, Box, Menu, X } from 'lucide-react';

export type Tab = 'dashboard' | 'devices' | 'network' | 'topology' | 'monitoring' | 'reports';

interface LayoutProps {
    children: React.ReactNode;
    currentTab: Tab;
    onNavigate: (tab: Tab) => void;
}

export function Layout({ children, currentTab, onNavigate }: LayoutProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleNavigate = (tab: Tab) => {
        onNavigate(tab);
        setIsMenuOpen(false);
    };

    return (
        <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
            {/* Overlay for mobile menu */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 p-4 transition-transform duration-300 lg:relative lg:translate-x-0
                ${isMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="flex items-center justify-between mb-8 px-2">
                    <div className="flex items-center gap-2">
                        <Shield className="w-8 h-8 text-blue-500" />
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                            Netwall
                        </span>
                    </div>
                    <button
                        onClick={() => setIsMenuOpen(false)}
                        className="p-2 hover:bg-slate-800 rounded-lg lg:hidden"
                    >
                        <X className="w-6 h-6 text-slate-400" />
                    </button>
                </div>

                <nav className="space-y-2">
                    <NavItem
                        icon={<Activity />}
                        label="Dashboard"
                        active={currentTab === 'dashboard'}
                        onClick={() => handleNavigate('dashboard')}
                    />
                    <NavItem
                        icon={<Server />}
                        label="Devices"
                        active={currentTab === 'devices'}
                        onClick={() => handleNavigate('devices')}
                    />
                    <NavItem
                        icon={<Box />}
                        label="Network Scan"
                        active={currentTab === 'network'}
                        onClick={() => handleNavigate('network')}
                    />
                    <NavItem
                        icon={<Share2 />}
                        label="Topology"
                        active={currentTab === 'topology'}
                        onClick={() => handleNavigate('topology')}
                    />
                    <NavItem
                        icon={<Activity />}
                        label="Monitoring"
                        active={currentTab === 'monitoring'}
                        onClick={() => handleNavigate('monitoring')}
                    />
                    <NavItem
                        icon={<Box />}
                        label="Reports"
                        active={currentTab === 'reports'}
                        onClick={() => handleNavigate('reports')}
                    />
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto p-4 lg:p-8">
                <header className="mb-8 flex justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="p-2 hover:bg-slate-800 rounded-lg lg:hidden"
                        >
                            <Menu className="w-6 h-6 text-slate-400" />
                        </button>
                        <div>
                            <h2 className="text-xl lg:text-2xl font-bold">Visão Geral</h2>
                            <p className="text-sm text-slate-400">Monitoramento em tempo real</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse my-auto"></div>
                        <span className="text-xs lg:text-sm text-green-500 font-medium my-auto">Sistema Online</span>
                    </div>
                </header>

                <div className="max-w-[1600px] mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}

function NavItem({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${active
                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                }`}>
            {React.cloneElement(icon as React.ReactElement, { size: 20 })}
            <span className="font-medium">{label}</span>
        </button>
    );
}
