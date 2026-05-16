"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import Layout from "../../components/Layout";
import { DetailSkeleton } from "../../components/skeletons";
import ContentInteractions from "@/app/components/ContentInteractions";
import PlainTextContent from "@/app/components/PlainTextContent";
import { useJson } from "@/lib/hooks/use-json";

interface BookDetail {
  _id: string;
  title: string;
  author: string;
  readTime: string;
  chapters: number;
  description: string;
  content: string;
  cover?: string;
  likeCount?: number;
  date?: string;
}

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
  </svg>
);

export default function BookPage() {
  const params = useParams();
  const bookId = params.id as string;
  const { data: book, loading, error } = useJson<BookDetail>(
    bookId ? `/api/books/${bookId}` : null
  );

  if (loading) {
    return (
      <Layout>
        <DetailSkeleton />
      </Layout>
    );
  }

  if (error || !book) {
    return (
      <Layout>
        <div className="text-center py-20">
          <p className="text-[#8B8680]">{error ?? "Book not found"}</p>
          <Link href="/books" className="text-[#E85A5A] hover:underline mt-4 inline-block text-sm">
            ← Back to Books
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl">
        <Link
          href="/books"
          className="inline-flex items-center gap-2 text-[#8B8680] hover:text-[#2D2D2D] mb-6 text-sm transition-colors duration-150"
        >
          <ArrowLeftIcon /> Back to Books
        </Link>

        <div className="bg-white rounded-2xl p-6 sm:p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-40 h-56 rounded-xl overflow-hidden flex-shrink-0 bg-[#F5F0E8]">
              {book.cover ? (
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full h-full object-cover"
                  loading="eager"
                  decoding="async"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-b from-[#F5F0E8] to-[#E8E2D9] flex items-center justify-center">
                  <div className="w-28 h-40 bg-[#8B7355] rounded shadow-md" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-serif text-[#2D2D2D] mb-2">{book.title}</h1>
              <p className="text-lg text-[#8B8680] mb-4">by {book.author}</p>
              <p className="text-[#5A5A5A] mb-4">{book.description}</p>
              <div className="flex items-center gap-4 text-sm text-[#A8A3A0]">
                <span className="flex items-center gap-1">
                  <ClockIcon /> {book.readTime} read
                </span>
                <span>{book.chapters} chapters</span>
              </div>
            </div>
          </div>
        </div>

        <article className="bg-white rounded-2xl p-6 sm:p-10 font-serif">
          <PlainTextContent text={book.content} className="text-[#5A5A5A]" />
        </article>

        <ContentInteractions contentType="books" contentId={bookId} likeCount={book.likeCount} />
      </div>
    </Layout>
  );
}
