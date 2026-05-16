"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Layout from "../components/Layout";

interface Book {
  _id: string;
  title: string;
  author: string;
  cover: string;
  rating: number;
  readers?: number;
  description?: string;
  readTime?: string;
  chapters?: number;
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

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/books')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        setBooks(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch books:', err);
        setError('Failed to load books. Please try again.');
        setLoading(false);
      });
  }, []);

  return (
    <Layout>
      <div className="max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-[#8B8680] hover:text-[#2D2D2D] mb-4 text-sm transition-colors">
            <ArrowLeftIcon /> Back to Home
          </Link>
          <h1 className="text-3xl font-serif text-[#2D2D2D] mb-2">All Books</h1>
          <p className="text-sm text-[#8B8680]">Discover your next great read from our collection</p>
        </div>

        {/* Books Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2D2D2D]"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-[#8B8680]">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-[#2D2D2D] text-white rounded-lg text-sm"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <Link key={book._id} href={`/books/${book._id}`} className="group">
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                  <img 
                    src={book.cover}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <h3 className="mt-3 text-sm font-medium text-[#2D2D2D] truncate">{book.title}</h3>
                <p className="text-xs text-[#8B8680]">{book.author}</p>
                <div className="flex items-center gap-1 text-xs text-[#A8A3A0] mt-1">
                  <ClockIcon /> {book.readTime} • {book.chapters} ch
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
