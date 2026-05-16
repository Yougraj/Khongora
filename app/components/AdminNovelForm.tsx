"use client";

import { useState } from "react";
import { normalizePlainText } from "@/lib/plain-text";
import { normalizeEpisodesList, type NovelEpisode } from "@/lib/novel-episodes";
import { publishDateFromDoc, todayDateInputValue } from "@/lib/publish-date";

type NovelMode = "new" | "episode" | "edit";

export interface AdminNovelItem {
  _id: string;
  title: string;
  author: string;
  cover?: string;
  coverImage?: string;
  description?: string;
  episodes?: number;
  episodesList?: NovelEpisode[];
  publishedAt?: string;
  uploadedAt?: string;
}

const emptyNewNovel = () => ({
  publishDate: todayDateInputValue(),
  title: "",
  author: "",
  cover: "",
  description: "",
  episodeTitle: "Episode 1",
  episodeDuration: "25 min",
  content: "",
});

const emptyEpisode = () => ({
  publishDate: todayDateInputValue(),
  title: "",
  duration: "25 min",
  content: "",
});

type Props = {
  items: AdminNovelItem[];
  adminFetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
  onSaved: (message: string) => void;
  onReload: () => void;
};

export default function AdminNovelForm({ items, adminFetch, onSaved, onReload }: Props) {
  const [mode, setMode] = useState<NovelMode>("new");
  const [selectedNovelId, setSelectedNovelId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newForm, setNewForm] = useState(emptyNewNovel);
  const [episodeForm, setEpisodeForm] = useState(emptyEpisode);
  const [saving, setSaving] = useState(false);

  function resetEpisodeMode(novelId: string | null) {
    setSelectedNovelId(novelId);
    setEpisodeForm(emptyEpisode());
  }

  function startEdit(item: AdminNovelItem) {
    setEditingId(item._id);
    setMode("edit");
    setSelectedNovelId(item._id);
    setNewForm({
      publishDate: publishDateFromDoc(item as unknown as Record<string, unknown>),
      title: String(item.title ?? ""),
      author: String(item.author ?? ""),
      cover: String(item.cover ?? item.coverImage ?? ""),
      description: normalizePlainText(String(item.description ?? "")),
      episodeTitle: "Episode 1",
      episodeDuration: "25 min",
      content: "",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setMode("new");
    setSelectedNovelId(null);
    setNewForm(emptyNewNovel());
    setEpisodeForm(emptyEpisode());
  }

  async function saveNewOrEdit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingId ? `/api/admin/novels/${editingId}` : "/api/admin/novels";
      const method = editingId ? "PUT" : "POST";
      const res = await adminFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newForm),
      });
      if (res.ok) {
        onSaved(editingId ? "Novel updated!" : "Novel created!");
        cancelEdit();
        onReload();
      } else {
        onSaved("Save failed");
      }
    } finally {
      setSaving(false);
    }
  }

  async function saveEpisode(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedNovelId) {
      onSaved("Select a novel first");
      return;
    }
    setSaving(true);
    try {
      const res = await adminFetch(`/api/admin/novels/${selectedNovelId}/episodes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(episodeForm),
      });
      if (res.ok) {
        onSaved("Episode added!");
        setEpisodeForm(emptyEpisode());
        onReload();
      } else {
        const err = await res.json().catch(() => ({}));
        onSaved(err.error ?? "Failed to add episode");
      }
    } finally {
      setSaving(false);
    }
  }

  const selectedNovel = items.find((n) => n._id === selectedNovelId);
  const episodes = selectedNovel
    ? normalizeEpisodesList(selectedNovel.episodesList)
    : editingId
      ? normalizeEpisodesList(items.find((n) => n._id === editingId)?.episodesList)
      : [];

  const inputClass =
    "w-full px-3 py-2 rounded-lg border border-[#E8E2D9] text-sm";
  const labelClass = "text-xs text-[#8B8680] block mb-1";

  return (
    <div className="space-y-6 mb-8">
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["new", "New novel"],
            ["episode", "Add episode"],
          ] as const
        ).map(([m, label]) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              if (m === "new") {
                setEditingId(null);
                setSelectedNovelId(null);
                setNewForm(emptyNewNovel());
              }
              if (m === "episode" && !selectedNovelId && items[0]) {
                resetEpisodeMode(items[0]._id);
              }
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              mode === m && !editingId
                ? "bg-[#E85A5A] text-white"
                : "bg-white text-[#8B8680] border border-[#E8E2D9]"
            }`}
          >
            {label}
          </button>
        ))}
        {editingId && (
          <span className="px-4 py-2 rounded-full text-sm bg-[#2D2D2D] text-white">
            Editing novel
          </span>
        )}
      </div>

      {(mode === "new" || mode === "edit") && (
        <form
          onSubmit={saveNewOrEdit}
          className="bg-white rounded-2xl p-6 shadow-sm space-y-3"
        >
          <h2 className="font-semibold text-[#2D2D2D]">
            {editingId ? "Edit novel" : "Create new novel"}
          </h2>
          <p className="text-xs text-[#8B8680] -mt-1">
            Plain text only. Episode 1 is created with the novel.
          </p>

          <div>
            <label className={labelClass}>Publish date</label>
            <input
              type="date"
              value={newForm.publishDate}
              onChange={(e) => setNewForm({ ...newForm, publishDate: e.target.value })}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Title</label>
            <input
              value={newForm.title}
              onChange={(e) => setNewForm({ ...newForm, title: e.target.value })}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Author</label>
            <input
              value={newForm.author}
              onChange={(e) => setNewForm({ ...newForm, author: e.target.value })}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Cover image URL</label>
            <input
              type="url"
              value={newForm.cover}
              onChange={(e) => setNewForm({ ...newForm, cover: e.target.value })}
              placeholder="https://example.com/cover.jpg"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Description (plain text)</label>
            <textarea
              value={newForm.description}
              onChange={(e) => setNewForm({ ...newForm, description: e.target.value })}
              rows={3}
              className={`${inputClass} leading-relaxed`}
            />
          </div>

          {!editingId && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Episode 1 title</label>
                  <input
                    value={newForm.episodeTitle}
                    onChange={(e) =>
                      setNewForm({ ...newForm, episodeTitle: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Episode 1 duration</label>
                  <input
                    value={newForm.episodeDuration}
                    onChange={(e) =>
                      setNewForm({ ...newForm, episodeDuration: e.target.value })
                    }
                    placeholder="25 min"
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Episode 1 content (plain text)</label>
                <textarea
                  value={newForm.content}
                  onChange={(e) => setNewForm({ ...newForm, content: e.target.value })}
                  rows={10}
                  className={`${inputClass} leading-relaxed`}
                  required
                />
              </div>
            </>
          )}

          {editingId && episodes.length > 0 && (
            <div className="rounded-xl border border-[#E8E2D9] p-4 bg-[#FAF8F5]">
              <p className="text-sm font-medium text-[#2D2D2D] mb-2">
                Episodes ({episodes.length})
              </p>
              <ul className="space-y-2 text-sm text-[#5A5A5A]">
                {episodes.map((ep) => (
                  <li key={ep.id}>
                    {ep.id}. {ep.title}
                    <span className="text-[#A8A3A0]"> · {ep.duration}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => {
                  setMode("episode");
                  resetEpisodeMode(editingId);
                }}
                className="mt-3 text-sm text-[#E85A5A] hover:underline"
              >
                + Add another episode
              </button>
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-[#2D2D2D] text-white rounded-lg text-sm disabled:opacity-50"
            >
              {saving ? "Saving…" : editingId ? "Update novel" : "Create novel"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="px-6 py-2 bg-[#F5F0E8] text-[#8B8680] rounded-lg text-sm"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {mode === "episode" && (
        <form
          onSubmit={saveEpisode}
          className="bg-white rounded-2xl p-6 shadow-sm space-y-4"
        >
          <h2 className="font-semibold text-[#2D2D2D]">Add episode to novel</h2>
          <p className="text-xs text-[#8B8680] -mt-2">
            Choose a novel, then add the next episode.
          </p>

          {items.length === 0 ? (
            <p className="text-sm text-[#8B8680]">
              No novels yet. Create one with &ldquo;New novel&rdquo; first.
            </p>
          ) : (
            <>
              <div>
                <label className={labelClass}>Select novel</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
                  {items.map((novel) => {
                    const cover = novel.cover ?? novel.coverImage;
                    const count =
                      novel.episodes ??
                      normalizeEpisodesList(novel.episodesList).length;
                    const selected = selectedNovelId === novel._id;
                    return (
                      <button
                        key={novel._id}
                        type="button"
                        onClick={() => resetEpisodeMode(novel._id)}
                        className={`flex gap-3 p-3 rounded-xl border text-left transition-shadow ${
                          selected
                            ? "border-[#E85A5A] bg-[#FFF5F5] shadow-sm ring-1 ring-[#E85A5A]"
                            : "border-[#E8E2D9] bg-white hover:shadow-md"
                        }`}
                      >
                        <div className="w-14 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-b from-[#F5F0E8] to-[#E8E2D9]">
                          {cover ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={cover}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-[#8B8680]">
                              Novel
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-[#2D2D2D] text-sm line-clamp-2">
                            {novel.title}
                          </p>
                          <p className="text-xs text-[#8B8680] mt-0.5">{novel.author}</p>
                          <p className="text-[10px] text-[#E85A5A] mt-1 font-medium">
                            {count} episode{count === 1 ? "" : "s"}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedNovel && (
                <p className="text-sm text-[#5A5A5A]">
                  Adding episode {episodes.length + 1} to{" "}
                  <strong className="text-[#2D2D2D]">{selectedNovel.title}</strong>
                </p>
              )}

              <div>
                <label className={labelClass}>Publish date</label>
                <input
                  type="date"
                  value={episodeForm.publishDate}
                  onChange={(e) =>
                    setEpisodeForm({ ...episodeForm, publishDate: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Episode title</label>
                <input
                  value={episodeForm.title}
                  onChange={(e) =>
                    setEpisodeForm({ ...episodeForm, title: e.target.value })
                  }
                  placeholder={`Episode ${episodes.length + 1}`}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Duration</label>
                <input
                  value={episodeForm.duration}
                  onChange={(e) =>
                    setEpisodeForm({ ...episodeForm, duration: e.target.value })
                  }
                  placeholder="25 min"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Episode content (plain text)</label>
                <textarea
                  value={episodeForm.content}
                  onChange={(e) =>
                    setEpisodeForm({ ...episodeForm, content: e.target.value })
                  }
                  rows={12}
                  className={`${inputClass} leading-relaxed`}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={saving || !selectedNovelId}
                className="px-6 py-2 bg-[#2D2D2D] text-white rounded-lg text-sm disabled:opacity-50"
              >
                {saving ? "Saving…" : "Add episode"}
              </button>
            </>
          )}
        </form>
      )}

      <ul className="space-y-3">
        {items.map((item) => {
          const count =
            item.episodes ?? normalizeEpisodesList(item.episodesList).length;
          return (
            <li
              key={item._id}
              className="bg-white rounded-xl p-4 shadow-sm flex justify-between gap-4"
            >
              <div>
                <p className="font-medium text-[#2D2D2D]">{item.title}</p>
                <p className="text-xs text-[#8B8680]">
                  {item.author} · {count} episode{count === 1 ? "" : "s"}
                  {(item.publishedAt || item.uploadedAt) &&
                    ` · ${new Date(String(item.publishedAt ?? item.uploadedAt)).toLocaleDateString()}`}
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0 flex-wrap justify-end">
                <button
                  type="button"
                  onClick={() => {
                    resetEpisodeMode(item._id);
                    setMode("episode");
                    setEditingId(null);
                  }}
                  className="text-xs text-[#2D2D2D] font-medium"
                >
                  + Episode
                </button>
                <button
                  type="button"
                  onClick={() => startEdit(item)}
                  className="text-xs text-[#E85A5A]"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (!confirm("Delete this novel and all episodes?")) return;
                    await adminFetch(`/api/admin/novels/${item._id}`, {
                      method: "DELETE",
                    });
                    onSaved("Deleted");
                    if (editingId === item._id) cancelEdit();
                    onReload();
                  }}
                  className="text-xs text-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
