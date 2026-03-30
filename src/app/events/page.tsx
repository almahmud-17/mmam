"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock4 } from "lucide-react";

type Event = {
  id: string;
  title: string;
  date: string;
  type: string;
  description?: string | null;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/events`);
        const data = await res.json();
        if (data.success) setEvents(data.data);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Hero */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-sm font-bold uppercase tracking-[0.3em]"
          >
            <Calendar className="w-4 h-4" />
            Events
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-heading font-extrabold text-foreground dark:text-white"
          >
            Academic & Campus <span className="text-gradient">Calendar</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-foreground/60 dark:text-gray-400 max-w-2xl mx-auto font-bangla"
          >
            পরীক্ষার সময়সূচি, ছুটি, সভা-মিটিং এবং বিভিন্ন সাংস্কৃতিক অনুষ্ঠানের তারিখ এক জায়গায়।
          </motion.p>
        </div>

        {/* List */}
        {isLoading ? (
          <p className="text-center text-foreground/60 dark:text-gray-400 text-sm">Loading events...</p>
        ) : events.length === 0 ? (
          <div className="glass rounded-3xl border border-dashed border-foreground/15 dark:border-white/10 py-16 flex flex-col items-center gap-3">
            <Calendar className="w-10 h-10 text-gray-600" />
            <p className="text-foreground/60 dark:text-gray-400 text-sm font-bangla">
              আপাতত কোনো ইভেন্ট নির্ধারিত নেই। শীঘ্রই নতুন ইভেন্ট যোগ করা হবে।
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((ev, i) => (
              <motion.div
                key={ev.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-3xl border border-foreground/10 dark:border-white/5 p-5 flex gap-4 items-start"
              >
                <div className="flex flex-col items-center justify-center px-4 py-3 rounded-2xl bg-foreground/5 dark:bg-white/5 border border-foreground/15 dark:border-white/10">
                  <span className="text-xs font-semibold text-foreground/60 dark:text-gray-400 uppercase">
                    {new Date(ev.date).toLocaleDateString("en-US", {
                      month: "short",
                    })}
                  </span>
                  <span className="text-2xl font-heading font-bold text-foreground dark:text-white">
                    {new Date(ev.date).getDate()}
                  </span>
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="text-lg font-heading font-semibold text-foreground dark:text-white">
                    {ev.title}
                  </h3>
                  <p className="text-xs font-semibold text-brand-purple uppercase tracking-[0.25em]">
                    {ev.type}
                  </p>
                  {ev.description && (
                    <p className="text-sm text-foreground/60 dark:text-gray-400 mt-1 font-bangla">
                      {ev.description}
                    </p>
                  )}
                  <p className="text-[11px] text-foreground/50 dark:text-gray-500 flex items-center gap-2 mt-1">
                    <Clock4 className="w-3.5 h-3.5" />
                    {new Date(ev.date).toLocaleDateString()}
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      Campus
                    </span>
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

