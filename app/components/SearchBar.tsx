"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface SearchResult {
  type: string;
  _id: string;
  title: string;
  author: string;
  excerpt: string;
  href: string;
}

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
  </svg>
);

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query.trim();
    if (!q) return;

    const timer = setTimeout(() => {
      setLoading(true);
      fetch(`/api/search?q=${encodeURIComponent(q)}`)
        .then((r) => r.json())
        .then((data) => {
          setResults(Array.isArray(data) ? data : []);
          setOpen(true);
        })
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={wrapperRef} className="relative flex-1 max-w-md">
      <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-[#8B8680]">
        <SearchIcon />
      </div>
      <input
        type="search"
        value={query}
        onChange={(e) => {
          const value = e.target.value;
          setQuery(value);
          if (!value.trim()) {
            setResults([]);
            setOpen(false);
          }
        }}
        onFocus={() => query.trim() && results.length > 0 && setOpen(true)}
        placeholder="Search books, novels, poems..."
        className="w-full bg-white rounded-full py-2.5 sm:py-3 pl-10 sm:pl-12 pr-4 text-sm text-[#2D2D2D] placeholder-[#A8A3A0] border-none shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E85A5A]/30"
      />
      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-[#E8E2D9] overflow-hidden z-50 max-h-80 overflow-y-auto">
          {loading && (
            <p className="p-4 text-sm text-[#8B8680] text-center">Searching...</p>
          )}
          {!loading && results.length === 0 && query.trim() && (
            <p className="p-4 text-sm text-[#8B8680] text-center">No results found</p>
          )}
          {results.map((item) => (
            <Link
              key={`${item.type}-${item._id}`}
              href={item.href}
              onClick={() => {
                setOpen(false);
                setQuery("");
              }}
              className="block px-4 py-3 hover:bg-[#FAF8F5] border-b border-[#F5F0E8] last:border-0"
            >
              <p className="text-xs text-[#E85A5A] uppercase">{item.type}</p>
              <p className="font-medium text-[#2D2D2D] text-sm">{item.title}</p>
              <p className="text-xs text-[#8B8680]">{item.author}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
