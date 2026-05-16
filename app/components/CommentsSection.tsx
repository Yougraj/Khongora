"use client";

import { useEffect, useState } from "react";
import type { ContentType } from "@/lib/content-types";
import { fetchJson, peekCache } from "@/lib/client-fetch";

interface Comment {
  _id: string;
  name: string;
  text: string;
  date: string;
}

interface CommentsSectionProps {
  contentType: ContentType;
  contentId: string;
}

export default function CommentsSection({ contentType, contentId }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function loadComments() {
    const url = `/api/comments?contentType=${contentType}&contentId=${contentId}`;
    const cached = peekCache<Comment[]>(url);
    if (cached) {
      setComments(cached);
      setLoading(false);
    }
    fetchJson<Comment[]>(url)
      .then((data) => setComments(Array.isArray(data) ? data : []))
      .catch(() => setComments([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadComments();
  }, [contentType, contentId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType, contentId, name, email, text }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to post comment");
        return;
      }
      setComments((prev) => [data, ...prev]);
      setText("");
    } catch {
      setError("Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm mt-8">
      <h2 className="text-lg font-semibold text-[#2D2D2D] mb-6">Comments</h2>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            required
            placeholder="Your name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-[#E8E2D9] text-sm focus:outline-none focus:ring-2 focus:ring-[#E85A5A]/30"
          />
          <input
            type="email"
            required
            placeholder="Your email * (not shown publicly)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-[#E8E2D9] text-sm focus:outline-none focus:ring-2 focus:ring-[#E85A5A]/30"
          />
        </div>
        <textarea
          required
          rows={3}
          placeholder="Write your comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-[#E8E2D9] text-sm focus:outline-none focus:ring-2 focus:ring-[#E85A5A]/30 resize-none"
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2.5 bg-[#2D2D2D] text-white rounded-full text-sm font-medium hover:bg-[#1A1A1A] disabled:opacity-50"
        >
          {submitting ? "Posting..." : "Post comment"}
        </button>
      </form>

      {loading ? (
        <p className="text-sm text-[#8B8680]">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-[#8B8680]">No comments yet. Be the first!</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((c) => (
            <li key={c._id} className="border-b border-[#F5F0E8] pb-4 last:border-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-[#2D2D2D] text-sm">{c.name}</span>
                <span className="text-xs text-[#A8A3A0]">{c.date}</span>
              </div>
              <p className="text-sm text-[#5A5A5A] leading-relaxed">{c.text}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
