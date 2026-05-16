"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import ContentInteractions from "@/app/components/ContentInteractions";
import PlainTextContent from "@/app/components/PlainTextContent";

interface ArticleDetail {
  _id: string;
  title: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  content: string;
  likeCount?: number;
}

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

export default function ArticlePage() {
  const params = useParams();
  const articleId = params.id as string;
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/articles/${articleId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Article not found");
        return res.json();
      })
      .then((data) => {
        setArticle(data);
        setLoading(false);
      })
      .catch(() => {
        setError("This article could not be loaded.");
        setLoading(false);
      });
  }, [articleId]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2D2D2D]" />
        </div>
      </Layout>
    );
  }

  if (error || !article) {
    return (
      <Layout>
        <div className="text-center py-20">
          <p className="text-[#8B8680]">{error ?? "Article not found"}</p>
          <Link href="/articles" className="text-[#E85A5A] hover:underline mt-4 inline-block text-sm">
            ← Back to Articles
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl">
        <Link href="/articles" className="inline-flex items-center gap-2 text-[#8B8680] hover:text-[#2D2D2D] mb-6 text-sm">
          <ArrowLeftIcon /> Back to Articles
        </Link>

        <div className="bg-white rounded-2xl p-8 mb-6 shadow-sm">
          <h1 className="text-3xl font-serif text-[#2D2D2D] mb-3">{article.title}</h1>
          <div className="flex items-center gap-3 text-sm text-[#A8A3A0]">
            <span className="font-medium text-[#8B8680]">{article.author}</span>
            <span>•</span>
            <span>{article.date}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><ClockIcon /> {article.readTime} read</span>
          </div>
        </div>

        <article className="bg-white rounded-2xl p-8 md:p-12 shadow-sm font-serif">
          <PlainTextContent text={article.content} />
        </article>

        <ContentInteractions contentType="articles" contentId={articleId} likeCount={article.likeCount} />
      </div>
    </Layout>
  );
}
