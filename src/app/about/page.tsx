"use client";

import { motion } from "framer-motion";
import { GraduationCap, MapPin, Users, BookOpen, CheckCircle2 } from "lucide-react";

export default function AboutPage() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-brand-pink/10 border border-brand-pink/20 text-brand-pink text-xs font-bold uppercase tracking-[0.3em]">
            <GraduationCap className="w-4 h-4" />
            Mohishaban M Alim Madrasah
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-foreground dark:text-white">
            About Our <span className="text-gradient">Madrasah</span>
          </h1>
          <p className="text-foreground/60 dark:text-gray-400 max-w-2xl mx-auto font-bangla text-base md:text-lg">
            মহিষাবান এম আলিম মাদরাসা এমন একটি শিক্ষা প্রতিষ্ঠান যেখানে আধুনিক জ্ঞান ও দ্বীনি শিক্ষা
            একসাথে প্রদান করা হয়। ছাত্রছাত্রীদের চরিত্র গঠন, নৈতিকতা এবং একাডেমিক সাফল্য—এই তিনটি
            দিককে সমান গুরুত্ব দেওয়া হয়।
          </p>
        </motion.div>

        {/* Info grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="glass rounded-3xl p-6 border border-foreground/15 dark:border-white/10"
          >
            <div className="flex items-center gap-3 mb-3">
              <MapPin className="w-6 h-6 text-brand-pink" />
              <h3 className="text-lg font-heading font-semibold text-foreground dark:text-white">Location</h3>
            </div>
            <p className="text-sm text-foreground/60 dark:text-gray-400 font-bangla">
              মহিষাবান, বগুড়া। শান্ত নিরিবিলি পরিবেশে অবস্থিত এই ক্যাম্পাসে মানসম্মত শিক্ষা পরিচালিত হয়।
            </p>
          </motion.div>

          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="glass rounded-3xl p-6 border border-foreground/15 dark:border-white/10"
          >
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-6 h-6 text-brand-purple" />
              <h3 className="text-lg font-heading font-semibold text-foreground dark:text-white">Students & Staff</h3>
            </div>
            <p className="text-sm text-foreground/60 dark:text-gray-400 font-bangla">
              এখানে শতাধিক শিক্ষক ও স্টাফের সমন্বয়ে প্রায় দেড় হাজার শিক্ষার্থী পড়াশোনা করছে; সবাইকে
              আলাদা যত্নে গড়ে তোলা হয়।
            </p>
          </motion.div>

          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="glass rounded-3xl p-6 border border-foreground/15 dark:border-white/10"
          >
            <div className="flex items-center gap-3 mb-3">
              <BookOpen className="w-6 h-6 text-emerald-400" />
              <h3 className="text-lg font-heading font-semibold text-foreground dark:text-white">Curriculum</h3>
            </div>
            <p className="text-sm text-foreground/60 dark:text-gray-400 font-bangla">
              বাংলাদেশ মাদ্রাসা শিক্ষা বোর্ডের পাশাপাশি কোরআন, হাদীস, আরবী ভাষা ও আধুনিক বিজ্ঞানভিত্তিক
              পাঠ্যসূচি অনুসরণ করা হয়।
            </p>
          </motion.div>
        </div>

        {/* Mission & vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="glass rounded-3xl p-6 md:p-8 border border-foreground/15 dark:border-white/10 space-y-4"
          >
            <h2 className="text-2xl font-heading font-bold text-foreground dark:text-white mb-2">Our Mission</h2>
            <p className="text-sm text-foreground/60 dark:text-gray-400 font-bangla leading-relaxed">
              আল্লাহভীরু, নৈতিক ও দক্ষ মানুষ তৈরি করাই আমাদের মূল লক্ষ্য। নিয়মিত ক্লাস, উপস্থিতি
              মনিটরিং, প্রোগ্রামিং ও ডিজিটাল টুলের মাধ্যমে ছাত্রছাত্রীদের জন্য আধুনিক ও নিরাপদ
              পরিবেশ নিশ্চিত করা হয়।
            </p>
            <ul className="space-y-2 text-sm text-foreground/70 dark:text-gray-300 font-bangla">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-pink" /> মানসম্পন্ন দ্বীনি ও দুনিয়াবী শিক্ষা
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-pink" /> প্রযুক্তি নির্ভর ক্লাসরুম ও
                ম্যানেজমেন্ট
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-pink" /> শৃঙ্খলিত ও নৈতিক ক্যাম্পাস পরিবেশ
              </li>
            </ul>
          </motion.div>

          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="glass rounded-3xl p-6 md:p-8 border border-foreground/15 dark:border-white/10 space-y-4"
          >
            <h2 className="text-2xl font-heading font-bold text-foreground dark:text-white mb-2">Vision for the Future</h2>
            <p className="text-sm text-foreground/60 dark:text-gray-400 font-bangla leading-relaxed">
              ডিজিটাল মাদরাসা কনসেপ্টের মাধ্যমে অনলাইনে রেজাল্ট, নোটিশ, উপস্থিতি ও যোগাযোগ—সবকিছু এক
              প্ল্যাটফর্মে আনার লক্ষ্য আমাদের। যাতে অভিভাবক, ছাত্র ও শিক্ষক একসাথে সংযুক্ত থাকতে পারে।
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

