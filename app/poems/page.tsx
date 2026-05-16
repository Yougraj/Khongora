"use client";

import Link from "next/link";
import { useState } from "react";
import Layout from "../components/Layout";
import { GridSkeleton } from "../components/skeletons";
import { useJson } from "@/lib/hooks/use-json";
import { prefetchApi } from "@/lib/prefetch";

interface Poem {
  _id: string;
  title: string;
  author: string;
  cover?: string;
  readTime: string;
  lines: number;
  excerpt: string;
}

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
  </svg>
);

const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
  </svg>
);

export default function PoemsPage() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const { data: poems, loading, error } = useJson<Poem[]>("/api/poems");
  const list = poems ?? [];

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  return (
    <Layout>
      <div className="max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-[#8B8680] hover:text-[#2D2D2D] mb-4 text-sm transition-colors">
            <ArrowLeftIcon /> Back to Home
          </Link>
          <h1 className="text-3xl font-serif text-[#2D2D2D] mb-2">Poetry Collection</h1>
          <p className="text-sm text-[#8B8680]">
            Timeless verses that touch the soul.
            {poems ? ` ${list.length} poems to discover.` : ""}
          </p>
        </div>

        {/* Poems Grid */}
        {loading ? (
          <GridSkeleton count={4} />
        ) : error ? (
          <p className="text-center py-20 text-[#8B8680]">{error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {list.map((poem) => (
            <div key={poem._id} className="bg-white rounded-2xl p-6 hover:shadow-lg transition-shadow relative">
              <button
                onClick={() => toggleFavorite(poem._id)}
                className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
                  favorites.includes(poem._id) ? "text-[#E85A5A]" : "text-[#E8E2D9] hover:text-[#E85A5A]"
                }`}
              >
                <HeartIcon />
              </button>
              
              {poem.cover && (
                <img src={poem.cover} alt={poem.title} className="w-full h-40 object-cover rounded-xl mb-4" />
              )}
              <h3 className="font-serif text-xl font-semibold text-[#2D2D2D] mb-1">{poem.title}</h3>
              <p className="text-sm text-[#8B8680] mb-4">by {poem.author}</p>
              
              <div className="bg-[#F5F0E8] rounded-xl p-4 mb-4">
                <p className="text-[#8B8680] italic font-serif leading-relaxed">{poem.excerpt}</p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-[#A8A3A0]">
                  <span className="flex items-center gap-1"><ClockIcon /> {poem.readTime}</span>
                  <span>{poem.lines} lines</span>
                </div>
                <Link
                  href={`/poems/${poem._id}`}
                  prefetch
                  onMouseEnter={() => prefetchApi(`/poems/${poem._id}`)}
                  className="text-[#2D2D2D] font-medium hover:text-[#E85A5A] transition-colors duration-150"
                >
                  Read Full Poem →
                </Link>
              </div>
            </div>
          ))}
          </div>
        )}

        {/* Featured Quote */}
        <div className="mt-12 text-center">
          <blockquote className="font-serif text-xl text-[#2D2D2D] italic mb-3">
            &ldquo;Poetry is when an emotion has found its thought and the thought has found words.&rdquo;
          </blockquote>
          <cite className="text-sm text-[#8B8680]">— Robert Frost</cite>
        </div>
      </div>
    </Layout>
  );
}
