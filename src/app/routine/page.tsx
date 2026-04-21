"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { CalendarRange } from "lucide-react";

type RoutineRow = {
  serial: string;
  name: string;
  first: string;
  second: string;
  third: string;
  fourth: string;
  fifth: string;
  sixth: string;
  seventh: string;
  eighth: string;
};

const tableA: RoutineRow[] = [
  { serial: "১", name: "অধ্যক্ষ", first: "", second: "", third: "", fourth: "", fifth: "", sixth: "", seventh: "", eighth: "" },
  { serial: "২", name: "উপাধ্যক্ষ", first: "", second: "", third: "", fourth: "৮ম কুরআন ৩ দিন", fifth: "", sixth: "", seventh: "৭ম কৃষি ৬ দিন", eighth: "" },
  { serial: "৩", name: "নাজিয়া", first: "৬ষ্ঠ ইংরেজি", second: "৮ম বাংলা", third: "", fourth: "", fifth: "", sixth: "", seventh: "", eighth: "" },
  { serial: "৪", name: "তাসমুকুল", first: "", second: "", third: "", fourth: "", fifth: "", sixth: "২য় কারিগরি ২ দিন", seventh: "৩য় বাংলা ১ম/২য়", eighth: "" },
  { serial: "৫", name: "আঃ কাদের", first: "৬ষ্ঠ ইংরেজি ১ম/২য়", second: "আলিম-১ম ইংরেজি ১ম/২য়", third: "", fourth: "আলিম-১ম বাংলা ১ম/২য়", fifth: "৭ম ইংরেজি", sixth: "", seventh: "", eighth: "" },
  { serial: "৬", name: "আবুব", first: "জামাত ১ম/২য়", second: "", third: "৮ম কুরআন", fourth: "", fifth: "", sixth: "আলিম-২য় ফিকহ ১ম/২য়", seventh: "১ম কুরআন ৩ দিন", eighth: "" },
  { serial: "৭", name: "মাসুদ", first: "কুরআন-১ম", second: "", third: "১০ম আলিম", fourth: "৮ম বিজ্ঞান ২ দিন", fifth: "", sixth: "আলিম-২য় ফিকহ ১ম/২য়", seventh: "কুরআন ৩ দিন", eighth: "" },
  { serial: "৮", name: "আঃ সাহারা", first: "কুরআন/সাহিফ", second: "আলিম-২য় ফিকহ ১ম/২য়", third: "আলিম-১ম বাংলা ১ম/২য়", fourth: "", fifth: "৮ম আরবি ১ম/২য়", sixth: "", seventh: "", eighth: "" },
  { serial: "৯", name: "ইউসূফী", first: "৫ম আরবি/কুরআন", second: "", third: "আলিম-১ম হাদিস-১ দিন", fourth: "", fifth: "আলিম-১ম আরবি-১ দিন", sixth: "", seventh: "৮ম হাদিস ২ দিন", eighth: "৭ম বিজ্ঞান" },
  { serial: "১০", name: "শাহরিয়ার", first: "", second: "", third: "আলিম-১ম ফিকহ ৩ দিন", fourth: "৪র্থ কৃষি/শারীরিক", fifth: "আলিম-২য় আরবি-২/৩য় উলুম", sixth: "", seventh: "৯ম হাদিস ২ দিন", eighth: "১০ম কৃষি/শারীরিক" },
  { serial: "১১", name: "আঃ মান্নান", first: "", second: "২য় গণিত", third: "", fourth: "", fifth: "", sixth: "১০ম ইতিহাস-১ দিন", seventh: "৮ম আকাইদ ৩ দিন", eighth: "" },
  { serial: "১২", name: "ফাহিয়া", first: "", second: "১ম আরবি/ফিকহ", third: "৫ম বাংলা", fourth: "", fifth: "৮ম গণিত", sixth: "", seventh: "৬ষ্ঠ গণিত", eighth: "" },
  { serial: "১৩", name: "শাহাবউদ্দীন", first: "", second: "১০ম গণিত", third: "১ম গণিত", fourth: "", fifth: "৪র্থ গণিত", sixth: "", seventh: "৮ম বাংলা", eighth: "" },
  { serial: "১৪", name: "কাজল", first: "৪র্থ ইংরেজি", second: "", third: "বাংলা ১ম/২য়", fourth: "", fifth: "", sixth: "জাতীয় ২ দিন", seventh: "", eighth: "" }
];

const tableB: RoutineRow[] = [
  { serial: "১৫", name: "জাহিফুল", first: "", second: "৯ম আরবি ১ম তিন", third: "", fourth: "৮ম বিষয় ৩ দিন", fifth: "১ম আরবি ১ম/২য়", sixth: "", seventh: "১০ম আরবি ১ম/২য়", eighth: "" },
  { serial: "১৬", name: "আরমান", first: "৮ম বাংলা ১ম/২য়", second: "", third: "৮ম গণিত", fourth: "৫ম ইংরেজি", fifth: "", sixth: "১০ম বাংলা ১ম/২য়", seventh: "", eighth: "" },
  { serial: "১৭", name: "ওমর", first: "৭ম কুরআন/আকাইদ", second: "", third: "", fourth: "৯ম আকাইদ ২ দিন", fifth: "৬ষ্ঠ কুরআন/আকাইদ", sixth: "", seventh: "", eighth: "৯ম আকাইদ ৬ষ্ঠ বিজ্ঞান/কৃষি" },
  { serial: "১৮", name: "আঃ রইচ", first: "", second: "৫ম গণিত", third: "", fourth: "৭ম বাংলা", fifth: "", sixth: "", seventh: "৮ম কৃষি/শারীরিক", eighth: "" },
  { serial: "১৯", name: "ইব্রাহিম", first: "১০ম ইংরেজি ১ম/২য়", second: "৮ম বিজ্ঞান", third: "", fourth: "১ম ইংরেজি ১ম/২য়", fifth: "৫ম বিজ্ঞান", sixth: "", seventh: "", eighth: "" },
  { serial: "২০", name: "শামীমুল", first: "", second: "৬ষ্ঠ আরবি ১ম/২য়", third: "", fourth: "১০ম কুরআন/আকাইদ", fifth: "১ম ইংরেজি", sixth: "", seventh: "", eighth: "১২শ বিষয় ২ দিন" },
  { serial: "২১", name: "সিহাব", first: "", second: "৭ম আ.১ম-২য়-দিন", third: "৩য় আরবি/আকাইদ", fourth: "২য় বাংলা", fifth: "", sixth: "", seventh: "১ম কৃষি ৩ দিন", eighth: "" },
  { serial: "২২", name: "হাফিজুর", first: "", second: "১ম কুরআন", third: "", fourth: "", fifth: "২য় আকাইদ", sixth: "৩য় আরবি/আকাইদ", seventh: "", eighth: "" },
  { serial: "২৩", name: "আইয়ুব", first: "২য় কুরআন/আকাইদ", second: "", third: "১ম আরবি/আকাইদ", fourth: "৩য় কুরআন", fifth: "", sixth: "৫ম কুরআন/আকাইদ", seventh: "", eighth: "" },
  { serial: "২৪", name: "হাইছ উদ্দিন", first: "৩য় ইংরেজি", second: "", third: "২য় ইংরেজি", fourth: "১ম বাংলা", fifth: "", sixth: "", seventh: "৭ম কৃষি শারীরিক", eighth: "" },
  { serial: "২৫", name: "এয়াস", first: "১ম গণিত", second: "৩য় গণিত", third: "৭ম গণিত", fourth: "", fifth: "", sixth: "", seventh: "৬ষ্ঠ বিজ্ঞান", eighth: "" },
  { serial: "২৬", name: "রুকনী", first: "", second: "", third: "", fourth: "", fifth: "৩য় বাংলা", sixth: "", seventh: "", eighth: "" }
];

export default function RoutinePage() {
  const renderTable = (rows: RoutineRow[], label: string) => (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-foreground dark:text-white font-bangla">
        সেকশন {label}
      </p>
      <div className="overflow-x-auto rounded-2xl border border-white/30 bg-white/20 backdrop-blur-md">
        <table className="w-full min-w-[1200px] text-xs md:text-sm border-collapse font-bangla">
          <thead className="bg-white/30 dark:bg-white/10">
            <tr className="text-foreground dark:text-white">
              <th className="border border-white/30 px-2 py-2">ক্রমিক</th>
              <th className="border border-white/30 px-2 py-2">নাম</th>
              <th className="border border-white/30 px-2 py-2">১ম ঘন্টা</th>
              <th className="border border-white/30 px-2 py-2">২য় ঘন্টা</th>
              <th className="border border-white/30 px-2 py-2">৩য় ঘন্টা</th>
              <th className="border border-white/30 px-2 py-2">৪র্থ ঘন্টা</th>
              <th className="border border-white/30 px-2 py-2">৫ম ঘন্টা</th>
              <th className="border border-white/30 px-2 py-2">বিরতি</th>
              <th className="border border-white/30 px-2 py-2">৬ষ্ঠ ঘন্টা</th>
              <th className="border border-white/30 px-2 py-2">৭ম ঘন্টা</th>
              <th className="border border-white/30 px-2 py-2">৮ম ঘন্টা</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.serial} className="text-foreground/90 dark:text-gray-100">
                <td className="border border-white/30 px-2 py-2 text-center">{row.serial}</td>
                <td className="border border-white/30 px-2 py-2">{row.name}</td>
                <td className="border border-white/30 px-2 py-2">{row.first}</td>
                <td className="border border-white/30 px-2 py-2">{row.second}</td>
                <td className="border border-white/30 px-2 py-2">{row.third}</td>
                <td className="border border-white/30 px-2 py-2">{row.fourth}</td>
                <td className="border border-white/30 px-2 py-2">{row.fifth}</td>
                <td className="border border-white/30 px-2 py-2 text-center">বি</td>
                <td className="border border-white/30 px-2 py-2">{row.sixth}</td>
                <td className="border border-white/30 px-2 py-2">{row.seventh}</td>
                <td className="border border-white/30 px-2 py-2">{row.eighth}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

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
            ২০২৬ শিক্ষাবর্ষের প্রকাশিত ক্লাস রুটিন (বাংলা টাইপ করা টেবিল)।
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
              প্রকাশিত ক্লাস রুটিন (গ্লাসমরফিজম ভিউ)
            </h2>
            <p className="text-xs md:text-sm text-foreground/70 dark:text-gray-300 font-bangla">
              আপনার দেওয়া রুটিনটি নিচে যোগ করা হয়েছে, যাতে ছাত্র-ছাত্রী সহজে দেখতে পারে।
            </p>
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
          {renderTable(tableA, "ক")}
          {renderTable(tableB, "খ/গ")}
        </motion.div>
      </div>
    </div>
  );
}
