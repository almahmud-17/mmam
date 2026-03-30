"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { LayoutDashboard, Users, PenTool, UserCircle, Bell, Image as ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userName, setUserName] = useState("Teacher");

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      if (u?.name) setUserName(u.name);
    } catch {
      /* ignore */
    }
  }, []);

  const links = [
    { href: "/teacher", label: "Dashboard Overview", icon: LayoutDashboard },
    { href: "/teacher/attendance", label: "Attendance Entry", icon: Users },
    { href: "/teacher/marks", label: "Manage Marks", icon: PenTool },
    { href: "/teacher/notices", label: "Notices & News", icon: Bell },
    { href: "/teacher/gallery", label: "Gallery Media", icon: ImageIcon },
    { href: "/teacher/profile", label: "My Profile", icon: UserCircle },
  ];

  return (
    <AuthGuard allowedRoles={["TEACHER"]}>
      <DashboardLayout links={links} role="teacher" userName={userName}>
        {children}
      </DashboardLayout>
    </AuthGuard>
  );
}
