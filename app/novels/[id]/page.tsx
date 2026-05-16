"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import ContentInteractions from "@/app/components/ContentInteractions";
import PlainTextContent from "@/app/components/PlainTextContent";

interface Episode {
  id: number;
  title: string;
  duration: string;
  content: string;
}

interface NovelDetail {
  _id: string;
  title: string;
  author: string;
  readTime: string;
  episodes: number;
  category: string;
  description: string;
  episodesList: Episode[];
  likeCount?: number;
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

const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="5 3 19 12 5 21"/>
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5"/>
  </svg>
);

export default function NovelPage() {
  const params = useParams();
  const novelId = params.id as string;
  const [novel, setNovel] = useState<NovelDetail | null>(null);
  const [currentEpisode, setCurrentEpisode] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/novels/${novelId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Novel not found");
        return res.json();
      })
      .then((data) => {
        setNovel(data);
        setLoading(false);
      })
      .catch(() => {
        setError("This novel could not be loaded.");
        setLoading(false);
      });
  }, [novelId]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2D2D2D]" />
        </div>
      </Layout>
    );
  }

  if (error || !novel) {
    return (
      <Layout>
        <div className="text-center py-20">
          <p className="text-[#8B8680]">{error ?? "Novel not found"}</p>
          <Link href="/novels" className="text-[#E85A5A] hover:underline mt-4 inline-block text-sm">
            ← Back to Novels
          </Link>
        </div>
      </Layout>
    );
  }

  const episode = novel.episodesList[currentEpisode];

  return (
    <Layout>
      <div className="max-w-4xl">
        <Link href="/novels" className="inline-flex items-center gap-2 text-[#8B8680] hover:text-[#2D2D2D] mb-6 text-sm transition-colors">
          <ArrowLeftIcon /> Back to Novels
        </Link>

        <div className="bg-white rounded-2xl p-8 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-32 h-44 bg-gradient-to-b from-[#F5F0E8] to-[#E8E2D9] rounded-xl flex-shrink-0 flex items-center justify-center">
              <div className="w-20 h-32 bg-[#C4A882] rounded shadow-md" />
            </div>
            <div className="flex-1">
              <span className="text-xs font-medium text-[#E85A5A] uppercase tracking-wide">
                Episode {currentEpisode + 1} of {novel.episodes}
              </span>
              <h1 className="text-2xl font-serif font-semibold text-[#2D2D2D] mt-2 mb-1">{novel.title}</h1>
              <p className="text-[#8B8680] mb-2">by {novel.author}</p>
              {episode && <p className="text-lg font-medium text-[#2D2D2D]">{episode.title}</p>}
              <div className="flex items-center gap-4 text-sm text-[#A8A3A0] mt-3">
                <span className="flex items-center gap-1"><ClockIcon /> {episode?.duration || novel.readTime}</span>
                <span>{novel.episodes} episodes total</span>
              </div>
            </div>
          </div>
        </div>

        {novel.episodesList.length > 0 && (
          <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentEpisode(Math.max(0, currentEpisode - 1))}
                disabled={currentEpisode === 0}
                className="px-4 py-2 bg-[#F5F0E8] text-[#8B8680] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#E8E2D9] transition-colors text-sm"
              >
                ← Previous
              </button>
              <div className="flex items-center gap-2">
                {novel.episodesList.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentEpisode(idx)}
                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                      idx === currentEpisode
                        ? "bg-[#E85A5A] text-white"
                        : idx < currentEpisode
                          ? "bg-green-100 text-green-700"
                          : "bg-[#F5F0E8] text-[#8B8680]"
                    }`}
                  >
                    {idx < currentEpisode ? <CheckIcon /> : idx + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentEpisode(Math.min(novel.episodesList.length - 1, currentEpisode + 1))}
                disabled={currentEpisode === novel.episodesList.length - 1}
                className="px-4 py-2 bg-[#F5F0E8] text-[#8B8680] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#E8E2D9] transition-colors text-sm"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {episode ? (
          <article className="bg-white rounded-2xl p-8 md:p-12 shadow-sm font-serif">
            <PlainTextContent text={episode.content} />
          </article>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <p className="text-[#8B8680]">Episode content not available.</p>
          </div>
        )}

        <ContentInteractions contentType="novels" contentId={novelId} likeCount={novel.likeCount} />

        <div className="flex items-center justify-between mt-8">
          <Link
            href="/novels"
            className="px-6 py-3 bg-white rounded-xl text-[#8B8680] hover:text-[#2D2D2D] hover:shadow-md transition-all text-sm"
          >
            ← All Novels
          </Link>
          {currentEpisode < novel.episodesList.length - 1 && (
            <button
              onClick={() => setCurrentEpisode(currentEpisode + 1)}
              className="px-6 py-3 bg-[#2D2D2D] text-white rounded-xl hover:bg-[#1A1A1A] transition-colors flex items-center gap-2 text-sm"
            >
              <PlayIcon /> Next Episode
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
}
