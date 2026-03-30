"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
    onLogout: () => void;
}

const SidebarContent = ({ links, role, userName, pathname, setIsMobileOpen, onLogout }: SidebarContentProps) => (
    <div className="h-full flex flex-col pt-6 pb-4">
        <div className="px-6 mb-8 flex items-center justify-between">
            <div className="flex items-center gap-2 group">
                <div className="bg-gradient-to-tr from-brand-green to-emerald-600 dark:from-brand-pink dark:to-brand-purple p-2 rounded-xl group-hover:neon-glow transition-all">
                    <GraduationCap className="w-6 h-6 text-foreground dark:text-white" />
                </div>
                <span className="text-xl font-heading font-extrabold text-foreground dark:text-foreground dark:text-white tracking-tight">
                    MMA <span className="text-brand-green dark:text-brand-pink">Madrasah</span>
                </span>
            </div>
            <button onClick={() => setIsMobileOpen(false)} className="md:hidden text-foreground/40 hover:text-foreground">
                <X className="w-6 h-6" />
            </button>
        </div>

        <div className="px-6 mb-8">
            <p className="text-xs font-bold text-foreground/40 uppercase tracking-wider mb-1">Signed in as</p>
            <p className="font-heading font-bold text-foreground dark:text-foreground dark:text-white capitalize">{userName}</p>
            <p className="text-sm text-brand-green dark:text-brand-pink font-medium capitalize">{role} Portal</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
            {links.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                const Icon = link.icon;

                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive
                            ? "bg-gradient-to-r from-brand-green/10 to-brand-green/20 dark:from-brand-pink/20 dark:to-brand-purple/20 text-brand-green dark:text-foreground dark:text-white border border-brand-green/20 dark:border-brand-pink/30 shadow-[0_0_15px_rgba(16,185,129,0.05)] dark:shadow-[0_0_15px_rgba(255,45,125,0.1)]"
                            : "text-foreground/40 hover:text-foreground hover:bg-background/5 dark:hover:bg-foreground/5 dark:bg-white/5"
                            }`}
                    >
                        <Icon className={`w-5 h-5 ${isActive ? "text-brand-green dark:text-brand-pink" : ""}`} />
                        {link.label}
                    </Link>
                );
            })}
        </nav>

        <div className="px-4 mt-auto">
            <button
                type="button"
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20 text-left"
            >
                <LogOut className="w-5 h-5" />
                Logout
            </button>
        </div>
    </div>
);

export function DashboardLayout({ children, links, role, userName }: DashboardLayoutProps) {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        try {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        } catch {
            /* ignore */
        }
        router.push("/login");
    };

    return (
        <div className="min-h-screen bg-background flex">
            {/* Mobile Sidebar Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-foreground/10 dark:bg-background/80 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Pure Tailwind Sidebar alternative to avoid framer-motion inline style conflicts on resize */}
            <aside className={`fixed md:sticky top-0 left-0 h-screen w-72 glass border-r border-border z-50 transition-transform duration-300 ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
                <SidebarContent
                    links={links}
                    role={role}
                    userName={userName}
                    pathname={pathname}
                    setIsMobileOpen={setIsMobileOpen}
                    onLogout={handleLogout}
                />
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-h-screen max-w-full overflow-hidden">
                {/* Top Header */}
                <header className="h-20 glass border-b border-border flex items-center justify-between px-4 sm:px-6 lg:px-8 z-30 sticky top-0">
                    <button
                        onClick={() => setIsMobileOpen(true)}
                        className="md:hidden p-2 text-foreground/40 hover:text-foreground rounded-lg bg-background/5 dark:bg-foreground/5 dark:bg-white/5"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="ml-auto flex items-center gap-4">
                        <button className="relative p-2 text-foreground/40 hover:text-foreground transition-colors">
                            <Bell className="w-6 h-6" />
                            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-brand-green dark:bg-brand-pink rounded-full border border-card shadow-[0_0_10px_rgba(255,45,125,0.4)]" />
                        </button>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-green to-emerald-600 dark:from-brand-pink dark:to-brand-purple flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(16,185,129,0.2)] dark:shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                            {userName.charAt(0)}
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
