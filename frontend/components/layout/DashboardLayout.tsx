// ================================================================
// COMPONENT: DashboardLayout
// Reusable sidebar layout for Admin, Teacher, and Student portals
// Props:
//   - links: sidebar navigation links
//   - role: "admin" | "teacher" | "student"
//   - userName: logged-in user's display name
// Location: frontend/components/layout/DashboardLayout.tsx  
// ================================================================

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, Menu, X, LogOut, Bell } from "lucide-react";

interface SidebarLink {
    href: string;
    label: string;
    icon: React.ElementType;
}

interface DashboardLayoutProps {
    children: React.ReactNode;
    links: SidebarLink[];
    role: string;
    userName: string;
}

interface SidebarContentProps {
    links: SidebarLink[];
    role: string;
    userName: string;
    pathname: string;
    setIsMobileOpen: (open: boolean) => void;
}

const SidebarContent = ({ links, role, userName, pathname, setIsMobileOpen }: SidebarContentProps) => (
    <div className="h-full flex flex-col pt-6 pb-4">

        {/* Sidebar Header */}
        <div className="px-6 mb-8 flex items-center justify-between">
            <div className="flex items-center gap-2 group">
                <div className="bg-gradient-to-tr from-brand-pink to-brand-purple p-2 rounded-xl group-hover:neon-glow transition-all">
                    <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-heading font-extrabold text-white tracking-tight">
                    School<span className="text-gradient">Space</span>
                </span>
            </div>
            <button onClick={() => setIsMobileOpen(false)} className="md:hidden text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
            </button>
        </div>

        {/* User Info */}
        <div className="px-6 mb-8">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Signed in as</p>
            <p className="font-heading font-bold text-white capitalize">{userName}</p>
            <p className="text-sm text-brand-pink font-medium capitalize">{role} Portal</p>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
            {links.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                const Icon = link.icon;

                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive
                            ? "bg-gradient-to-r from-brand-pink/20 to-brand-purple/20 text-white border border-brand-pink/30 shadow-[0_0_15px_rgba(255,45,125,0.1)]"
                            : "text-gray-400 hover:text-white hover:bg-white/5"
                            }`}
                    >
                        <Icon className={`w-5 h-5 ${isActive ? "text-brand-pink" : ""}`} />
                        {link.label}
                    </Link>
                );
            })}
        </nav>

        {/* Logout */}
        <div className="px-4 mt-auto">
            <Link
                href="/login"
                className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
            >
                <LogOut className="w-5 h-5" />
                Logout
            </Link>
        </div>
    </div>
);

export function DashboardLayout({ children, links, role, userName }: DashboardLayoutProps) {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-background flex">

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed md:sticky top-0 left-0 h-screen w-72 glass border-r border-white/10 z-50 transition-transform duration-300 ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                }`}>
                <SidebarContent links={links} role={role} userName={userName} pathname={pathname} setIsMobileOpen={setIsMobileOpen} />
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-h-screen max-w-full overflow-hidden">

                {/* Top Header Bar */}
                <header className="h-20 glass border-b border-white/10 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-30 sticky top-0">
                    <button
                        onClick={() => setIsMobileOpen(true)}
                        className="md:hidden p-2 text-gray-400 hover:text-white rounded-lg bg-white/5"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="ml-auto flex items-center gap-4">
                        {/* Notification Bell */}
                        <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                            <Bell className="w-6 h-6" />
                            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-brand-pink rounded-full border border-card shadow-[0_0_10px_rgba(255,45,125,1)]" />
                        </button>

                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-pink to-brand-purple flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                            {userName.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
