"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, GraduationCap, Search, Mail, BookOpen } from "lucide-react";
import { SectionTitle } from "@/components/ui/SectionTitle";

interface Teacher {
  id: string;
  specialization: string | null;
  photoUrl: string | null;
  bio: string | null;
  qualifications: string | null;
  experience: string | null;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export default function FacultiesPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

  useEffect(() => {
    const loadTeachers = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/teachers/public?page=${page}&limit=12`);
        const data = await res.json();
        if (data.success) {
          setTeachers(data.data);
          setTotalPages(Math.ceil(data.pagination.total / data.pagination.limit));
        }
      } catch (err) {
        console.error("Failed to load teachers", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadTeachers();
  }, [page, API_BASE_URL]);

  const filteredTeachers = teachers.filter((t) =>
    t.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.specialization?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pt-24">
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <section className="bg-foreground/5 py-16 border-b border-border text-center">
          <SectionTitle title="Our [gradient]Faculties" subtitle="Meet the Experts" />
          <p className="mt-4 text-foreground/60 max-w-2xl mx-auto px-4">
            Meet the exceptional individuals who inspire and guide our students every day. 
            Dedicated to academic excellence and nurturing future leaders.
          </p>

          <div className="mt-10 max-w-md mx-auto px-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40 group-focus-within:text-brand-purple transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or subject..."
                className="w-full bg-white dark:bg-card border-none rounded-full py-4 pl-12 pr-6 text-sm text-foreground placeholder:text-foreground/40 shadow-md ring-1 ring-border focus:ring-2 focus:ring-brand-purple focus:outline-none transition-all"
              />
            </div>
          </div>
        </section>

        {/* Teachers Grid */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex-1">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <span className="w-10 h-10 border-4 border-brand-purple border-t-transparent rounded-full animate-spin"></span>
            </div>
          ) : filteredTeachers.length === 0 ? (
            <div className="text-center py-20 bg-background/50 border border-border rounded-3xl backdrop-blur-sm">
              <Users className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-foreground mb-1">No faculties found</h3>
              <p className="text-foreground/60">Try adjusting your search terms.</p>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {filteredTeachers.map((teacher) => (
                <motion.div
                  key={teacher.id}
                  variants={fadeIn}
                  whileHover={{ y: -5 }}
                  className="group bg-card border border-border rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-brand-purple/10 hover:border-brand-purple/20 transition-all duration-300 flex flex-col"
                >
                  <div className="aspect-square bg-foreground/5 relative overflow-hidden">
                    {teacher.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={teacher.photoUrl.startsWith("http") ? teacher.photoUrl : `${API_BASE_URL}${teacher.photoUrl}`}
                        alt={teacher.user.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-brand-pink/10 to-brand-purple/10">
                        <UserPlaceholder name={teacher.user.name} />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 flex flex-col flex-1">
                    <h4 className="text-xl font-bold font-heading text-foreground mb-1">
                      {teacher.user.name}
                    </h4>
                    
                    {teacher.specialization && (
                      <p className="text-brand-purple text-sm font-semibold mb-4 bg-brand-purple/10 w-fit px-3 py-1 rounded-full border border-brand-purple/20">
                        {teacher.specialization}
                      </p>
                    )}

                    <div className="space-y-2 mt-auto">
                      {teacher.qualifications && (
                        <div className="flex items-start gap-2 text-sm text-foreground/70">
                          <GraduationCap className="w-4 h-4 text-foreground/40 mt-0.5 shrink-0" />
                          <span className="line-clamp-2">{teacher.qualifications}</span>
                        </div>
                      )}
                      {teacher.experience && (
                        <div className="flex items-start gap-2 text-sm text-foreground/70">
                          <BookOpen className="w-4 h-4 text-foreground/40 mt-0.5 shrink-0" />
                          <span className="line-clamp-1">{teacher.experience}</span>
                        </div>
                      )}
                      <div className="flex items-start gap-2 text-sm text-foreground/70 group-hover:text-foreground/90 transition-colors">
                        <Mail className="w-4 h-4 text-foreground/40 mt-0.5 shrink-0 group-hover:text-brand-pink transition-colors" />
                        <span className="truncate">{teacher.user.email}</span>
                      </div>
                    </div>

                    {teacher.bio && (
                      <div className="mt-6 pt-4 border-t border-border">
                        <p className="text-sm text-foreground/60 italic line-clamp-3">"{teacher.bio}"</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && !isLoading && (
            <div className="flex justify-center items-center gap-2 mt-16">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-xl border border-border bg-card text-sm font-semibold disabled:opacity-50 hover:bg-foreground/5 transition-colors"
              >
                Previous
              </button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                      page === i + 1 
                        ? "bg-brand-purple text-white shadow-md shadow-brand-purple/20" 
                        : "bg-card border border-border text-foreground hover:bg-foreground/5"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-xl border border-border bg-card text-sm font-semibold disabled:opacity-50 hover:bg-foreground/5 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function UserPlaceholder({ name }: { name: string }) {
  const init = name.substring(0, 2).toUpperCase();
  return (
    <div className="text-4xl font-black text-brand-purple/30 tracking-widest">{init}</div>
  );
}
