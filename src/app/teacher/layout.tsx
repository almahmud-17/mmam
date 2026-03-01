"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LayoutDashboard, Users, PenTool, UserCircle } from "lucide-react";

export default function TeacherLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const links = [
        { href: "/teacher", label: "Dashboard Overview", icon: LayoutDashboard },
        { href: "/teacher/attendance", label: "Attendance Entry", icon: Users },
        { href: "/teacher/marks", label: "Manage Marks", icon: PenTool },
        { href: "/teacher/profile", label: "My Profile", icon: UserCircle },
    ];

    return (
        <DashboardLayout links={links} role="teacher" userName="Mr. Rafiqul Islam">
            {children}
        </DashboardLayout>
    );
}
