"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LayoutDashboard, Users, UserCog, Layers, Settings } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const links = [
        { href: "/admin", label: "Dashboard Overview", icon: LayoutDashboard },
        { href: "/admin/students", label: "Manage Students", icon: Users },
        { href: "/admin/teachers", label: "Manage Teachers", icon: UserCog },
        { href: "/admin/classes", label: "Classes & Subjects", icon: Layers },
        { href: "/admin/settings", label: "System Settings", icon: Settings },
    ];

    return (
        <DashboardLayout links={links} role="admin" userName="System Administrator">
            {children}
        </DashboardLayout>
    );
}
