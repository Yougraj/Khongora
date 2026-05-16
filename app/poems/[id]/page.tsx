"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import Layout from "../../components/Layout";
import { DetailSkeleton } from "../../components/skeletons";
import { useJson } from "@/lib/hooks/use-json";
import ContentInteractions from "@/app/components/ContentInteractions";

interface PoemDetail {
  _id: string;
  title: string;
  author: string;
  year: string;
  lines: number;
  content: string;
  analysis?: string;
  likeCount?: number;
}

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
  </svg>
);

export default function PoemPage() {
  const params = useParams();
  const poemId = params.id as string;
  const { data: poem, loading, error } = useJson<PoemDetail>(
    poemId ? `/api/poems/${poemId}` : null
  );
  const [fontSize, setFontSize] = useState("text-lg");

  if (loading) {
    return (
      <Layout>
        <DetailSkeleton />
      </Layout>
    );
  }

  if (error || !poem) {
    return (
      <Layout>
        <div className="text-center py-20">
          <p className="text-[#8B8680]">{error ?? "Poem not found"}</p>
          <Link href="/poems" className="text-[#E85A5A] hover:underline mt-4 inline-block text-sm">
            ← Back to Poems
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <Link href="/poems" className="inline-flex items-center gap-2 text-[#8B8680] hover:text-[#2D2D2D] mb-6 text-sm">
          <ArrowLeftIcon /> Back to Poems
        </Link>

        <div className="bg-white rounded-2xl p-8 shadow-sm mb-6">
          <h1 className="text-3xl font-serif text-[#2D2D2D] mb-1">{poem.title}</h1>
          <p className="text-[#8B8680]">by {poem.author}</p>
          <p className="text-xs text-[#A8A3A0] mt-2">{poem.year} • {poem.lines} lines</p>

          <div className="flex gap-2 mt-4">
            {(["text-base", "text-lg", "text-xl"] as const).map((size) => (
              <button
                key={size}
                onClick={() => setFontSize(size)}
                className={`px-3 py-1 rounded-lg text-xs ${fontSize === size ? "bg-[#2D2D2D] text-white" : "bg-[#F5F0E8] text-[#8B8680]"}`}
              >
                A
              </button>
            ))}
          </div>
        </div>

        <div className={`bg-white rounded-2xl p-8 md:p-12 shadow-sm whitespace-pre-line font-serif leading-relaxed text-[#2D2D2D] ${fontSize}`}>
          {poem.content}
        </div>

        {poem.analysis && (
          <div className="bg-[#FAF8F5] rounded-2xl p-6 mt-6 border border-[#E8E2D9]">
            <h3 className="text-sm font-semibold text-[#2D2D2D] mb-2">Analysis</h3>
            <p className="text-sm text-[#8B8680] leading-relaxed">{poem.analysis}</p>
          </div>
        )}

        <ContentInteractions contentType="poems" contentId={poemId} likeCount={poem.likeCount} />
      </div>
    </Layout>
  );
}
