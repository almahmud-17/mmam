"use client";

import { motion } from "framer-motion";
import { BookOpen, ExternalLink, GraduationCap, ArrowRight } from "lucide-react";
import { SectionTitle } from "@/components/ui/SectionTitle";

export default function BooksPage() {
  const books = [
    { class: "১ম শ্রেণি (ইবতেদায়ী)", level: "Primary", link: "http://nctb.gov.bd/site/page/f4f5f6e7-6e3e-424a-bc95-cd3df96e1ac5", icon: BookOpen },
    { class: "২য় শ্রেণি (ইবতেদায়ী)", level: "Primary", link: "http://nctb.gov.bd/site/page/f4f5f6e7-6e3e-424a-bc95-cd3df96e1ac5", icon: BookOpen },
    { class: "৩য় শ্রেণি (ইবতেদায়ী)", level: "Primary", link: "http://nctb.gov.bd/site/page/f4f5f6e7-6e3e-424a-bc95-cd3df96e1ac5", icon: BookOpen },
    { class: "৪র্থ শ্রেণি (ইবতেদায়ী)", level: "Primary", link: "http://nctb.gov.bd/site/page/f4f5f6e7-6e3e-424a-bc95-cd3df96e1ac5", icon: BookOpen },
    { class: "৫ম শ্রেণি (ইবতেদায়ী)", level: "Primary", link: "http://nctb.gov.bd/site/page/f4f5f6e7-6e3e-424a-bc95-cd3df96e1ac5", icon: BookOpen },
    { class: "৬ষ্ঠ শ্রেণি (দাখিল)", level: "Secondary", link: "http://nctb.gov.bd/site/page/26e95bf6-b5eb-420a-9d6f-78c66e4a2cdb", icon: GraduationCap },
    { class: "৭ম শ্রেণি (দাখিল)", level: "Secondary", link: "http://nctb.gov.bd/site/page/26e95bf6-b5eb-420a-9d6f-78c66e4a2cdb", icon: GraduationCap },
    { class: "৮ম শ্রেণি (দাখিল)", level: "Secondary", link: "http://nctb.gov.bd/site/page/26e95bf6-b5eb-420a-9d6f-78c66e4a2cdb", icon: GraduationCap },
    { class: "৯ম ও ১০ম শ্রেণি (দাখিল)", level: "Secondary", link: "http://nctb.gov.bd/site/page/26e95bf6-b5eb-420a-9d6f-78c66e4a2cdb", icon: GraduationCap },
    { class: "একাদশ শ্রেণি (আলিম)", level: "Higher Secondary", link: "http://nctb.gov.bd/site/page/26e95bf6-b5eb-420a-9d6f-78c66e4a2cdb", icon: BookOpen },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  return (
    <main className="min-h-screen pt-24 pb-16 relative overflow-hidden flex flex-col items-center">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-pink/5 rounded-full blur-[100px] -z-10 mix-blend-multiply dark:mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-purple/5 rounded-full blur-[80px] -z-10 mix-blend-multiply dark:mix-blend-screen pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <SectionTitle
            title="বোর্ড অনুমোদিত [gradient]পাঠ্যপুস্তক"
            subtitle="Books"
          />
          <p className="mt-4 text-foreground/60 leading-relaxed font-bangla">
            বাংলাদেশ মাদ্রাসা শিক্ষা বোর্ড এবং এনসিটিবি (NCTB) কর্তৃক নির্ধারিত ইবতেদায়ী, দাখিল এবং আলিম শ্রেণীর সকল পাঠ্যপুস্তক ডাউনলোড করুন অথবা অনলাইনে পড়ুন।
          </p>
        </div>

        {/* Categories / Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {books.map((book, idx) => (
            <motion.a
              href={book.link}
              target="_blank"
              rel="noopener noreferrer"
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative flex flex-col p-6 rounded-3xl bg-card border border-foreground/10 hover:border-brand-purple/30 shadow-sm hover:shadow-xl hover:shadow-brand-purple/10 transition-all duration-300 overflow-hidden"
            >
              {/* Card gradient effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-pink/5 to-brand-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="flex items-start justify-between mb-8 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-brand-purple/10 flex items-center justify-center group-hover:bg-brand-purple group-hover:text-white text-brand-purple transition-colors duration-300">
                  <book.icon className="w-6 h-6" />
                </div>
                <div className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center text-foreground/40 group-hover:text-brand-pink transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </div>
              </div>

              <div className="relative z-10 mt-auto">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-purple/80 mb-2 block">
                  {book.level} Level
                </span>
                <h3 className="text-lg font-bold font-bangla text-foreground group-hover:text-brand-purple transition-colors flex items-center gap-2">
                  {book.class}
                </h3>
              </div>
              
              <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300 z-10 text-brand-purple">
                <ArrowRight className="w-5 h-5" />
              </div>
            </motion.a>
          ))}
        </motion.div>
        
        {/* Help Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 bg-brand-purple/5 border border-brand-purple/20 p-6 md:p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-purple/10 rounded-full flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6 text-brand-purple" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-foreground">অন্যান্য বই খুঁজছেন?</h4>
              <p className="text-sm text-foreground/60 mt-1">
                এনসিটিবি এর অফিসিয়াল ওয়েবসাইটে সকল শ্রেণীর বই পাওয়া যাবে।
              </p>
            </div>
          </div>
          <a
            href="http://nctb.gov.bd/"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-6 py-3 bg-brand-purple text-white font-bold rounded-xl hover:opacity-90 transition-opacity w-full md:w-auto text-center"
          >
            NCTB ওয়েবসাইট
          </a>
        </motion.div>
      </div>
    </main>
  );
}
