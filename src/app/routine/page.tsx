"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CalendarRange, BookOpen } from "lucide-react";

type RoutineEntry = {
  id: string;
  className: string;
  section: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  subject: string;
  teacherName: string;
  room?: string | null;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
const DAYS = ["SAT", "SUN", "MON", "TUE", "WED", "THU", "FRI"];

export default function RoutinePage() {
  const [entries, setEntries] = useState<RoutineEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/routine`);
        const data = await res.json();
        if (data.success) setEntries(data.data);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const grouped: Record<string, RoutineEntry[]> = {};
  for (const entry of entries) {
    const key = `${entry.className} ${entry.section}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(entry);
  }
  Object.values(grouped).forEach((list) =>
    list.sort(
      (a, b) =>
        DAYS.indexOf(a.dayOfWeek) - DAYS.indexOf(b.dayOfWeek) ||
        a.startTime.localeCompare(b.startTime)
    )
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
            Weekly <span className="text-gradient">Timetable</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-foreground/60 dark:text-gray-400 max-w-2xl mx-auto font-bangla"
          >
            প্রতিটি ক্লাস ও সেকশনের জন্য সপ্তাহজুড়ে কোন সময়ে কোন বিষয় পড়ানো হবে তার সময়সূচি।
          </motion.p>
        </div>

        {/* Routine tables */}
        {isLoading ? (
          <p className="text-center text-foreground/60 dark:text-gray-400 text-sm">Loading routine...</p>
        ) : entries.length === 0 ? (
          <div className="glass rounded-3xl border border-dashed border-foreground/15 dark:border-white/10 py-16 flex flex-col items-center gap-3">
            <BookOpen className="w-10 h-10 text-gray-600" />
            <p className="text-foreground/60 dark:text-gray-400 text-sm font-bangla">
              এখনো কোনো রুটিন সেট করা হয়নি। Admin panel থেকে ক্লাস Routine যোগ করুন।
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(grouped).map(([key, list]) => (
              <div key={key} className="glass rounded-3xl border border-foreground/10 dark:border-white/5 overflow-hidden">
                <div className="px-6 py-4 border-b border-foreground/10 dark:border-white/5 flex items-center justify-between">
                  <h2 className="text-sm font-heading font-semibold text-foreground dark:text-white">
                    {key}
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse min-w-[700px]">
                    <thead className="bg-foreground/5 dark:bg-white/5 text-foreground/60 dark:text-gray-400 uppercase tracking-wider">
                      <tr>
                        <th className="p-3 pl-6">Day</th>
                        <th className="p-3">Time</th>
                        <th className="p-3">Subject</th>
                        <th className="p-3">Teacher</th>
                        <th className="p-3">Room</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {list.map((slot) => (
                        <tr key={slot.id}>
                          <td className="p-3 pl-6 text-foreground/70 dark:text-gray-300">{slot.dayOfWeek}</td>
                          <td className="p-3 text-foreground/70 dark:text-gray-300">
                            {slot.startTime} – {slot.endTime}
                          </td>
                          <td className="p-3 text-foreground dark:text-white font-semibold">{slot.subject}</td>
                          <td className="p-3 text-foreground/70 dark:text-gray-300">{slot.teacherName}</td>
                          <td className="p-3 text-foreground/60 dark:text-gray-400">{slot.room}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

