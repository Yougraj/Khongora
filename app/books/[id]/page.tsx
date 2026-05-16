"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ContentInteractions from "@/app/components/ContentInteractions";
import PlainTextContent from "@/app/components/PlainTextContent";

interface BookDetail {
  _id: string;
  title: string;
  author: string;
  readTime: string;
  chapters: number;
  category: string;
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

const BookOpenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
);

export default function BookPage() {
  const params = useParams();
  const bookId = params.id as string;
  const [book, setBook] = useState<BookDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/books/${bookId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Book not found");
        return res.json();
      })
      .then((data) => {
        setBook(data);
        setLoading(false);
      })
      .catch(() => {
        setError("This book could not be loaded.");
        setLoading(false);
      });
  }, [bookId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-800" />
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center gap-4">
        <p className="text-stone-500">{error ?? "Book not found"}</p>
        <Link href="/books" className="text-amber-600 hover:underline">← Back to Books</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-100">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#C4A882] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="text-xl font-semibold text-stone-800">Bookish</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/books" className="p-2 text-stone-500 hover:text-stone-800 transition-colors">
              <BookOpenIcon />
            </Link>
          </div>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <Link href="/books" className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-800 mb-6">
          <ArrowLeftIcon /> Back to Books
        </Link>

        <div className="bg-white rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-40 h-56 rounded-xl overflow-hidden flex-shrink-0 bg-stone-100">
              {book.cover ? (
                <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-b from-stone-100 to-stone-200 flex items-center justify-center">
                  <div className="w-28 h-40 bg-[#8B7355] rounded shadow-md" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-serif font-semibold text-stone-800 mb-2">{book.title}</h1>
              <p className="text-lg text-stone-500 mb-4">by {book.author}</p>
              <p className="text-stone-600 mb-4">{book.description}</p>
              <div className="flex items-center gap-4 text-sm text-stone-400">
                <span className="flex items-center gap-1"><ClockIcon /> {book.readTime} read</span>
                <span>{book.chapters} chapters</span>
              </div>
            </div>
          </div>
        </div>

        <article className="bg-white rounded-2xl p-8 md:p-12 font-serif">
          <PlainTextContent text={book.content} className="text-stone-700" />
        </article>

        <ContentInteractions contentType="books" contentId={bookId} likeCount={book.likeCount} />

        <div className="flex items-center justify-between mt-8">
          <Link
            href="/books"
            className="px-6 py-3 bg-white rounded-xl text-stone-600 hover:text-stone-800 hover:shadow-md transition-all"
          >
            ← All Books
          </Link>
        </div>
      </main>
    </div>
  );
}
