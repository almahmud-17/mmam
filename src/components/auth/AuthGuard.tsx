"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function AuthGuard({
  allowedRoles,
  children,
}: {
  allowedRoles: string[];
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    let role: string | undefined;
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      role = u?.role;
    } catch {
      role = undefined;
    }

    if (!token || !role || !allowedRoles.includes(role)) {
      router.replace("/login");
      return;
    }
    setReady(true);
  }, [router, allowedRoles]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 text-brand-pink animate-spin" aria-label="Loading" />
      </div>
    );
  }

  return <>{children}</>;
}
