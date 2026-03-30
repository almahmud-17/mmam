"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Plus, Trash2, Edit2, Loader2, X } from "lucide-react";

type Event = {
  id: string;
  title: string;
  date: string;
  type: string;
  description?: string | null;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Event | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/events`);
      const data = await res.json();
      if (data.success) setEvents(data.data);
    } catch {
      setError("Failed to load events. Make sure backend is running.");
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
      title: formData.get("title"),
      date: formData.get("date"),
      type: formData.get("type"),
      description: formData.get("description"),
    };

    try {
      const token = localStorage.getItem("token");
      const url = editing
        ? `${API_BASE_URL}/api/events/${editing.id}`
        : `${API_BASE_URL}/api/events`;
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
        setError(data.error || "Failed to save event.");
      }
    } catch {
      setError("Network error.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/events/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setEvents((prev) => prev.filter((e) => e.id !== id));
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground dark:text-foreground dark:text-white mb-2">
            <span className="hidden dark:inline">Events & Calendar</span>
            <span className="inline dark:hidden text-gradient-premium">Events & Calendar</span>
          </h1>
          <p className="text-foreground/60">
            Manage all upcoming events shown on the public calendar page.
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
          Add Event
        </button>
      </div>

      {isLoading ? (
        <div className="glass rounded-3xl border border-border py-16 flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-brand-pink animate-spin" />
          <p className="text-foreground/40 text-sm">Loading events...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="glass rounded-3xl border border-dashed border-border py-16 flex flex-col items-center gap-3">
          <Calendar className="w-10 h-10 text-foreground/20" />
          <p className="text-foreground/40 text-sm">No events yet. Add your first event.</p>
        </div>
      ) : (
        <div className="glass rounded-3xl border border-border overflow-hidden">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-background/5 dark:bg-foreground/5 dark:bg-white/5 text-foreground/40 text-xs uppercase tracking-wider">
              <tr>
                <th className="p-3 pl-6">Date</th>
                <th className="p-3">Title</th>
                <th className="p-3">Type</th>
                <th className="p-3">Description</th>
                <th className="p-3 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {events.map((ev) => (
                <tr key={ev.id}>
                  <td className="p-3 pl-6 text-foreground/60">
                    {new Date(ev.date).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-foreground font-medium">{ev.title}</td>
                  <td className="p-3 text-xs font-semibold text-brand-purple uppercase">
                    {ev.type}
                  </td>
                  <td className="p-3 text-xs text-foreground/40 max-w-xs truncate">
                    {ev.description}
                  </td>
                  <td className="p-3 pr-6 text-right space-x-2">
                    <button
                      type="button"
                      aria-label="Edit event"
                      onClick={() => {
                        setEditing(ev);
                        setIsOpen(true);
                      }}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-background/5 dark:bg-foreground/5 dark:bg-white/5 text-foreground/60 hover:text-foreground hover:bg-background/10 dark:hover:bg-foreground/10 dark:bg-white/10"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      aria-label="Delete event"
                      onClick={() => handleDelete(ev.id)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/10 text-red-500 hover:text-white hover:bg-red-500/40"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
                aria-label="Close event editor"
                onClick={() => {
                  setIsOpen(false);
                  setEditing(null);
                }}
                className="absolute top-6 right-6 p-2 text-foreground/40 hover:text-foreground bg-background/5 dark:bg-foreground/5 dark:bg-white/5 rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-2xl font-heading font-bold text-foreground dark:text-foreground dark:text-white mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-brand-green dark:text-brand-pink" />
                {editing ? "Edit Event" : "Add Event"}
              </h2>

              {error && (
                <div className="mb-4 text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                <div>
                  <label className="text-xs font-semibold text-foreground/40 block mb-1" htmlFor="event-title">
                    Title
                  </label>
                  <input
                    id="event-title"
                    name="title"
                    defaultValue={editing?.title}
                    required
                    className="w-full bg-background/5 dark:bg-foreground/5 dark:bg-background/40 border border-border rounded-xl px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/40"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-foreground/40 block mb-1" htmlFor="event-date">
                      Date
                    </label>
                    <input
                      id="event-date"
                      name="date"
                      type="date"
                      defaultValue={editing ? editing.date.slice(0, 10) : ""}
                      required
                      className="w-full bg-background/5 dark:bg-foreground/5 dark:bg-background/40 border border-border rounded-xl px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/40"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground/40 block mb-1" htmlFor="event-type">
                      Type
                    </label>
                    <select
                      id="event-type"
                      name="type"
                      defaultValue={editing?.type || "ACADEMIC"}
                      className="w-full bg-background/5 dark:bg-foreground/5 dark:bg-background/40 border border-border rounded-xl px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/40"
                    >
                      <option value="ACADEMIC" className="bg-background">Academic</option>
                      <option value="HOLIDAY" className="bg-background">Holiday</option>
                      <option value="CULTURAL" className="bg-background">Cultural</option>
                      <option value="OTHER" className="bg-background">Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground/40 block mb-1" htmlFor="event-description">
                    Description
                  </label>
                  <textarea
                    id="event-description"
                    name="description"
                    defaultValue={editing?.description || ""}
                    rows={3}
                    className="w-full bg-background/5 dark:bg-foreground/5 dark:bg-background/40 border border-border rounded-xl px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/40 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-brand-pink to-brand-purple text-white text-sm font-semibold hover:neon-glow"
                >
                  {editing ? "Save Changes" : "Add Event"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

