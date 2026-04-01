"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Users, BookOpen, Trophy, ArrowRight, CheckCircle2, Mail, MapPin, Phone, Facebook } from "lucide-react";
import Link from "next/link";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { HomeFloatingLayer } from "@/components/home/HomeFloatingLayer";

export default function Home() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  return (
    <div className="flex flex-col min-h-screen pb-36 md:pb-40">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-pink/20 rounded-full blur-[120px] -z-10 pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-purple/20 rounded-full blur-[120px] -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center lg:text-left"
          >
            <motion.h1
              variants={fadeIn}
              className="text-4xl md:text-6xl font-sans font-black tracking-tight text-brand-purple leading-[1.2] mb-6 mt-10"
            >
              মহিষাবান এম আলিম মাদরাসায় <br />
              <span className="text-gradient drop-shadow-[0_0_15px_rgba(255,45,125,0.3)]">
                আপনাকে স্বাগতম
              </span>
            </motion.h1>

            <motion.p
              variants={fadeIn}
              className="text-lg md:text-xl text-foreground/70 mb-8 max-w-2xl mx-auto lg:mx-0 font-bangla"
            >
              একটি স্মার্ট ও আধুনিক ডিজিটাল স্কুল ম্যানেজমেন্ট সিস্টেম। ছাত্র, শিক্ষক এবং এডমিন
              সবার জন্য সহজ ও নিরাপদ প্লার্টফর্ম।
            </motion.p>

            <motion.div
              variants={fadeIn}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                <Link
                  href="/admission"
                  className="w-full px-8 py-4 rounded-full text-base font-bold text-white bg-gradient-to-r from-brand-pink to-brand-purple hover:neon-glow transition-all flex items-center justify-center gap-2 group"
                >
                  Join Today
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                <Link
                  href="/login"
                  className="w-full px-8 py-4 rounded-full text-base font-bold text-foreground glass hover:bg-foreground/10 transition-all flex items-center justify-center"
                >
                  Portal Login
                </Link>
              </motion.div>
            </motion.div>

            {/* Mobile quick links */}
            <motion.div
              variants={fadeIn}
              className="mt-6 grid grid-cols-2 gap-3 w-full max-w-md mx-auto sm:hidden"
            >
              <Link
                href="/"
                className="px-3 py-2 rounded-2xl bg-foreground/5 border border-foreground/10 text-[11px] font-semibold text-foreground/90 text-center"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="px-3 py-2 rounded-2xl bg-foreground/5 border border-foreground/10 text-[11px] font-semibold text-foreground/90 text-center"
              >
                About
              </Link>
              <Link
                href="/notices"
                className="px-3 py-2 rounded-2xl bg-foreground/5 border border-foreground/10 text-[11px] font-semibold text-foreground/90 text-center"
              >
                Notices
              </Link>
              <Link
                href="/events"
                className="px-3 py-2 rounded-2xl bg-foreground/5 border border-foreground/10 text-[11px] font-semibold text-foreground/90 text-center"
              >
                Calendar
              </Link>
              <Link
                href="/routine"
                className="px-3 py-2 rounded-2xl bg-foreground/5 border border-foreground/10 text-[11px] font-semibold text-foreground/90 text-center"
              >
                Routine
              </Link>
              <Link
                href="/gallery"
                className="px-3 py-2 rounded-2xl bg-foreground/5 border border-foreground/10 text-[11px] font-semibold text-foreground/90 text-center"
              >
                Gallery
              </Link>
              <Link
                href="/contact"
                className="px-3 py-2 rounded-2xl bg-foreground/5 border border-foreground/10 text-[11px] font-semibold text-foreground/90 text-center"
              >
                Contact
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative hidden lg:block h-full min-h-[400px] w-full max-w-md ml-auto"
          >
            <HomeNoticeBoard />
          </motion.div>
        </div>
      </section>

      {/* Homepage notices on small screens (desktop uses hero column) */}
      <section className="lg:hidden px-4 pb-6 -mt-4" aria-label="Notice board">
        <div className="max-w-7xl mx-auto rounded-3xl border border-foreground/10 bg-card/50 p-4">
          <HomeNoticeBoard />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative z-10 border-y border-foreground/10 bg-foreground/5 dark:bg-foreground/5 dark:bg-background/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StatsSection fadeIn={fadeIn} staggerContainer={staggerContainer} />
        </div>
      </section>

      {/* Featured Teachers Section */}
      <FeaturedTeachersSection fadeIn={fadeIn} staggerContainer={staggerContainer} />

      {/* Features Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="All-in-One [gradient]School Platform"
            subtitle="Core Features"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {[
              {
                title: "Student Portal",
                desc: "Students can easily view their daily attendance, academic results, notice board, and class assignments from their personalized dashboard.",
                features: ["Result Analytics", "Attendance Reports", "Task Submissions"],
              },
              {
                title: "Teacher Dashboard",
                desc: "Teachers can digitally input attendance, upload assignments, grade class tests, and communicate closely with students seamlessly.",
                features: ["Mark Entries", "Daily Attendance", "Performance Analytics"],
              },
              {
                title: "Admin Panel",
                desc: "Full administrative control over students, teachers, classes, and site content. Manage the entire institution smoothly and safely.",
                features: ["Role Management", "Website Content", "Database Control"],
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="bg-card border border-foreground/10 rounded-3xl p-8 hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/10 rounded-bl-full -z-10 group-hover:bg-brand-pink/20 transition-colors" />
                <h3 className="text-2xl font-bold text-foreground mb-4 font-heading">
                  {feature.title}
                </h3>
                <p className="text-foreground/70 mb-6 text-sm leading-relaxed">{feature.desc}</p>
                <ul className="space-y-3">
                  {feature.features.map((f, j) => (
                    <li
                      key={j}
                      className="flex items-center gap-2 text-sm text-foreground/80 font-medium"
                    >
                      <CheckCircle2 className="w-4 h-4 text-brand-pink" />
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 relative bg-foreground/5 dark:bg-foreground/5 dark:bg-background/40 border-t border-foreground/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Meet The [gradient]Leadership"
            subtitle="Our Strength"
          />

          <LeadershipSection fadeIn={fadeIn} />
        </div>
      </section>

      {/* Important Links & Maps Footer Section */}
      <PreFooterSection />

      <HomeFloatingLayer />
    </div>
  );
}

type StatsSectionProps = {
  fadeIn: any;
  staggerContainer: any;
};

function StatsSection({ fadeIn, staggerContainer }: StatsSectionProps) {
  const [stats, setStats] = useState<
    { key: string; label: string; value: string; icon: React.ElementType }[]
  >([
    { key: "TOTAL_STUDENTS", label: "Total Students", value: "1500+", icon: Users },
    { key: "TOTAL_TEACHERS", label: "Total Teachers", value: "120+", icon: BookOpen },
    { key: "ACHIEVEMENTS", label: "Achievements", value: "50+", icon: Trophy },
    { key: "SUCCESS_RATE", label: "Success Rate", value: "99%", icon: GraduationCap },
  ]);

  useEffect(() => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/stats`);
        const data = await res.json();
        if (!data.success) return;

        const byKey: Record<string, { label: string; value: string }> = {};
        for (const stat of data.data as { key: string; label: string; value: string }[]) {
          byKey[stat.key] = { label: stat.label, value: stat.value };
        }

        setStats((current) =>
          current.map((s) =>
            byKey[s.key] ? { ...s, label: byKey[s.key].label, value: byKey[s.key].value } : s
          )
        );
      } catch {
        // ignore, keep defaults
      }
    };

    load();
  }, []);

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer}
      className="grid grid-cols-2 md:grid-cols-4 gap-6"
    >
      {stats.map((stat, i) => (
        <motion.div
          key={stat.key ?? i}
          variants={fadeIn}
          className="glass rounded-3xl p-8 text-center hover:neon-glow transition-all duration-300 group"
        >
          <div className="inline-flex p-4 rounded-2xl bg-foreground/5 group-hover:bg-gradient-to-br group-hover:from-brand-pink/20 group-hover:to-brand-purple/20 transition-colors mb-4 border border-foreground/10">
            <stat.icon className="w-8 h-8 text-brand-purple group-hover:text-brand-pink transition-colors" />
          </div>
          <h3 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-brand-pink group-hover:to-brand-purple transition-all">
            {stat.value}
          </h3>
          <p className="text-sm text-foreground/70 font-medium">{stat.label}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}

function HomeNoticeBoard() {
  const [notices, setNotices] = useState<
    { id: string; title: string; type: string; createdAt: string; featuredOnHome?: boolean }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/notices`);
        const data = await res.json();
        if (data.success && data.data) {
          type Row = { id: string; title: string; type: string; createdAt: string; featuredOnHome?: boolean };
          const list = [...data.data] as Row[];
          list.sort((a, b) => {
            const fa = a.featuredOnHome ? 1 : 0;
            const fb = b.featuredOnHome ? 1 : 0;
            if (fa !== fb) return fb - fa;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });
          setNotices(list.slice(0, 8));
        }
      } catch {
        // ignore
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="relative w-full h-[400px] overflow-hidden flex flex-col p-2 group">
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-brand-purple/20 relative z-10 bg-transparent">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-pink/20 rounded-lg">
            <BookOpen className="w-5 h-5 text-brand-pink" />
          </div>
          <h3 className="text-xl font-bold font-heading text-foreground">
            নোটিশ বোর্ড
          </h3>
        </div>
        <Link href="/notices" className="text-sm font-bold text-brand-purple hover:text-brand-pink transition-colors">
          সবগুলো দেখুন
        </Link>
      </div>

      <div className="flex-1 overflow-hidden relative">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <span className="w-6 h-6 border-2 border-brand-purple border-t-transparent rounded-full animate-spin" />
          </div>
        ) : notices.length > 0 ? (
          // The seamless scrolling container
          // Using motion.div with y transform from 0 to -50% repeats seamlessly
          <motion.div
            animate={{ y: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
            className="flex flex-col gap-4 absolute w-full hover:[animation-play-state:paused]"
          >
            {[...notices, ...notices].map((notice, i) => (
              <Link href="/notices" key={`${notice.id}-${i}`} className="block bg-foreground/5 p-4 rounded-xl border border-foreground/10 hover:bg-brand-purple/5 transition-colors cursor-pointer shrink-0 shadow-sm hover:shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-purple px-2 py-1 bg-brand-purple/10 rounded-md">
                    {notice.type}
                  </span>
                  <span className="text-[10px] text-foreground/50 font-medium whitespace-nowrap">
                    {new Date(notice.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long" })}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-foreground font-bangla line-clamp-2 hover:text-brand-pink transition-colors leading-relaxed">
                  {notice.title}
                </h4>
              </Link>
            ))}
          </motion.div>
        ) : (
          <p className="text-sm text-foreground/60 font-bangla text-center mt-10">কোনো নোটিশ নেই</p>
        )}
      </div>
    </div>
  );
}

type LeadershipSectionProps = {
  fadeIn: any;
};

function LeadershipSection({ fadeIn }: LeadershipSectionProps) {
  const [staff, setStaff] = useState<
    {
      id: string;
      name: string;
      role: string;
      bio?: string | null;
      imageUrl?: string | null;
      isHead: boolean;
    }[]
  >([]);

  useEffect(() => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/staff`);
        const data = await res.json();
        if (data.success) {
          setStaff(data.data);
        }
      } catch {
        // ignore, keep empty -> fallback UI
      }
    };

    load();
  }, []);

  const list = staff.length
    ? staff
    : [
      {
        id: "placeholder-head",
        name: "A H M Taznorul Islam",
        role: "Head of Institution",
        bio: "",
        imageUrl: "",
        isHead: true,
      },
    ];

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
        {list.map((member) => (
          <motion.div
            key={member.id}
            initial="hidden"
            whileInView="visible"
            whileHover={{ y: -5 }}
            viewport={{ once: true }}
            variants={fadeIn}
            className="group cursor-pointer"
          >
            <a href={`/staff/${member.id}`} className="block">
              <div className="aspect-[4/5] rounded-3xl bg-card overflow-hidden relative mb-4 border border-foreground/10">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 flex flex-col justify-end p-6">
                  <span className="text-brand-pink text-sm font-bold tracking-wider uppercase mb-1">
                    View Profile
                  </span>
                </div>
                <div className="w-full h-full bg-foreground/5 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                  {member.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={member.imageUrl}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Users className="w-16 h-16 text-foreground/10" />
                  )}
                </div>
              </div>
              <h4 className="text-xl font-bold text-foreground font-heading">{member.name}</h4>
              <p className="text-brand-purple text-sm font-medium">
                {member.role}
                {member.isHead ? " • Head of Institution" : ""}
              </p>
            </a>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        className="mt-12 flex justify-center"
      >
        <Link
          href="/faculties"
          className="px-8 py-4 rounded-full text-sm font-bold text-white bg-gradient-to-r from-brand-pink to-brand-purple hover:neon-glow transition-all flex items-center gap-2 group"
        >
          <Users className="w-4 h-4" />
          View Other Members
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>
    </>
  );
}

// ─── Featured Teachers Section ─────────────────────────────────
type FeaturedTeachersProps = { fadeIn: any; staggerContainer: any };

function FeaturedTeachersSection({ fadeIn, staggerContainer }: FeaturedTeachersProps) {
  const [teachers, setTeachers] = useState<
    {
      id: string;
      photoUrl: string | null;
      specialization: string | null;
      bio: string | null;
      qualifications: string | null;
      user: { name: string; email: string };
    }[]
  >([]);

  useEffect(() => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/teachers/featured`);
        const data = await res.json();
        if (data.success) setTeachers(data.data);
      } catch {
        // ignore
      }
    };
    load();
  }, []);

  if (teachers.length === 0) return null;

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Our [gradient]Featured Teachers"
          subtitle="Meet the Faculty"
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16"
        >
          {teachers.map((teacher) => (
            <motion.div
              key={teacher.id}
              variants={fadeIn}
              whileHover={{ y: -5 }}
              className="group bg-card border border-foreground/10 rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-brand-purple/10 transition-all duration-300"
            >
              {/* Photo */}
              <div className="aspect-[4/3] bg-foreground/5 relative overflow-hidden">
                {teacher.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={teacher.photoUrl.startsWith("http") || teacher.photoUrl.startsWith("data:") ? teacher.photoUrl : `${API_BASE_URL}${teacher.photoUrl}`}
                    alt={teacher.user.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-brand-pink to-brand-purple flex items-center justify-center text-3xl font-bold text-white">
                      {teacher.user.name.charAt(0)}
                    </div>
                  </div>
                )}
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Info */}
              <div className="p-6">
                <h4 className="text-lg font-bold text-foreground font-heading mb-1">
                  {teacher.user.name}
                </h4>
                {teacher.specialization && (
                  <span className="inline-block px-3 py-1 rounded-lg bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-xs font-bold uppercase tracking-wider mb-3">
                    {teacher.specialization}
                  </span>
                )}
                {teacher.qualifications && (
                  <p className="text-xs text-foreground/40 font-medium mb-2">{teacher.qualifications}</p>
                )}
                {teacher.bio && (
                  <p className="text-sm text-foreground/60 leading-relaxed line-clamp-3">{teacher.bio}</p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function PreFooterSection() {
  const importantLinks = [
    { title: "বাংলাদেশ মাদ্রাসা শিক্ষা বোর্ড", url: "https://bmeb.gov.bd" },
    { title: "বাংলাদেশ শিক্ষাতথ্য ও পরিসংখ্যান ব্যুরো (ব্যানবেইস)", url: "https://banbeis.gov.bd" },
    { title: "ইসলামি বিশ্ববিদ্যালয়", url: "https://iu.ac.bd" },
    { title: "ইসলামি আরবি বিশ্ববিদ্যালয়", url: "https://iau.edu.bd" },
    { title: "মাদ্রাসা শিক্ষা অধিদপ্তর", url: "https://dme.gov.bd" },
    { title: "শিক্ষা মন্ত্রণালয়", url: "https://moedu.gov.bd" },
    { title: "শিক্ষক বাতায়ন", url: "https://www.teachers.gov.bd" },
  ];

  return (
    <section className="bg-[var(--pre-footer-bg)] py-16 px-4 md:px-8 shadow-inner relative z-10 transition-colors duration-500">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-gray-900 dark:text-white">

        {/* Column 1: Contact Info */}
        <div className="space-y-6 text-center md:text-left">
          <h3 className="text-2xl font-sans font-black tracking-tight text-[var(--pre-footer-text-heading)] pb-2 border-b border-foreground/5 md:border-none inline-block md:block mb-4 md:mb-0">
            Contact Info
          </h3>

          <div className="space-y-4 font-sans font-medium text-sm text-left inline-block md:block mx-auto">
            <div className="flex gap-3 items-start justify-center md:justify-start">
              <Mail className="w-5 h-5 mt-0.5 text-[var(--pre-footer-icon)]" />
              <div>
                <p className="font-bold text-[var(--pre-footer-text-primary)]">E-mail</p>
                <p className="text-[var(--pre-footer-text-secondary)]">mmam26@gmail.com</p>
              </div>
            </div>

            <div className="flex gap-3 items-center justify-center md:justify-start text-[var(--pre-footer-text-heading)] hover:underline cursor-pointer group">
              <Facebook className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <p className="font-bold">Visit Our Facebook Page</p>
            </div>

            <div className="flex gap-3 items-start justify-center md:justify-start">
              <MapPin className="w-5 h-5 mt-0.5 text-[var(--pre-footer-icon)]" />
              <div>
                <p className="font-bold text-[var(--pre-footer-text-primary)]">Address</p>
                <p className="text-[var(--pre-footer-text-secondary)] max-w-[250px]">Mohishaban, Gabtali, Bogura-5800, Bangladesh</p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-foreground/5 md:border-none">
            <h3 className="text-xl font-sans font-black tracking-tight text-center pb-2 mb-4 text-[var(--pre-footer-text-primary)]">
              Contact Office
            </h3>

            <p className="text-center font-bold text-lg mb-6 py-2 bg-foreground/5 dark:bg-white/5 rounded-xl text-[var(--pre-footer-text-heading)]">Hotline : 09617880099</p>

            <div className="grid grid-cols-2 gap-y-4 gap-x-3 text-[10px] sm:text-xs font-bold text-[var(--pre-footer-text-primary)]">
              <div className="flex items-center gap-1.5 justify-center bg-foreground/5 dark:bg-white/5 py-2 px-1 rounded-lg"><Phone className="w-3.5 h-3.5 text-[var(--pre-footer-icon)]" /> +8801550-706095</div>
              <div className="flex items-center gap-1.5 justify-center bg-foreground/5 dark:bg-white/5 py-2 px-1 rounded-lg"><Phone className="w-3.5 h-3.5 text-[var(--pre-footer-icon)]" /> +8801550-706093</div>
              <div className="flex items-center gap-1.5 justify-center bg-foreground/5 dark:bg-white/5 py-2 px-1 rounded-lg"><Phone className="w-3.5 h-3.5 text-[var(--pre-footer-icon)]" /> +8801550-725830</div>
              <div className="flex items-center gap-1.5 justify-center bg-foreground/5 dark:bg-white/5 py-2 px-1 rounded-lg"><Phone className="w-3.5 h-3.5 text-[var(--pre-footer-icon)]" /> +8801778-425268</div>
              <div className="flex items-center gap-1.5 justify-center bg-foreground/5 dark:bg-white/5 py-2 px-1 rounded-lg"><Phone className="w-3.5 h-3.5 text-[var(--pre-footer-icon)]" /> +8801576-710049</div>
              <div className="flex items-center gap-1.5 justify-center bg-foreground/5 dark:bg-white/5 py-2 px-1 rounded-lg text-center leading-tight">
                <Phone className="w-3.5 h-3.5 text-[var(--pre-footer-icon)] shrink-0" />
                <span>+8801550-725826 <br className="hidden xs:block" />(হিফজ)</span>
              </div>
              <div className="flex items-center gap-1.5 justify-center bg-foreground/5 dark:bg-white/5 py-2 px-1 rounded-lg"><Phone className="w-3.5 h-3.5 text-[var(--pre-footer-icon)]" /> 09617880099</div>
              <div className="flex items-center gap-1.5 justify-center bg-foreground/5 dark:bg-white/5 py-2 px-1 rounded-lg"><Phone className="w-3.5 h-3.5 text-[var(--pre-footer-icon)]" /> +8801550-725824</div>
              <div className="flex items-center gap-1.5 justify-center bg-foreground/5 dark:bg-white/5 py-2 px-1 rounded-lg"><Phone className="w-3.5 h-3.5 text-[var(--pre-footer-icon)]" /> +8801550-706094</div>
              <div className="flex items-center gap-1.5 justify-center bg-foreground/5 dark:bg-white/5 py-2 px-1 rounded-lg"><Phone className="w-3.5 h-3.5 text-[var(--pre-footer-icon)]" /> +8801550-725825</div>
            </div>

            <div className="mt-8 text-center text-xs sm:text-sm font-bold">
              <p className="text-[var(--pre-footer-text-heading)] opacity-80 decoration-brand-green/30 underline underline-offset-4">Office Time: 8:00 AM - 5:00 PM</p>
              <p className="text-red-500 mt-2">(সাপ্তাহিক/সরকারি ছুটি ব্যতীত)</p>
            </div>
          </div>
        </div>

        {/* Column 2: Important Links */}
        <div className="space-y-6">
          <h3 className="text-2xl font-sans font-black tracking-tight text-center pb-2 text-[var(--pre-footer-text-primary)]">
            Important Links
          </h3>
          <div className="flex flex-col gap-3">
            {importantLinks.map((link, idx) => (
              <motion.a
                key={idx}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#005B60] hover:bg-[#004b4f] dark:bg-[#004D40]/80 dark:hover:bg-[#004D40] text-white py-3.5 px-4 rounded-xl text-center font-bold text-sm shadow-sm transition-all shadow-black/20"
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
              >
                {link.title}
              </motion.a>
            ))}
          </div>
        </div>

        {/* Column 3: Google Maps */}
        <div className="space-y-6">
          <h3 className="text-2xl font-sans font-black tracking-tight text-center pb-2 text-[var(--pre-footer-text-primary)]">
            Google Maps
          </h3>
          <div className="w-full h-[400px] md:h-[480px] overflow-hidden rounded-xl shadow-md bg-white dark:bg-black/20 p-2">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3618.355152504856!2d89.44497491500356!3d24.896102684037166!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fc53cecfcc8fff%3A0xc1b2c45db09ea7de!2sMohishaban!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd"
              width="100%"
              height="100%"
              style={{ border: 0, borderRadius: '8px' }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

      </div>
    </section>
  );
}
