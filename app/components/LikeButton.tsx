"use client";

import { useState } from "react";
import type { ContentType } from "@/lib/content-types";

interface LikeButtonProps {
  contentType: ContentType;
  contentId: string;
  initialCount?: number;
}

export default function LikeButton({ contentType, contentId, initialCount = 0 }: LikeButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLike() {
    if (liked || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType, contentId }),
      });
      const data = await res.json();
      if (res.ok) {
        setCount(data.likeCount);
        setLiked(true);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLike}
      disabled={liked || loading}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
        liked
          ? "bg-[#E85A5A] text-white"
          : "bg-white text-[#8B8680] hover:bg-[#F5F0E8] border border-[#E8E2D9]"
      }`}
    >
      <span>{liked ? "♥" : "♡"}</span>
      <span>{count} {count === 1 ? "like" : "likes"}</span>
    </button>
  );
}
