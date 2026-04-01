"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AuthGuard } from "@/components/auth/AuthGuard";
import {
  LayoutDashboard,
  Users,
  UserCog,
  Layers,
  Settings,
  MessageSquare,
  Image as ImageIcon,
  Bell,
  Globe2,
  CalendarDays,
  CalendarRange,
  KeyRound,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userName, setUserName] = useState("Administrator");

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      if (u?.name) setUserName(u.name);
    } catch {
      /* ignore */
    }
  }, []);

  const links = [
    { href: "/admin", label: "Dashboard Overview", icon: LayoutDashboard },
    { href: "/admin/students", label: "Manage Students", icon: Users },
    { href: "/admin/teachers", label: "Manage Teachers", icon: UserCog },
    { href: "/admin/notices", label: "Notices & News", icon: Bell },
    { href: "/admin/events", label: "Events & Calendar", icon: CalendarDays },
    { href: "/admin/routine", label: "Class Routine", icon: CalendarRange },
    { href: "/admin/website", label: "Website Content", icon: Globe2 },
    { href: "/admin/gallery", label: "Gallery Media", icon: ImageIcon },
    { href: "/admin/messages", label: "Inquiries", icon: MessageSquare },
    { href: "/admin/settings", label: "Password Settings", icon: KeyRound },
  ];

  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <DashboardLayout links={links} role="admin" userName={userName}>
        {children}
      </DashboardLayout>
    </AuthGuard>
  );
}
