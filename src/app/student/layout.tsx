"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LayoutDashboard, Calendar, FileText, UserCircle } from "lucide-react";

export default function StudentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const links = [
        { href: "/student", label: "Dashboard Overview", icon: LayoutDashboard },
        { href: "/student/attendance", label: "My Attendance", icon: Calendar },
        { href: "/student/results", label: "Exam Results", icon: FileText },
        { href: "/student/profile", label: "My Profile", icon: UserCircle },
    ];

    return (
        <DashboardLayout links={links} role="student" userName="John Doe">
            {children}
        </DashboardLayout>
    );
}
