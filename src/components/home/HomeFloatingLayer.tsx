"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Sparkles, Quote } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

type Daily = {
  quranText: string;
  quranRef: string;
  hadithText: string;
  hadithRef: string;
  motivational: string;
};

type Notice = {
  id: string;
  title: string;
  type: string;
  floatOnHome?: boolean;
  createdAt: string;
};

const slides = (d: Daily | null) => {
  const items: { key: string; label: string; text: string; sub?: string; icon: typeof BookOpen }[] = [];
  if (d?.quranText?.trim()) {
    items.push({
      key: "quran",
      label: "আজকের আয়াত",
      text: d.quranText.trim(),
      sub: d.quranRef?.trim() || undefined,
      icon: BookOpen,
    });
  }
  if (d?.hadithText?.trim()) {
    items.push({
      key: "hadith",
      label: "হাদিস",
      text: d.hadithText.trim(),
      sub: d.hadithRef?.trim() || undefined,
      icon: Quote,
    });
  }
  if (d?.motivational?.trim()) {
    items.push({
      key: "motivation",
      label: "প্রেরণা",
      text: d.motivational.trim(),
      icon: Sparkles,
    });
  }
  return items;
};

export function HomeFloatingLayer() {
  const [daily, setDaily] = useState<Daily | null>(null);
  const [floatNotices, setFloatNotices] = useState<Notice[]>([]);
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const [homeRes, noticeRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/home-content`),
          fetch(`${API_BASE_URL}/api/notices`),
        ]);
        const homeJson = await homeRes.json();
        const noticeJson = await noticeRes.json();
        if (homeJson.success && homeJson.data) {
          setDaily(homeJson.data);
        }
        if (noticeJson.success && Array.isArray(noticeJson.data)) {
          setFloatNotices(noticeJson.data.filter((n: Notice) => n.floatOnHome).slice(0, 5));
        }
      } catch {
        /* ignore */
      }
    };
    load();
  }, []);

  const items = slides(daily);

  useEffect(() => {
    if (items.length <= 1) return;
    const t = setInterval(() => {
      setSlideIndex((i) => (i + 1) % items.length);
    }, 9000);
    return () => clearInterval(t);
  }, [items.length]);

  if (items.length === 0 && floatNotices.length === 0) return null;

  return (
    <>
      {/* Bottom floating strip: Quran / Hadith / Motivation */}
      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-[45] pointer-events-none px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          <div className="pointer-events-auto max-w-4xl mx-auto">
            <div className="rounded-2xl border border-foreground/10 bg-background/75 dark:bg-background/70 backdrop-blur-xl backdrop-saturate-150 shadow-[0_-8px_40px_-12px_rgba(0,0,0,0.2)] overflow-hidden">
              <AnimatePresence mode="wait">
                {(() => {
                  const cur = items[slideIndex];
                  if (!cur) return null;
                  const Icon = cur.icon;
                  return (
                    <motion.div
                      key={cur.key}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.35 }}
                      className="px-4 py-3 md:px-6 md:py-4 flex gap-3 items-start"
                    >
                      <div className="p-2 rounded-xl bg-brand-pink/15 text-brand-pink shrink-0 mt-0.5">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-brand-purple mb-1">{cur.label}</p>
                        <p className="text-sm md:text-base text-foreground font-bangla leading-relaxed">{cur.text}</p>
                        {cur.sub && <p className="text-xs text-foreground/50 mt-1 font-medium">{cur.sub}</p>}
                      </div>
                    </motion.div>
                  );
                })()}
              </AnimatePresence>
              {items.length > 1 && (
                <div className="flex justify-center gap-1.5 pb-2">
                  {items.map((it, i) => (
                    <button
                      key={it.key}
                      type="button"
                      aria-label={`Show ${it.label}`}
                      onClick={() => setSlideIndex(i)}
                      className={`h-1.5 rounded-full transition-all ${i === slideIndex ? "w-6 bg-brand-pink" : "w-1.5 bg-foreground/20"}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating notices — desktop right; mobile above bottom strip */}
      {floatNotices.length > 0 && (
        <div
          className={`fixed z-[44] flex flex-col gap-2 w-[min(100%,18rem)] pointer-events-none ${
            items.length > 0 ? "bottom-28 md:bottom-32 right-2 md:right-4" : "bottom-[max(1rem,env(safe-area-inset-bottom))] right-2 md:right-4"
          }`}
        >
          {floatNotices.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              className="pointer-events-auto rounded-2xl border border-foreground/10 bg-background/85 dark:bg-card/90 backdrop-blur-xl shadow-lg p-3"
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[9px] font-bold uppercase text-brand-pink">{n.type}</span>
                <Sparkles className="w-3.5 h-3.5 text-brand-purple shrink-0" />
              </div>
              <Link href="/notices" className="text-sm font-bold font-bangla text-foreground hover:text-brand-pink leading-snug line-clamp-3 block transition-colors">
                {n.title}
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </>
  );
}
