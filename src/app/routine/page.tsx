"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { CalendarRange } from "lucide-react";

export default function RoutinePage() {
  const emptyPeriodSlots = Array.from({ length: 8 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Hero */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-pink/10 border border-brand-pink/20 text-brand-pink text-sm font-bold uppercase tracking-[0.3em]"
          >
            <CalendarRange className="w-4 h-4" />
            Class Routine
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-heading font-extrabold text-foreground dark:text-white"
          >
            Published <span className="text-gradient">Routine</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-foreground/60 dark:text-gray-400 max-w-2xl mx-auto font-bangla"
          >
            প্রকাশিত রুটিনের ছবি এবং নিচে অ্যাডমিন আপডেটের জন্য ফাঁকা স্লট।
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-4 md:p-6 backdrop-blur-xl shadow-[0_8px_32px_rgba(31,38,135,0.25)]"
        >
          <div className="pointer-events-none absolute -top-20 -right-16 h-48 w-48 rounded-full bg-brand-pink/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-16 h-48 w-48 rounded-full bg-brand-purple/20 blur-3xl" />

          <div className="relative space-y-3">
            <h2 className="text-lg md:text-xl font-heading font-bold text-foreground dark:text-white font-bangla">
              প্রকাশিত ক্লাস রুটিন
            </h2>
          </div>

          <div className="relative mt-4 overflow-hidden rounded-2xl border border-white/30 bg-white/20 p-2 backdrop-blur-md">
            <Image
              src="/routine-2026.png"
              alt="Class routine image"
              width={1400}
              height={1000}
              className="h-auto w-full rounded-xl object-contain"
              priority
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-4 md:p-6 backdrop-blur-xl shadow-[0_8px_32px_rgba(31,38,135,0.25)] space-y-6"
        >
          <h3 className="text-base md:text-lg font-heading font-semibold text-foreground dark:text-white">
            Empty Routine Boxes
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {emptyPeriodSlots.map((period) => (
              <div
                key={period}
                className="rounded-2xl border border-white/30 bg-white/20 backdrop-blur-md p-4 min-h-28"
              >
                <p className="text-sm font-semibold text-foreground dark:text-white">
                  Class {period}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
