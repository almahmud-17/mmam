"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Bell, Plus, Trash2, Loader2, X, AlertTriangle, FileText, Info, Sparkles, Pin } from "lucide-react";
import { useState, useEffect } from "react";

interface Notice {
  id: string;
  title: string;
  content: string;
  type: string;
  featuredOnHome?: boolean;
  floatOnHome?: boolean;
  createdAt: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export default function NoticesManager({ allowHomeFlags = false }: { allowHomeFlags?: boolean }) {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchNotices = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/notices`);
      const data = await response.json();
      if (data.success) setNotices(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const closeModal = () => {
    setIsAdding(false);
    setEditingNotice(null);
    setError(null);
  };

  const handleAddOrEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title");
    const content = formData.get("content");
    const type = formData.get("type");
    const featuredOnHome = allowHomeFlags && formData.get("featuredOnHome") === "on";
    const floatOnHome = allowHomeFlags && formData.get("floatOnHome") === "on";

    try {
      const token = localStorage.getItem("token");
      const url = editingNotice ? `${API_BASE_URL}/api/notices/${editingNotice.id}` : `${API_BASE_URL}/api/notices`;
      const method = editingNotice ? "PUT" : "POST";

      const body: Record<string, unknown> = { title, content, type };
      if (allowHomeFlags) {
        body.featuredOnHome = featuredOnHome;
        body.floatOnHome = floatOnHome;
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (data.success) {
        closeModal();
        fetchNotices();
      } else {
        setError(data.error || "Failed to save notice.");
      }
    } catch {
      setError("Network error.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this notice?")) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/notices/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setNotices(notices.filter((n) => n.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "EMERGENCY":
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case "ACADEMIC":
        return <FileText className="w-5 h-5 text-brand-purple" />;
      default:
        return <Info className="w-5 h-5 text-brand-pink" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground dark:text-white mb-2">
            <span className="hidden dark:inline">Notice Board</span>
            <span className="inline dark:hidden text-gradient-premium">Notice Board</span>
          </h1>
          <p className="text-foreground/60">
            {allowHomeFlags
              ? "Post updates; pin to the homepage board or floating strip from here."
              : "Post announcements for students and the public notice page."}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingNotice(null);
            setIsAdding(true);
          }}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-pink to-brand-purple text-white font-bold hover:neon-glow transition-all"
        >
          <Plus className="w-5 h-5" /> Post New Notice
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 text-brand-pink animate-spin" />
          <p className="text-foreground/60 dark:text-gray-400">Loading notices...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notices.map((notice) => (
            <motion.div
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              key={notice.id}
              className="glass p-6 md:p-8 rounded-[32px] border border-border flex flex-col md:flex-row gap-6 relative overflow-hidden group"
            >
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="p-2.5 rounded-xl bg-background/5 dark:bg-foreground/5 dark:bg-white/5 border border-border">
                    {getTypeIcon(notice.type)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-0.5">{notice.title}</h3>
                    <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
                      {new Date(notice.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {notice.featuredOnHome && (
                    <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-lg bg-brand-purple/15 text-brand-purple flex items-center gap-1">
                      <Pin className="w-3 h-3" /> Home board
                    </span>
                  )}
                  {notice.floatOnHome && (
                    <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-lg bg-brand-pink/15 text-brand-pink flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Floating
                    </span>
                  )}
                </div>
                <div className="text-foreground/60 leading-relaxed font-bangla whitespace-pre-line">{notice.content}</div>
              </div>
              <div className="flex items-center justify-end gap-3 min-w-[160px]">
                <button
                  type="button"
                  aria-label="Edit notice"
                  onClick={() => {
                    setEditingNotice(notice);
                    setIsAdding(true);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-foreground/60 hover:text-foreground bg-background/5 dark:bg-foreground/5 dark:bg-white/5 rounded-2xl transition-all border border-border"
                >
                  Edit
                </button>
                <button
                  type="button"
                  aria-label="Delete notice"
                  onClick={() => handleDelete(notice.id)}
                  className="p-3 text-foreground/40 hover:text-red-500 bg-background/5 dark:bg-foreground/5 dark:bg-white/5 hover:bg-red-500/10 rounded-2xl transition-all border border-border hover:border-red-500/20"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
          {notices.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Bell className="w-12 h-12 text-foreground/20" />
              <p className="text-foreground/40">No notices posted yet.</p>
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {(isAdding || editingNotice) && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-foreground/10 dark:bg-background/80 backdrop-blur-sm"
              onClick={closeModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass w-full max-w-xl p-8 rounded-[40px] border border-border relative z-10 max-h-[90vh] overflow-y-auto"
            >
              <button
                aria-label="Close notice editor"
                type="button"
                onClick={closeModal}
                className="absolute top-6 right-6 p-2 text-foreground/40 hover:text-foreground bg-background/5 dark:bg-foreground/5 dark:bg-white/5 rounded-xl transition-all"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-3xl font-heading font-bold text-foreground dark:text-white mb-8 flex items-center gap-3">
                <Bell className="text-brand-green dark:text-brand-pink" /> {editingNotice ? "Edit Notice" : "Create Notice"}
              </h2>
              <form onSubmit={handleAddOrEdit} className="space-y-6">
                {error && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground/40 uppercase ml-1">Title</label>
                  <input
                    name="title"
                    defaultValue={editingNotice?.title}
                    required
                    className="w-full bg-background/5 dark:bg-foreground/5 dark:bg-background/40 border border-border rounded-2xl py-4 px-6 text-foreground focus:border-brand-purple outline-none"
                    placeholder="Notice Title"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground/40 uppercase ml-1">Notice Content</label>
                  <textarea
                    name="content"
                    defaultValue={editingNotice?.content}
                    required
                    className="w-full bg-background/5 dark:bg-foreground/5 dark:bg-background/40 border border-border rounded-2xl py-4 px-6 text-foreground focus:border-brand-purple outline-none resize-none font-bangla"
                    rows={4}
                    placeholder="Write notice content here..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground/40 uppercase ml-1">Category</label>
                  <select
                    name="type"
                    aria-label="Notice category"
                    defaultValue={editingNotice?.type || "GENERAL"}
                    required
                    className="w-full bg-background/5 dark:bg-foreground/5 dark:bg-background/40 border border-border rounded-2xl py-4 px-6 text-foreground focus:border-brand-purple outline-none appearance-none cursor-pointer"
                  >
                    <option value="GENERAL" className="bg-card">
                      General Notice
                    </option>
                    <option value="ACADEMIC" className="bg-card">
                      Academic Update
                    </option>
                    <option value="EMERGENCY" className="bg-card">
                      Emergency Announcement
                    </option>
                  </select>
                </div>
                {allowHomeFlags && (
                  <div className="space-y-3 rounded-2xl border border-border p-4 bg-background/5">
                    <p className="text-xs font-bold text-foreground/50 uppercase">Homepage (admin)</p>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="featuredOnHome"
                        defaultChecked={editingNotice?.featuredOnHome}
                        className="mt-1 rounded border-border"
                      />
                      <span>
                        <span className="font-semibold text-foreground block">Prioritize on home notice board</span>
                        <span className="text-xs text-foreground/50">Shows higher in the scrolling list on the homepage.</span>
                      </span>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="floatOnHome"
                        defaultChecked={editingNotice?.floatOnHome}
                        className="mt-1 rounded border-border"
                      />
                      <span>
                        <span className="font-semibold text-foreground block">Floating notice on homepage</span>
                        <span className="text-xs text-foreground/50">Fixed corner chips visitors see while browsing the home page.</span>
                      </span>
                    </label>
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full py-5 rounded-2xl text-lg font-bold text-white bg-gradient-to-r from-brand-pink to-brand-purple hover:neon-glow transition-all"
                >
                  {editingNotice ? "Save Changes" : "Post Notice"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
