"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, Plus, Trash2, Loader2, X, Upload } from "lucide-react";
import { useState, useEffect } from "react";

interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  description?: string;
  createdAt: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export default function GalleryManager() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchGallery = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/gallery`);
      const data = await response.json();
      if (data.success) setItems(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const closeModal = () => {
    setIsAdding(false);
    setEditingItem(null);
    setError(null);
  };

  const handleAddOrEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    const file = formData.get("image");
    if (editingItem && (file instanceof File ? file.size === 0 : !file)) {
      const urlField = (formData.get("imageUrl") as string)?.trim();
      formData.set("imageUrl", urlField || editingItem.imageUrl);
    }

    try {
      const token = localStorage.getItem("token");
      const url = editingItem ? `${API_BASE_URL}/api/gallery/${editingItem.id}` : `${API_BASE_URL}/api/gallery`;
      const method = editingItem ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        closeModal();
        fetchGallery();
      } else {
        setError(data.error || "Failed to save item.");
      }
    } catch {
      setError("Network error.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this gallery item?")) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/gallery/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setItems(items.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground dark:text-foreground dark:text-white mb-2">
            <span className="hidden dark:inline">Gallery Management</span>
            <span className="inline dark:hidden text-gradient-premium">Gallery Management</span>
          </h1>
          <p className="text-foreground/60">Add or remove photos and media from the madrasah gallery.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingItem(null);
            setIsAdding(true);
          }}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-pink to-brand-purple text-white font-bold hover:neon-glow transition-all"
        >
          <Plus className="w-5 h-5" /> Add Gallery Item
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 text-brand-pink animate-spin" />
          <p className="text-foreground/40">Loading gallery...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              key={item.id}
              className="glass rounded-3xl border border-border overflow-hidden group relative bg-background/5 dark:bg-foreground/5 dark:bg-white/5"
            >
              <div className="aspect-video relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl.startsWith("http") ? item.imageUrl : `${API_BASE_URL}${item.imageUrl}`}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  aria-label="Delete gallery item"
                  className="absolute top-4 right-4 p-2 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-all backdrop-blur-md border border-red-500/30"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6 space-y-3">
                <h3 className="text-lg font-bold text-foreground mb-1">{item.title}</h3>
                {item.description && <p className="text-sm text-foreground/50 line-clamp-2">{item.description}</p>}
                <button
                  type="button"
                  aria-label="Edit gallery item"
                  onClick={() => {
                    setEditingItem(item);
                    setIsAdding(true);
                  }}
                  className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold text-foreground/60 hover:text-foreground bg-background/5 dark:bg-foreground/5 dark:bg-white/5 border border-border transition-colors"
                >
                  Edit
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {(isAdding || editingItem) && (
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
              className="glass w-full max-w-xl p-8 rounded-[40px] border-border relative z-10 max-h-[90vh] overflow-y-auto"
            >
              <button
                aria-label="Close gallery editor"
                type="button"
                onClick={closeModal}
                className="absolute top-6 right-6 p-2 text-foreground/60 dark:text-gray-400 hover:text-foreground bg-foreground/5 dark:bg-white/5 rounded-xl transition-all"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-3xl font-heading font-bold text-foreground mb-8 flex items-center gap-3">
                <ImageIcon className="text-brand-green dark:text-brand-pink" />
                {editingItem ? "Edit Gallery Item" : "Add To Gallery"}
              </h2>
              <form onSubmit={handleAddOrEdit} className="space-y-6">
                {error && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground/40 uppercase ml-1">Title</label>
                  <input
                    name="title"
                    defaultValue={editingItem?.title}
                    required
                    className="w-full bg-background/5 dark:bg-foreground/5 dark:bg-background/40 border border-border rounded-2xl py-4 px-6 text-foreground focus:border-brand-purple outline-none"
                    placeholder="Event Name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground/40 uppercase ml-1">Select Photo (from Gallery/File)</label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-pink/5 to-brand-purple/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      required={!editingItem}
                      className="w-full bg-background/5 dark:bg-foreground/5 dark:bg-background/40 border border-border rounded-2xl py-10 px-6 text-foreground focus:border-brand-purple outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-pink file:text-white hover:file:bg-brand-purple file:transition-colors cursor-pointer"
                    />
                  </div>
                  <p className="text-[10px] text-foreground/30 mt-1 italic pl-2">
                    {editingItem ? "Leave empty to keep the current image." : "Tap to browse your device."}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground/40 uppercase ml-1">Or provide Image URL (Optional)</label>
                  <div className="relative">
                    <Upload className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/30" />
                    <input
                      name="imageUrl"
                      defaultValue={editingItem?.imageUrl?.startsWith("http") ? editingItem.imageUrl : ""}
                      className="w-full bg-background/5 dark:bg-foreground/5 dark:bg-background/40 border border-border rounded-2xl py-4 pl-16 pr-6 text-foreground focus:border-brand-purple outline-none"
                      placeholder="https://..."
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground/40 uppercase ml-1">Description (Optional)</label>
                  <textarea
                    name="description"
                    defaultValue={editingItem?.description}
                    className="w-full bg-background/5 dark:bg-foreground/5 dark:bg-background/40 border border-border rounded-2xl py-4 px-6 text-foreground focus:border-brand-purple outline-none resize-none"
                    rows={3}
                    placeholder="Briefly describe the photo..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-5 rounded-2xl text-lg font-bold text-white bg-gradient-to-r from-brand-pink to-brand-purple hover:neon-glow transition-all"
                >
                  {editingItem ? "Update Item" : "Upload Item"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
