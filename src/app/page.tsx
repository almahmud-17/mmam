"use client";

import { motion } from "framer-motion";
import { GraduationCap, Users, BookOpen, Trophy, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { SectionTitle } from "@/components/ui/SectionTitle";

export default function Home() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-pink/20 rounded-full blur-[120px] -z-10 pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-purple/20 rounded-full blur-[120px] -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden" animate="visible" variants={staggerContainer}
            className="text-center lg:text-left"
          >
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 border-brand-pink/30">
              <span className="w-2 h-2 rounded-full bg-brand-pink animate-pulse" />
              <span className="text-sm font-medium text-text-light">A almahmud_17 School Management System project</span>
            </motion.div>

            <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-heading font-extrabold text-white leading-[1.1] mb-6">
              Next Generation <br />
              <span className="text-gradient drop-shadow-[0_0_15px_rgba(255,45,125,0.3)]">Education Platform</span>
            </motion.h1>

            <motion.p variants={fadeIn} className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto lg:mx-0 font-bangla">
              একটি স্মার্ট ও আধুনিক ডিজিটাল স্কুল ম্যানেজমেন্ট সিস্টেম। ছাত্র, শিক্ষক এবং এডমিন সবার জন্য সহজ ও নিরাপদ প্লার্টফর্ম।
            </motion.p>

            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link href="/admission" className="w-full sm:w-auto px-8 py-4 rounded-full text-base font-bold text-white bg-gradient-to-r from-brand-pink to-brand-purple hover:neon-glow transition-all flex items-center justify-center gap-2 group">
                Join Today
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/login" className="w-full sm:w-auto px-8 py-4 rounded-full text-base font-bold text-white glass hover:bg-white/10 transition-all flex items-center justify-center">
                Portal Login
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative hidden lg:block"
          >
            <div className="aspect-square rounded-full bg-gradient-to-tr from-brand-pink/20 to-brand-purple/20 border border-white/10 flex items-center justify-center relative shadow-[0_0_80px_rgba(168,85,247,0.15)]">
              {/* Abstract decorative elements simulating an illustration */}
              <div className="absolute inset-10 rounded-full border border-dashed border-white/20 animate-[spin_60s_linear_infinite]" />
              <div className="absolute inset-20 rounded-full border border-brand-pink/30 animate-[spin_40s_linear_infinite_reverse]" />
              <GraduationCap className="w-32 h-32 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />

              {/* Floating cards */}
              <motion.div
                animate={{ y: [-10, 10, -10] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute top-10 left-10 p-4 glass rounded-2xl flex items-center gap-3 backdrop-blur-xl"
              >
                <div className="bg-green-500/20 p-2 rounded-lg"><CheckCircle2 className="w-6 h-6 text-green-400" /></div>
                <div>
                  <p className="text-sm font-bold text-white">Attendance</p>
                  <p className="text-xs text-gray-400">100% Updated</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative z-10 border-y border-white/5 bg-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { icon: Users, num: "1500+", label: "Total Students" },
              { icon: BookOpen, num: "120+", label: "Expert Teachers" },
              { icon: Trophy, num: "50+", label: "Awards Won" },
              { icon: GraduationCap, num: "99%", label: "Success Rate" }
            ].map((stat, i) => (
              <motion.div key={i} variants={fadeIn} className="glass rounded-3xl p-8 text-center hover:neon-glow transition-all duration-300 group">
                <div className="inline-flex p-4 rounded-2xl bg-white/5 group-hover:bg-gradient-to-br group-hover:from-brand-pink/20 group-hover:to-brand-purple/20 transition-colors mb-4 border border-white/5">
                  <stat.icon className="w-8 h-8 text-brand-purple group-hover:text-brand-pink transition-colors" />
                </div>
                <h3 className="text-3xl md:text-4xl font-heading font-bold text-white mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-brand-pink group-hover:to-brand-purple transition-all">
                  {stat.num}
                </h3>
                <p className="text-sm text-gray-400 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

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
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
                className="bg-card border border-white/5 rounded-3xl p-8 hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/10 rounded-bl-full -z-10 group-hover:bg-brand-pink/20 transition-colors" />
                <h3 className="text-2xl font-bold text-white mb-4 font-heading">{feature.title}</h3>
                <p className="text-gray-400 mb-6 text-sm leading-relaxed">{feature.desc}</p>
                <ul className="space-y-3">
                  {feature.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-gray-300 font-medium">
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
      <section className="py-24 relative bg-black/40 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Meet The [gradient]Leadership"
            subtitle="Our Strength"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
                className="group cursor-pointer"
              >
                <div className="aspect-[4/5] rounded-3xl bg-card overflow-hidden relative mb-4 border border-white/5">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 flex flex-col justify-end p-6">
                    <span className="text-brand-pink text-sm font-bold tracking-wider uppercase mb-1">View Profile</span>
                  </div>
                  {/* Placeholder for actual image */}
                  <div className="w-full h-full bg-white/5 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                    <Users className="w-16 h-16 text-white/10" />
                  </div>
                </div>
                <h4 className="text-xl font-bold text-white font-heading">A H M TAZNORUL ISLAM</h4>
                <p className="text-brand-purple text-sm font-medium">Head of Institution</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
