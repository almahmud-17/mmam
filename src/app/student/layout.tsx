"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { LayoutDashboard, Calendar, FileText, UserCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userName, setUserName] = useState("Student");

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      if (u?.name) setUserName(u.name);
    } catch {
      /* ignore */
    }
  }, []);

  const links = [
    { href: "/student", label: "Dashboard Overview", icon: LayoutDashboard },
    { href: "/student/attendance", label: "My Attendance", icon: Calendar },
    { href: "/student/results", label: "Exam Results", icon: FileText },
    { href: "/student/profile", label: "My Profile", icon: UserCircle },
  ];

  return (
    <AuthGuard allowedRoles={["STUDENT"]}>
      <DashboardLayout links={links} role="student" userName={userName}>
        {children}
      </DashboardLayout>
    </AuthGuard>
  );
}
