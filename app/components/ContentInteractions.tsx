"use client";

import LikeButton from "./LikeButton";
import CommentsSection from "./CommentsSection";
import type { ContentType } from "@/lib/content-types";

interface ContentInteractionsProps {
  contentType: ContentType;
  contentId: string;
  likeCount?: number;
}

export default function ContentInteractions({
  contentType,
  contentId,
  likeCount = 0,
}: ContentInteractionsProps) {
  return (
    <>
      <div className="mt-8">
        <LikeButton contentType={contentType} contentId={contentId} initialCount={likeCount} />
      </div>
      <CommentsSection contentType={contentType} contentId={contentId} />
    </>
  );
}
