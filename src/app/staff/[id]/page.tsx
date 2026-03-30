"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import { GraduationCap, Mail, Phone, BookOpen } from "lucide-react";

type Staff = {
  id: string;
  name: string;
  role: string;
  bio?: string | null;
  imageUrl?: string | null;
  isHead: boolean;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export default function StaffProfilePage() {
  const params = useParams<{ id: string }>();
  const staffId = params?.id;

  const [staff, setStaff] = useState<Staff | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!staffId) return;
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/staff/${staffId}`);
        const data = await res.json();
        if (data.success) {
          setStaff(data.data);
        } else {
          setStaff(null);
        }
      } catch {
        setStaff(null);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [staffId]);

  if (!staff && !isLoading) {
    notFound();
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto glass rounded-[2.5rem] border border-foreground/15 dark:border-white/10 p-6 md:p-10 flex flex-col md:flex-row gap-8">
        {/* Photo */}
        <div className="md:w-1/3 flex flex-col items-center">
          <div className="w-40 h-40 rounded-3xl bg-gradient-to-tr from-brand-pink to-brand-purple p-[2px] shadow-[0_0_40px_rgba(168,85,247,0.4)] overflow-hidden">
            <div className="w-full h-full rounded-[1.3rem] bg-card flex items-center justify-center overflow-hidden">
              {staff?.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={staff.imageUrl} alt={staff.name} className="w-full h-full object-cover" />
              ) : (
                <GraduationCap className="w-14 h-14 text-foreground dark:text-white/40" />
              )}
            </div>
          </div>
          {staff?.isHead && (
            <span className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-brand-pink/10 border border-brand-pink/30 text-[11px] font-bold uppercase tracking-[0.25em] text-brand-pink">
              Head of Institution
            </span>
          )}
        </div>

        {/* Info */}
        <div className="md:w-2/3 space-y-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-foreground dark:text-white">
              {staff?.name || "Loading..."}
            </h1>
            <p className="text-brand-purple text-sm font-semibold mt-1">
              {staff?.role}
            </p>
          </div>

          {staff?.bio && (
            <div className="space-y-1">
              <h2 className="text-sm font-heading font-semibold text-foreground dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-brand-pink" />
                Short Bio
              </h2>
              <p className="text-sm text-foreground/70 dark:text-gray-300 font-bangla leading-relaxed whitespace-pre-wrap">
                {staff.bio}
              </p>
            </div>
          )}

          {/* Placeholder contact / extra info sections for future */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-foreground/70 dark:text-gray-300">
            <div className="space-y-1">
              <h3 className="text-xs font-heading font-semibold text-foreground/60 dark:text-gray-400 uppercase tracking-[0.25em]">
                Contact (Admin configurable later)
              </h3>
              <p className="flex items-center gap-2 text-foreground/60 dark:text-gray-400">
                <Mail className="w-4 h-4 text-foreground/50 dark:text-gray-500" />
                <span className="text-xs">Email information coming from main teacher account.</span>
              </p>
              <p className="flex items-center gap-2 text-foreground/60 dark:text-gray-400">
                <Phone className="w-4 h-4 text-foreground/50 dark:text-gray-500" />
                <span className="text-xs">Phone number controlled from Manage Teachers.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

