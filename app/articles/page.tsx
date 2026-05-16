"use client";

import Link from "next/link";
import Layout from "../components/Layout";
import { ListSkeleton } from "../components/skeletons";
import { useJson } from "@/lib/hooks/use-json";
import { prefetchApi } from "@/lib/prefetch";

interface Article {
  _id: string;
  title: string;
  author: string;
  readTime: string;
  excerpt: string;
  date?: string;
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

export default function ArticlesPage() {
  const { data: articles, loading, error } = useJson<Article[]>("/api/articles");
  const list = articles ?? [];

  return (
    <Layout>
      <div className="max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-[#8B8680] hover:text-[#2D2D2D] mb-4 text-sm transition-colors">
            <ArrowLeftIcon /> Back to Home
          </Link>
          <h1 className="text-3xl font-serif text-[#2D2D2D] mb-2">Articles</h1>
          <p className="text-sm text-[#8B8680]">Deep dives into literature, writing, and the world of books.</p>
        </div>

        {/* Articles List */}
        {loading ? (
          <ListSkeleton />
        ) : error ? (
          <p className="text-center py-20 text-[#8B8680]">{error}</p>
        ) : (
          <div className="space-y-4">
            {list.map((article) => (
            <Link
              key={article._id}
              href={`/articles/${article._id}`}
              prefetch
              onMouseEnter={() => prefetchApi(`/articles/${article._id}`)}
              className="group block"
            >
              <div className="bg-white rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#E85A5A] to-[#D44A4A] rounded-xl flex-shrink-0 flex items-center justify-center">
                    <span className="text-white text-2xl font-serif">{article.title.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#2D2D2D] mb-2 group-hover:text-[#E85A5A] transition-colors">{article.title}</h3>
                    <p className="text-sm text-[#8B8680] mb-3">{article.excerpt}</p>
                    <div className="flex items-center gap-3 text-xs text-[#A8A3A0]">
                      <span className="font-medium text-[#8B8680]">{article.author}</span>
                      <span>•</span>
                      <span>{article.date}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><ClockIcon /> {article.readTime} read</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
