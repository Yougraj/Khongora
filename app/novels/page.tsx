"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Layout from "../components/Layout";

interface Episode {
  id: string;
  title: string;
  duration: string;
}

interface Novel {
  _id: string;
  title: string;
  author: string;
  cover?: string;
  rating: number;
  episodes: number;
  readTime: string;
  description: string;
  episodesList: Episode[];
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

const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="5 3 19 12 5 21"/>
  </svg>
);

export default function NovelsPage() {
  const [expandedNovel, setExpandedNovel] = useState<string | null>(null);
  const [novels, setNovels] = useState<Novel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/novels')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        setNovels(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch novels:', err);
        setError('Failed to load novels. Please try again.');
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
          <h1 className="text-3xl font-serif text-[#2D2D2D] mb-2">Novels</h1>
          <p className="text-sm text-[#8B8680]">Immersive stories released episode by episode. {novels.length} novels available.</p>
        </div>

        {/* Novels Grid */}
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {novels.map((novel, idx) => (
            <div key={novel._id} className="bg-white rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex gap-4 mb-4">
                <div className="w-32 h-44 bg-gradient-to-b from-[#F5F0E8] to-[#E8E2D9] rounded-xl flex-shrink-0 overflow-hidden">
                  {novel.cover ? (
                    <img src={novel.cover} alt={novel.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-20 h-32 rounded shadow-md" style={{ background: `hsl(${idx * 40 + 160}, 35%, ${50 + idx * 5}%)` }} />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-[#2D2D2D] text-lg mb-1">{novel.title}</h3>
                  <p className="text-sm text-[#8B8680] mb-2">{novel.author}</p>
                  <div className="flex items-center gap-4 text-xs text-[#A8A3A0] mb-3">
                    <span className="flex items-center gap-1"><ClockIcon /> {novel.readTime}</span>
                    <span>{novel.episodes} episodes</span>
                  </div>
                  <p className="text-xs text-[#A8A3A0] line-clamp-3">{novel.description}</p>
                </div>
              </div>

              {/* Episodes Preview */}
              <div className="border-t border-[#F5F0E8] pt-4 mb-4">
                <button
                  onClick={() => setExpandedNovel(expandedNovel === novel._id ? null : novel._id)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <span className="text-sm font-medium text-[#2D2D2D]">Latest Episodes</span>
                  <span className="text-xs text-[#8B8680]">
                    {expandedNovel === novel._id ? "Show Less" : `View All ${novel.episodes} Episodes`}
                  </span>
                </button>
                
                <div className="mt-3 space-y-2">
                  {novel.episodesList.map((episode) => (
                    <div key={episode.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-[#F5F0E8]">
                      <div className="flex items-center gap-3">
                        <button className="w-8 h-8 bg-[#2D2D2D] rounded-full flex items-center justify-center text-white hover:bg-[#1A1A1A] transition-colors">
                          <PlayIcon />
                        </button>
                        <div>
                          <p className="text-sm font-medium text-[#2D2D2D]">Episode {episode.id}: {episode.title}</p>
                          <p className="text-xs text-[#A8A3A0]">{episode.duration}</p>
                        </div>
                      </div>
                      <Link
                        href={`/novels/${novel._id}`}
                        className="text-xs text-[#E85A5A] hover:underline"
                      >
                        Read
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href={`/novels/${novel._id}`}
                className="block w-full bg-[#2D2D2D] text-white text-center py-3 rounded-xl font-medium hover:bg-[#1A1A1A] transition-colors"
              >
                Start Reading
              </Link>
            </div>
          ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
