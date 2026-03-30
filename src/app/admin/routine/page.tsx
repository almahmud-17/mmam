"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarRange, Plus, Trash2, Edit2, Loader2, X } from "lucide-react";

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

export default function AdminRoutinePage() {
  const [entries, setEntries] = useState<RoutineEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<RoutineEntry | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/routine`);
      const data = await res.json();
      if (data.success) setEntries(data.data);
    } catch {
      setError("Failed to load routine. Make sure backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const payload = {
      className: formData.get("className"),
      section: formData.get("section"),
      dayOfWeek: formData.get("dayOfWeek"),
      startTime: formData.get("startTime"),
      endTime: formData.get("endTime"),
      subject: formData.get("subject"),
      teacherName: formData.get("teacherName"),
      room: formData.get("room"),
    };

    try {
      const token = localStorage.getItem("token");
      const url = editing
        ? `${API_BASE_URL}/api/routine/${editing.id}`
        : `${API_BASE_URL}/api/routine`;
      const method = editing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setIsOpen(false);
        setEditing(null);
        (e.target as HTMLFormElement).reset();
        load();
      } else {
        setError(data.error || "Failed to save routine entry.");
      }
    } catch {
      setError("Network error.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this class from routine?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/routine/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setEntries((prev) => prev.filter((e) => e.id !== id));
      }
    } catch {
      // ignore
    }
  };

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
    <div className="max-w-7xl mx-auto space-y-8 relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground dark:text-foreground dark:text-white mb-2">
            <span className="hidden dark:inline">Class Routine</span>
            <span className="inline dark:hidden text-gradient-premium">Class Routine</span>
          </h1>
          <p className="text-foreground/60">
            Create and manage daily timetable for each class and section.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setIsOpen(true);
          }}
          className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-pink to-brand-purple hover:neon-glow transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Class Slot
        </button>
      </div>

      {isLoading ? (
        <div className="glass rounded-3xl border border-border py-16 flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-brand-pink animate-spin" />
          <p className="text-foreground/40 text-sm">Loading routine...</p>
        </div>
      ) : entries.length === 0 ? (
        <div className="glass rounded-3xl border border-dashed border-border py-16 flex flex-col items-center gap-3">
          <CalendarRange className="w-10 h-10 text-foreground/20" />
          <p className="text-foreground/40 text-sm">
            No routine entries yet. Add the first class slot.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([key, list]) => (
            <div key={key} className="glass rounded-3xl border border-border overflow-hidden">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <h2 className="text-sm font-heading font-semibold text-foreground">
                  {key}
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse min-w-[700px]">
                  <thead className="bg-background/5 dark:bg-foreground/5 dark:bg-white/5 text-foreground/40 uppercase tracking-wider">
                    <tr>
                      <th className="p-3 pl-6">Day</th>
                      <th className="p-3">Time</th>
                      <th className="p-3">Subject</th>
                      <th className="p-3">Teacher</th>
                      <th className="p-3">Room</th>
                      <th className="p-3 pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {list.map((slot) => (
                      <tr key={slot.id}>
                        <td className="p-3 pl-6 text-foreground/60">{slot.dayOfWeek}</td>
                        <td className="p-3 text-foreground/60">
                          {slot.startTime} – {slot.endTime}
                        </td>
                        <td className="p-3 text-foreground font-semibold">{slot.subject}</td>
                        <td className="p-3 text-foreground/60">{slot.teacherName}</td>
                        <td className="p-3 text-foreground/40">{slot.room}</td>
                        <td className="p-3 pr-6 text-right space-x-2">
                          <button
                            type="button"
                            aria-label="Edit routine slot"
                            onClick={() => {
                              setEditing(slot);
                              setIsOpen(true);
                            }}
                            className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-background/5 dark:bg-foreground/5 dark:bg-white/5 text-foreground/60 hover:text-foreground hover:bg-background/10 dark:hover:bg-foreground/10 dark:bg-white/10"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            aria-label="Delete routine slot"
                            onClick={() => handleDelete(slot.id)}
                            className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-red-500/10 text-red-500 hover:text-white hover:bg-red-500/40"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-foreground/10 dark:bg-background/80 backdrop-blur-sm"
              onClick={() => {
                setIsOpen(false);
                setEditing(null);
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass w-full max-w-xl p-8 rounded-[40px] border border-border relative z-10"
            >
              <button
                type="button"
                aria-label="Close routine editor"
                onClick={() => {
                  setIsOpen(false);
                  setEditing(null);
                }}
                className="absolute top-6 right-6 p-2 text-foreground/40 hover:text-foreground bg-background/5 dark:bg-foreground/5 dark:bg-white/5 rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-2xl font-heading font-bold text-foreground dark:text-foreground dark:text-white mb-6 flex items-center gap-2">
                <CalendarRange className="w-5 h-5 text-brand-green dark:text-brand-pink" />
                {editing ? "Edit Routine Slot" : "Add Routine Slot"}
              </h2>

              {error && (
                <div className="mb-4 text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-foreground/40 block mb-1" htmlFor="routine-class">
                      Class
                    </label>
                    <input
                      id="routine-class"
                      name="className"
                      defaultValue={editing?.className || "Class 10"}
                      required
                      className="w-full bg-background/5 dark:bg-foreground/5 dark:bg-background/40 border border-border rounded-xl px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/40"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground/40 block mb-1" htmlFor="routine-section">
                      Section
                    </label>
                    <input
                      id="routine-section"
                      name="section"
                      defaultValue={editing?.section || "A"}
                      required
                      className="w-full bg-background/5 dark:bg-foreground/5 dark:bg-background/40 border border-border rounded-xl px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/40"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-foreground/40 block mb-1" htmlFor="routine-day">
                      Day
                    </label>
                    <select
                      id="routine-day"
                      name="dayOfWeek"
                      defaultValue={editing?.dayOfWeek || "SAT"}
                      className="w-full bg-background/5 dark:bg-foreground/5 dark:bg-background/40 border border-border rounded-xl px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/40"
                    >
                      {DAYS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground/40 block mb-1" htmlFor="routine-start">
                      Start
                    </label>
                    <input
                      id="routine-start"
                      name="startTime"
                      type="time"
                      defaultValue={editing?.startTime || "09:00"}
                      required
                      className="w-full bg-background/5 dark:bg-foreground/5 dark:bg-background/40 border border-border rounded-xl px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/40"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground/40 block mb-1" htmlFor="routine-end">
                      End
                    </label>
                    <input
                      id="routine-end"
                      name="endTime"
                      type="time"
                      defaultValue={editing?.endTime || "09:45"}
                      required
                      className="w-full bg-background/5 dark:bg-foreground/5 dark:bg-background/40 border border-border rounded-xl px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground/40 block mb-1" htmlFor="routine-subject">
                    Subject
                  </label>
                  <input
                    id="routine-subject"
                    name="subject"
                    defaultValue={editing?.subject}
                    required
                    className="w-full bg-background/5 dark:bg-foreground/5 dark:bg-background/40 border border-border rounded-xl px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/40"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-foreground/40 block mb-1" htmlFor="routine-teacher">
                      Teacher Name
                    </label>
                    <input
                      id="routine-teacher"
                      name="teacherName"
                      defaultValue={editing?.teacherName}
                      className="w-full bg-background/5 dark:bg-foreground/5 dark:bg-background/40 border border-border rounded-xl px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/40"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground/40 block mb-1" htmlFor="routine-room">
                      Room
                    </label>
                    <input
                      id="routine-room"
                      name="room"
                      defaultValue={editing?.room || ""}
                      className="w-full bg-background/5 dark:bg-foreground/5 dark:bg-background/40 border border-border rounded-xl px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/40"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-brand-pink to-brand-purple text-white text-sm font-semibold hover:neon-glow"
                >
                  {editing ? "Save Changes" : "Add To Routine"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

