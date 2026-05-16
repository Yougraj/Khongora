"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";

interface BlogPost {
  _id: string;
  title: string;
  author: string;
  cover?: string;
  date: string;
  readTime: string;
  excerpt: string;
  featured: boolean;
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

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/blogs')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load blog posts.');
        setLoading(false);
      });
  }, []);

  const featuredPosts = posts.filter((post) => post.featured).slice(0, 2);

  return (
    <Layout>
      <div className="max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-[#8B8680] hover:text-[#2D2D2D] mb-4 text-sm transition-colors">
            <ArrowLeftIcon /> Back to Home
          </Link>
          <h1 className="text-3xl font-serif text-[#2D2D2D] mb-2">Blog</h1>
          <p className="text-sm text-[#8B8680]">Stories, insights, and reading inspiration from our community.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2D2D2D]" />
          </div>
        ) : error ? (
          <div className="text-center py-20 text-[#8B8680]">{error}</div>
        ) : (
        <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {featuredPosts.map((post) => (
            <Link key={post._id} href={`/blog/${post._id}`} className="group">
              <div className="bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                {post.cover ? (
                  <img src={post.cover} alt={post.title} className="h-48 w-full object-cover" />
                ) : (
                  <div className="h-48 bg-gradient-to-br from-[#F5F0E8] to-[#E8E2D9]" />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-[#2D2D2D] mb-2 group-hover:text-[#E85A5A] transition-colors">{post.title}</h3>
                  <p className="text-sm text-[#8B8680] line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center gap-3 mt-4 text-xs text-[#A8A3A0]">
                    <span>{post.author}</span>
                    <span>•</span>
                    <span>{post.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><ClockIcon /> {post.readTime}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* All Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link key={post._id} href={`/blog/${post._id}`} className="group">
              <div className="bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
                {post.cover ? (
                  <img src={post.cover} alt={post.title} className="h-36 w-full object-cover" />
                ) : (
                  <div className="h-36 bg-gradient-to-br from-[#F5F0E8] to-[#E8E2D9]" />
                )}
                <div className="p-6 flex flex-col flex-1">
                <h3 className="font-semibold text-[#2D2D2D] mb-2 group-hover:text-[#E85A5A] transition-colors line-clamp-2">{post.title}</h3>
                <p className="text-sm text-[#8B8680] line-clamp-3 mb-4">{post.excerpt}</p>
                <div className="flex items-center gap-2 text-xs text-[#A8A3A0] mt-auto">
                  <span>{post.author}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><ClockIcon /> {post.readTime}</span>
                </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        </>
        )}
      </div>
    </Layout>
  );
}
