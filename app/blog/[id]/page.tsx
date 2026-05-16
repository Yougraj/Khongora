"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import Layout from "../../components/Layout";
import { DetailSkeleton } from "../../components/skeletons";
import { useJson } from "@/lib/hooks/use-json";
import ContentInteractions from "@/app/components/ContentInteractions";
import PlainTextContent from "@/app/components/PlainTextContent";

interface BlogDetail {
  _id: string;
  title: string;
  author: string;
  date: string;
  readTime: string;
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

export default function BlogPostPage() {
  const params = useParams();
  const postId = params.id as string;
  const { data: post, loading, error } = useJson<BlogDetail>(
    postId ? `/api/blogs/${postId}` : null
  );

  if (loading) {
    return (
      <Layout>
        <DetailSkeleton />
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <div className="text-center py-20">
          <p className="text-[#8B8680]">{error ?? "Post not found"}</p>
          <Link href="/blog" className="text-[#E85A5A] hover:underline mt-4 inline-block text-sm">
            ← Back to Blog
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl">
        <Link href="/blog" className="inline-flex items-center gap-2 text-[#8B8680] hover:text-[#2D2D2D] mb-6 text-sm">
          <ArrowLeftIcon /> Back to Blog
        </Link>

        <div className="bg-white rounded-2xl p-8 mb-6 shadow-sm">
          <h1 className="text-3xl font-serif text-[#2D2D2D] mb-3">{post.title}</h1>
          <div className="flex items-center gap-3 text-sm text-[#A8A3A0]">
            <span className="font-medium text-[#8B8680]">{post.author}</span>
            <span>•</span>
            <span>{post.date}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><ClockIcon /> {post.readTime}</span>
          </div>
        </div>

        <article className="bg-white rounded-2xl p-8 md:p-12 shadow-sm font-serif">
          <PlainTextContent text={post.content} />
        </article>

        <ContentInteractions contentType="blogs" contentId={postId} likeCount={post.likeCount} />
      </div>
    </Layout>
  );
}
