"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CONTENT_TYPES, type ContentType } from "@/lib/content-types";
import { normalizePlainText, novelPlainContent } from "@/lib/plain-text";
import { publishDateFromDoc, todayDateInputValue } from "@/lib/publish-date";

type Tab = ContentType | "comments";

interface AdminComment {
  _id: string;
  contentType: string;
  contentId: string;
  name: string;
  email: string;
  text: string;
  hidden: boolean;
}

const adminFetch = (input: RequestInfo | URL, init?: RequestInit) =>
  fetch(input, { ...init, credentials: "include" });

function emptyContentForm(fields: Record<string, string>): Record<string, string> {
  return { publishDate: todayDateInputValue(), ...fields };
}

const EMPTY_FORMS: Record<ContentType, Record<string, string>> = {
  books: emptyContentForm({ title: "", author: "", cover: "", description: "", content: "" }),
  novels: emptyContentForm({ title: "", author: "", cover: "", description: "", content: "" }),
  poems: emptyContentForm({ title: "", author: "", cover: "", content: "" }),
  articles: emptyContentForm({ title: "", author: "", summary: "", content: "" }),
  blogs: emptyContentForm({ title: "", author: "", cover: "", excerpt: "", content: "" }),
};

const FIELD_LABELS: Record<string, string> = {
  publishDate: "Publish date",
  title: "Title",
  author: "Author",
  cover: "Cover image URL",
  description: "Description (plain text)",
  content: "Content (plain text)",
  summary: "Summary (plain text)",
  excerpt: "Excerpt (plain text)",
};

const LONG_TEXT_FIELDS = new Set([
  "content",
  "description",
  "summary",
  "excerpt",
  "analysis",
]);

const COVER_FIELDS = new Set(["cover"]);

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [tab, setTab] = useState<Tab>("books");
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [comments, setComments] = useState<AdminComment[]>([]);
  const [form, setForm] = useState(EMPTY_FORMS.books);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    adminFetch("/api/admin/auth")
      .then((res) => {
        if (res.ok) setAuthed(true);
      })
      .catch(() => {});
  }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    const res = await adminFetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthed(true);
      setLoginError("");
    } else {
      setLoginError("Wrong password");
    }
  }

  async function logout() {
    await adminFetch("/api/admin/auth", { method: "DELETE" });
    setAuthed(false);
  }

  async function loadData() {
    if (!authed) return;
    setLoading(true);
    setMessage("");
    try {
      if (tab === "comments") {
        const res = await adminFetch("/api/admin/comments");
        if (res.status === 401) {
          setAuthed(false);
          return;
        }
        setComments(await res.json());
      } else {
        const res = await adminFetch(`/api/admin/${tab}`);
        if (res.status === 401) {
          setAuthed(false);
          return;
        }
        setItems(await res.json());
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!authed) return;

    let cancelled = false;

    (async () => {
      setLoading(true);
      setMessage("");
      try {
        if (tab === "comments") {
          const res = await adminFetch("/api/admin/comments");
          if (cancelled) return;
          if (res.status === 401) {
            setAuthed(false);
            return;
          }
          setComments(await res.json());
        } else {
          const res = await adminFetch(`/api/admin/${tab}`);
          if (cancelled) return;
          if (res.status === 401) {
            setAuthed(false);
            return;
          }
          setItems(await res.json());
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [tab, authed]);

  async function saveItem(e: React.FormEvent) {
    e.preventDefault();
    if (tab === "comments") return;
    const type = tab as ContentType;
    const url = editingId ? `/api/admin/${type}/${editingId}` : `/api/admin/${type}`;
    const method = editingId ? "PUT" : "POST";
    const res = await adminFetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setMessage(editingId ? "Updated!" : "Created!");
      setForm(EMPTY_FORMS[type]);
      setEditingId(null);
      loadData();
    } else {
      setMessage("Save failed");
    }
  }

  async function deleteItem(id: string) {
    if (tab === "comments" || !confirm("Delete this item?")) return;
    await adminFetch(`/api/admin/${tab}/${id}`, { method: "DELETE" });
    loadData();
  }

  async function moderateComment(id: string, action: "hide" | "show" | "delete") {
    if (action === "delete" && !confirm("Delete comment permanently?")) return;
    await adminFetch(`/api/admin/comments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        action === "delete" ? { delete: true } : { hidden: action === "hide" }
      ),
    });
    loadData();
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center p-6">
        <form onSubmit={login} className="bg-white rounded-2xl p-8 shadow-lg w-full max-w-sm">
          <h1 className="text-2xl font-serif text-[#2D2D2D] mb-6">Admin login</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            className="w-full px-4 py-3 rounded-xl border border-[#E8E2D9] mb-4 text-sm"
          />
          {loginError && <p className="text-sm text-red-500 mb-4">{loginError}</p>}
          <button type="submit" className="w-full py-3 bg-[#2D2D2D] text-white rounded-xl text-sm font-medium">
            Sign in
          </button>
          <Link href="/" className="block text-center text-sm text-[#8B8680] mt-4 hover:text-[#E85A5A]">
            ← Back to site
          </Link>
        </form>
      </div>
    );
  }

  const formFields = tab !== "comments" ? Object.keys(EMPTY_FORMS[tab as ContentType]) : [];

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <header className="bg-white border-b border-[#E8E2D9] px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-serif text-[#2D2D2D]">Khongora Admin</h1>
        <div className="flex gap-4">
          <Link href="/" className="text-sm text-[#8B8680] hover:text-[#E85A5A]">View site</Link>
          <button type="button" onClick={logout} className="text-sm text-[#8B8680] hover:text-[#E85A5A]">
            Log out
          </button>
        </div>
      </header>

      <div className="flex flex-wrap gap-2 p-4 border-b border-[#E8E2D9] bg-[#FAF8F5]">
        {[...CONTENT_TYPES, "comments" as const].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => {
              setTab(t);
              if (t !== "comments") {
                setForm(EMPTY_FORMS[t as ContentType]);
                setEditingId(null);
              }
            }}
            className={`px-4 py-2 rounded-full text-sm capitalize ${
              tab === t ? "bg-[#E85A5A] text-white" : "bg-white text-[#8B8680]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="p-6 max-w-6xl mx-auto">
        {message && <p className="mb-4 text-sm text-green-600">{message}</p>}
        {loading && <p className="text-sm text-[#8B8680]">Loading...</p>}

        {tab !== "comments" && (
          <form onSubmit={saveItem} className="bg-white rounded-2xl p-6 mb-8 shadow-sm space-y-3">
            <h2 className="font-semibold text-[#2D2D2D]">
              {editingId ? "Edit" : "Add new"} {tab.slice(0, -1)}
            </h2>
            <p className="text-xs text-[#8B8680] -mt-1">
              Plain text only — line breaks are kept. No HTML or markdown.
            </p>
            {formFields.map((field) => (
              <div key={field}>
                <label className="text-xs text-[#8B8680] block mb-1">
                  {FIELD_LABELS[field] ?? field}
                </label>
                {field === "publishDate" ? (
                  <input
                    type="date"
                    value={form.publishDate ?? ""}
                    onChange={(e) => setForm({ ...form, publishDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#E8E2D9] text-sm"
                    required
                  />
                ) : COVER_FIELDS.has(field) ? (
                  <>
                    <input
                      type="url"
                      value={form[field] ?? ""}
                      onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                      placeholder="https://example.com/cover.jpg"
                      className="w-full px-3 py-2 rounded-lg border border-[#E8E2D9] text-sm"
                    />
                    {form[field]?.trim() ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={form[field]}
                        alt="Cover preview"
                        className="mt-2 w-24 h-32 object-cover rounded-lg border border-[#E8E2D9]"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : null}
                  </>
                ) : LONG_TEXT_FIELDS.has(field) ? (
                  <textarea
                    value={form[field] ?? ""}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    rows={field === "content" ? 12 : 4}
                    placeholder="Plain text…"
                    className="w-full px-3 py-2 rounded-lg border border-[#E8E2D9] text-sm leading-relaxed"
                  />
                ) : (
                  <input
                    value={form[field] ?? ""}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#E8E2D9] text-sm"
                  />
                )}
              </div>
            ))}
            <div className="flex gap-2">
              <button type="submit" className="px-6 py-2 bg-[#2D2D2D] text-white rounded-lg text-sm">
                {editingId ? "Update" : "Create"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm(EMPTY_FORMS[tab as ContentType]);
                  }}
                  className="px-6 py-2 bg-[#F5F0E8] text-[#8B8680] rounded-lg text-sm"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        )}

        {tab === "comments" ? (
          <ul className="space-y-3">
            {comments.map((c) => (
              <li key={c._id} className={`bg-white rounded-xl p-4 shadow-sm ${c.hidden ? "opacity-50" : ""}`}>
                <p className="text-sm text-[#2D2D2D]">{c.text}</p>
                <p className="text-xs text-[#8B8680] mt-2">
                  {c.name} · {c.email} · {c.contentType}/{c.contentId}
                  {c.hidden && " · hidden"}
                </p>
                <div className="flex gap-2 mt-3">
                  {!c.hidden && (
                    <button type="button" onClick={() => moderateComment(c._id, "hide")} className="text-xs text-amber-600">
                      Hide
                    </button>
                  )}
                  {c.hidden && (
                    <button type="button" onClick={() => moderateComment(c._id, "show")} className="text-xs text-green-600">
                      Show
                    </button>
                  )}
                  <button type="button" onClick={() => moderateComment(c._id, "delete")} className="text-xs text-red-600">
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li key={String(item._id)} className="bg-white rounded-xl p-4 shadow-sm flex justify-between gap-4">
                <div>
                  <p className="font-medium text-[#2D2D2D]">{String(item.title)}</p>
                  <p className="text-xs text-[#8B8680]">
                    {String(item.author)} ·{" "}
                    {item.publishedAt || item.uploadedAt
                      ? new Date(String(item.publishedAt ?? item.uploadedAt)).toLocaleDateString()
                      : ""}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(String(item._id));
                      const f: Record<string, string> = {};
                      formFields.forEach((field) => {
                        if (field === "publishDate") {
                          f.publishDate = publishDateFromDoc(item);
                          return;
                        }
                        let value = String(item[field] ?? "");
                        if (field === "cover") {
                          value = String(item.cover ?? item.coverImage ?? "");
                        }
                        if (field === "content" && tab === "blogs") {
                          value = String(item.content ?? item.body ?? "");
                        }
                        if (field === "content" && tab === "novels") {
                          value = novelPlainContent(item);
                        }
                        if (LONG_TEXT_FIELDS.has(field)) {
                          value = normalizePlainText(value);
                        }
                        f[field] = value;
                      });
                      setForm(f);
                    }}
                    className="text-xs text-[#E85A5A]"
                  >
                    Edit
                  </button>
                  <button type="button" onClick={() => deleteItem(String(item._id))} className="text-xs text-red-600">
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
