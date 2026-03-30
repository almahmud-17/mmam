"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Award, BarChart2, Sparkles } from "lucide-react";

type Staff = {
  id: string;
  name: string;
  role: string;
  bio?: string | null;
  imageUrl?: string | null;
  isHead: boolean;
  sortOrder: number;
};

type Stat = {
  id: string;
  key: string;
  label: string;
  value: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export default function WebsiteContentPage() {
  const [activeTab, setActiveTab] = useState<"staff" | "stats" | "daily">("staff");

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground dark:text-foreground dark:text-white mb-2">
            <span className="hidden dark:inline">Website Content</span>
            <span className="inline dark:hidden text-gradient-premium">Website Content</span>
          </h1>
          <p className="text-foreground/60">
            Leadership, stats, and the floating Quran / Hadith / motivation strip on the homepage.
          </p>
        </div>
      </div>

      <div className="inline-flex flex-wrap gap-1 rounded-full bg-background/5 dark:bg-foreground/5 dark:bg-background/40 border border-border p-1">
        <button
          type="button"
          onClick={() => setActiveTab("staff")}
          className={`px-4 py-2 text-sm font-semibold rounded-full flex items-center gap-2 ${activeTab === "staff" ? "bg-card text-foreground" : "text-foreground/40 hover:text-foreground"
            }`}
        >
          <Users className="w-4 h-4" />
          Leadership & Teachers
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("stats")}
          className={`px-4 py-2 text-sm font-semibold rounded-full flex items-center gap-2 ${activeTab === "stats" ? "bg-card text-foreground" : "text-foreground/40 hover:text-foreground"
            }`}
        >
          <BarChart2 className="w-4 h-4" />
          Homepage Stats
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("daily")}
          className={`px-4 py-2 text-sm font-semibold rounded-full flex items-center gap-2 ${activeTab === "daily" ? "bg-card text-foreground" : "text-foreground/40 hover:text-foreground"
            }`}
        >
          <Sparkles className="w-4 h-4" />
          Daily inspiration
        </button>
      </div>

      {activeTab === "staff" ? <StaffManager /> : activeTab === "stats" ? <StatsManager /> : <HomeDailyEditor />}
    </div>
  );
}

function StaffManager() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState<Staff | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/staff`);
      const data = await res.json();
      if (data.success) {
        setStaff(data.data);
      } else {
        setError(data.error || "Failed to fetch staff.");
      }
    } catch {
      setError("Network error. Make sure backend is running.");
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
      name: formData.get("name"),
      role: formData.get("role"),
      bio: formData.get("bio"),
      imageUrl: formData.get("imageUrl"),
      isHead: formData.get("isHead") === "on",
      sortOrder: Number(formData.get("sortOrder") || 0),
    };

    try {
      const token = localStorage.getItem("token");
      const url = editing
        ? `${API_BASE_URL}/api/staff/${editing.id}`
        : `${API_BASE_URL}/api/staff`;
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
        setEditing(null);
        (e.target as HTMLFormElement).reset();
        load();
      } else {
        setError(data.error || "Failed to save profile.");
      }
    } catch {
      setError("Network error.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this profile from website?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/staff/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setStaff((prev) => prev.filter((s) => s.id !== id));
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl border border-border p-6 lg:col-span-2"
      >
        <h2 className="text-xl font-heading font-bold text-foreground mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-brand-green dark:text-brand-pink" />
          Current Leadership Cards
        </h2>

        {isLoading ? (
          <p className="text-foreground/40 text-sm">Loading profiles...</p>
        ) : staff.length === 0 ? (
          <p className="text-foreground/40 text-sm">No profiles yet. Add from the form on the right.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {staff.map((person) => (
              <div
                key={person.id}
                className="flex gap-4 p-4 rounded-2xl bg-background/5 dark:bg-foreground/5 dark:bg-background/40 border border-border"
              >
                <div className="w-16 h-16 rounded-2xl bg-background/5 dark:bg-foreground/5 dark:bg-white/5 flex items-center justify-center overflow-hidden">
                  {person.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={person.imageUrl}
                      alt={person.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Users className="w-8 h-8 text-foreground dark:text-white/20" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-foreground">{person.name}</p>
                  <p className="text-xs text-brand-purple font-semibold">
                    {person.role}
                    {person.isHead ? " • Head" : ""}
                  </p>
                  {person.bio && (
                    <p className="text-xs text-foreground/40 mt-1 line-clamp-2">{person.bio}</p>
                  )}
                  <div className="flex gap-2 mt-3">
                    <button
                      type="button"
                      onClick={() => setEditing(person)}
                      className="px-3 py-1.5 text-[11px] font-semibold rounded-full bg-background/5 dark:bg-foreground/5 dark:bg-white/5 text-foreground/80 hover:text-foreground border border-border"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(person.id)}
                      className="px-3 py-1.5 text-[11px] font-semibold rounded-full bg-red-500/10 text-red-500 hover:text-white border border-red-500/20"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl border border-border p-6"
      >
        <h2 className="text-lg font-heading font-bold text-foreground mb-4">
          {editing ? "Edit Profile" : "Add New Profile"}
        </h2>
        {error && (
          <div className="mb-4 text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="text-xs font-semibold text-foreground/40 block mb-1" htmlFor="staff-name">Name</label>
            <input
              id="staff-name"
              name="name"
              defaultValue={editing?.name}
              required
              className="w-full bg-background/5 dark:bg-foreground/5 dark:bg-background/40 border border-border rounded-xl px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/40"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground/40 block mb-1" htmlFor="staff-role">Role / Position</label>
            <input
              id="staff-role"
              name="role"
              defaultValue={editing?.role}
              required
              className="w-full bg-background/5 dark:bg-foreground/5 dark:bg-background/40 border border-border rounded-xl px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/40"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground/40 block mb-1" htmlFor="staff-image">Photo URL</label>
            <input
              id="staff-image"
              name="imageUrl"
              defaultValue={editing?.imageUrl || ""}
              placeholder="https://..."
              className="w-full bg-background/5 dark:bg-foreground/5 dark:bg-background/40 border border-border rounded-xl px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/40"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground/40 block mb-1" htmlFor="staff-bio">Short Bio</label>
            <textarea
              id="staff-bio"
              name="bio"
              defaultValue={editing?.bio || ""}
              rows={3}
              className="w-full bg-background/5 dark:bg-foreground/5 dark:bg-background/40 border border-border rounded-xl px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/40 resize-none"
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <label className="flex items-center gap-2 text-xs text-foreground/60">
              <input
                type="checkbox"
                name="isHead"
                defaultChecked={editing?.isHead}
                className="rounded border-border bg-background/5 dark:bg-foreground/5 dark:bg-background/40"
              />
              Head of institution
            </label>
            <div className="flex items-center gap-2 text-xs text-foreground/60">
              <label htmlFor="staff-order">Order</label>
              <input
                id="staff-order"
                type="number"
                name="sortOrder"
                defaultValue={editing?.sortOrder ?? 0}
                className="w-16 bg-background/5 dark:bg-foreground/5 dark:bg-background/40 border border-border rounded-lg px-2 py-1 text-xs text-foreground focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-brand-pink to-brand-purple text-white text-sm font-semibold hover:neon-glow"
          >
            {editing ? "Save Changes" : "Add To Homepage"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

function StatsManager() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/stats`);
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      } else {
        setError(data.error || "Failed to fetch stats.");
      }
    } catch {
      setError("Network error.");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleUpdate = async (stat: Stat, value: string, label: string) => {
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/stats/${stat.key}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ value, label }),
      });
      const data = await res.json();
      if (data.success) {
        setStats((prev) =>
          prev.map((s) => (s.key === stat.key ? { ...s, value, label } : s))
        );
      } else {
        setError(data.error || "Failed to update stat.");
      }
    } catch {
      setError("Network error.");
    }
  };

  const importantOrder = ["TOTAL_STUDENTS", "TOTAL_TEACHERS", "ACHIEVEMENTS", "SUCCESS_RATE"];
  const ordered = [...stats].sort(
    (a, b) => importantOrder.indexOf(a.key) - importantOrder.indexOf(b.key)
  );

  return (
    <div className="glass rounded-3xl border border-border p-6 space-y-4">
      <h2 className="text-xl font-heading font-bold text-foreground mb-2 flex items-center gap-2">
        <Award className="w-5 h-5 text-brand-green dark:text-brand-pink" />
        Homepage Stats (Students, Teachers, Achievements, Success Rate)
      </h2>
      {error && (
        <div className="mb-2 text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ordered.map((stat) => (
          <StatCard key={stat.id} stat={stat} onSave={handleUpdate} />
        ))}
      </div>
    </div>
  );
}

function HomeDailyEditor() {
  const [quranText, setQuranText] = useState("");
  const [quranRef, setQuranRef] = useState("");
  const [hadithText, setHadithText] = useState("");
  const [hadithRef, setHadithRef] = useState("");
  const [motivational, setMotivational] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/home-content`);
      const data = await res.json();
      if (data.success && data.data) {
        setQuranText(data.data.quranText || "");
        setQuranRef(data.data.quranRef || "");
        setHadithText(data.data.hadithText || "");
        setHadithRef(data.data.hadithRef || "");
        setMotivational(data.data.motivational || "");
      }
    } catch {
      setError("Could not load. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/home-content`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          quranText,
          quranRef,
          hadithText,
          hadithRef,
          motivational,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Saved. Visitors will see this on the homepage floating strip.");
      } else {
        setError(data.error || "Save failed.");
      }
    } catch {
      setError("Network error.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <p className="text-foreground/50 text-sm py-12 text-center">Loading…</p>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <p className="text-sm text-foreground/60 max-w-2xl">
        These lines rotate in a glass bar at the bottom of the public homepage. Leave a field empty to hide that slide.
      </p>
      {message && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm">{message}</div>
      )}
      {error && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

      <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
        <div className="rounded-2xl border border-border p-6 space-y-4 bg-background/5">
          <h3 className="font-heading font-bold text-foreground">Quran (আয়াত)</h3>
          <textarea
            value={quranText}
            onChange={(e) => setQuranText(e.target.value)}
            rows={3}
            className="w-full bg-background/5 dark:bg-foreground/5 border border-border rounded-xl px-4 py-3 text-foreground font-bangla resize-none focus:outline-none focus:ring-2 focus:ring-brand-purple/40"
            placeholder="Arabic or Bangla translation…"
          />
          <input
            value={quranRef}
            onChange={(e) => setQuranRef(e.target.value)}
            className="w-full bg-background/5 dark:bg-foreground/5 border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-purple/40"
            placeholder="Reference e.g. সূরা আল-ইখলাস : ১"
          />
        </div>
        <div className="rounded-2xl border border-border p-6 space-y-4 bg-background/5">
          <h3 className="font-heading font-bold text-foreground">Hadith</h3>
          <textarea
            value={hadithText}
            onChange={(e) => setHadithText(e.target.value)}
            rows={3}
            className="w-full bg-background/5 dark:bg-foreground/5 border border-border rounded-xl px-4 py-3 text-foreground font-bangla resize-none focus:outline-none focus:ring-2 focus:ring-brand-purple/40"
            placeholder="হাদিসের বাংলা…"
          />
          <input
            value={hadithRef}
            onChange={(e) => setHadithRef(e.target.value)}
            className="w-full bg-background/5 dark:bg-foreground/5 border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-purple/40"
            placeholder="Source e.g. বুখারী ১২৩৪"
          />
        </div>
        <div className="rounded-2xl border border-border p-6 space-y-4 bg-background/5">
          <h3 className="font-heading font-bold text-foreground">Motivational line</h3>
          <textarea
            value={motivational}
            onChange={(e) => setMotivational(e.target.value)}
            rows={2}
            className="w-full bg-background/5 dark:bg-foreground/5 border border-border rounded-xl px-4 py-3 text-foreground font-bangla resize-none focus:outline-none focus:ring-2 focus:ring-brand-purple/40"
            placeholder="আজকের বার্তা…"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-brand-pink to-brand-purple hover:neon-glow disabled:opacity-50 transition-all"
        >
          {saving ? "Saving…" : "Save homepage strip"}
        </button>
      </form>
    </motion.div>
  );
}

function StatCard({
  stat,
  onSave,
}: {
  stat: Stat;
  onSave: (stat: Stat, value: string, label: string) => void;
}) {
  const [value, setValue] = useState(stat.value);
  const [label, setLabel] = useState(stat.label);

  return (
    <div className="rounded-2xl bg-background/5 dark:bg-foreground/5 dark:bg-background/40 border border-border p-4 space-y-3">
      <p className="text-[10px] font-mono text-foreground/30 uppercase tracking-[0.25em]">
        {stat.key}
      </p>
      <input
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        aria-label="Stat label"
        placeholder="Label shown on homepage"
        className="w-full bg-background/5 dark:bg-foreground/5 dark:bg-background/40 border border-border rounded-lg px-3 py-1.5 text-xs text-foreground/80 focus:outline-none focus:ring-2 focus:ring-brand-purple/40"
      />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label="Stat value"
        placeholder="e.g. 1500+ or 99%"
        className="w-full bg-background/5 dark:bg-foreground/5 dark:bg-background/40 border border-border rounded-lg px-3 py-2 text-sm text-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-brand-purple/40"
      />
      <button
        type="button"
        onClick={() => onSave(stat, value, label)}
        className="w-full mt-1 py-1.5 rounded-lg bg-gradient-to-r from-brand-pink to-brand-purple text-xs font-semibold text-white hover:neon-glow"
      >
        Save
      </button>
    </div>
  );
}

