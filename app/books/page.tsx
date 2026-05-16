"use client";

import Link from "next/link";
import Layout from "../components/Layout";
import { GridSkeleton } from "../components/skeletons";
import { useJson } from "@/lib/hooks/use-json";
import { prefetchApi } from "@/lib/prefetch";

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
  const { data: books, loading, error } = useJson<Book[]>("/api/books");

  return (
    <Layout>
      <div className="max-w-6xl">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-[#8B8680] hover:text-[#2D2D2D] mb-4 text-sm transition-colors duration-150">
            <ArrowLeftIcon /> Back to Home
          </Link>
          <h1 className="text-3xl font-serif text-[#2D2D2D] mb-2">Books</h1>
          <p className="text-sm text-[#8B8680]">
            Discover your next great read from our collection
            {books ? ` · ${books.length} books` : ""}
          </p>
        </div>

        {loading ? (
          <GridSkeleton />
        ) : error ? (
          <p className="text-center py-20 text-[#8B8680]">{error}</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {(books ?? []).map((book) => {
              const href = `/books/${book._id}`;
              return (
                <Link
                  key={book._id}
                  href={href}
                  prefetch
                  onMouseEnter={() => prefetchApi(href)}
                  className="group"
                >
                  <div className="bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-150">
                    <div className="aspect-[3/4] bg-[#F5F0E8] overflow-hidden">
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-[#2D2D2D] text-sm mb-1 line-clamp-2 group-hover:text-[#E85A5A] transition-colors duration-150">
                        {book.title}
                      </h3>
                      <p className="text-xs text-[#8B8680] mb-2">{book.author}</p>
                      <div className="flex items-center gap-2 text-xs text-[#A8A3A0]">
                        <span className="flex items-center gap-1">
                          <ClockIcon /> {book.readTime}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
