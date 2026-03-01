"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LayoutDashboard, Users, UserCog, Layers, Settings, MessageSquare, Image as ImageIcon, Bell } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const links = [
        { href: "/admin", label: "Dashboard Overview", icon: LayoutDashboard },
        { href: "/admin/students", label: "Manage Students", icon: Users },
        { href: "/admin/teachers", label: "Manage Teachers", icon: UserCog },
        { href: "/admin/notices", label: "Notices & News", icon: Bell },
        { href: "/admin/gallery", label: "Gallery Media", icon: ImageIcon },
        { href: "/admin/classes", label: "Classes & Subjects", icon: Layers },
        { href: "/admin/messages", label: "Inquiries", icon: MessageSquare },
        { href: "/admin/settings", label: "System Settings", icon: Settings },
    ];

    return (
        <DashboardLayout links={links} role="admin" userName="System Administrator">
            {children}
        </DashboardLayout>
    );
}
