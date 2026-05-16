"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Layout from "../../components/Layout";
import { DetailSkeleton } from "../../components/skeletons";
import { useJson } from "@/lib/hooks/use-json";
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
  const { data: novel, loading, error } = useJson<NovelDetail>(
    novelId ? `/api/novels/${novelId}` : null
  );
  const [currentEpisode, setCurrentEpisode] = useState(0);
  const episodeBtnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    episodeBtnRefs.current[currentEpisode]?.scrollIntoView({
      behavior: "instant",
      inline: "center",
      block: "nearest",
    });
  }, [currentEpisode, novel?.episodesList.length]);

  if (loading) {
    return (
      <Layout>
        <DetailSkeleton />
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
      <div className="max-w-4xl w-full min-w-0 overflow-x-hidden">
        <Link href="/novels" className="inline-flex items-center gap-2 text-[#8B8680] hover:text-[#2D2D2D] mb-6 text-sm transition-colors">
          <ArrowLeftIcon /> Back to Novels
        </Link>

        <div className="bg-white rounded-2xl p-5 sm:p-8 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="w-28 h-40 sm:w-32 sm:h-44 mx-auto sm:mx-0 bg-gradient-to-b from-[#F5F0E8] to-[#E8E2D9] rounded-xl flex-shrink-0 flex items-center justify-center">
              <div className="w-20 h-32 bg-[#C4A882] rounded shadow-md" />
            </div>
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <span className="text-xs font-medium text-[#E85A5A] uppercase tracking-wide">
                Episode {currentEpisode + 1} of {novel.episodes}
              </span>
              <h1 className="text-xl sm:text-2xl font-serif font-semibold text-[#2D2D2D] mt-2 mb-1 break-words">
                {novel.title}
              </h1>
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
          <div className="bg-white rounded-xl p-3 sm:p-4 mb-6 shadow-sm min-w-0">
            <p className="text-xs text-[#8B8680] mb-3 sm:hidden text-center">
              Swipe episodes · {currentEpisode + 1} of {novel.episodesList.length}
            </p>
            <div className="flex items-center gap-2 min-w-0">
              <button
                type="button"
                onClick={() => setCurrentEpisode(Math.max(0, currentEpisode - 1))}
                disabled={currentEpisode === 0}
                aria-label="Previous episode"
                className="flex-shrink-0 px-2 sm:px-4 py-2 bg-[#F5F0E8] text-[#8B8680] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#E8E2D9] transition-colors text-sm"
              >
                <span className="hidden sm:inline">← Previous</span>
                <span className="sm:hidden">←</span>
              </button>

              <div className="episode-strip flex-1 min-w-0 overflow-x-auto overflow-y-hidden">
                <div className="flex items-center gap-2 w-max px-1 py-0.5">
                  {novel.episodesList.map((ep, idx) => (
                    <button
                      key={ep.id ?? idx}
                      type="button"
                      ref={(el) => {
                        episodeBtnRefs.current[idx] = el;
                      }}
                      onClick={() => setCurrentEpisode(idx)}
                      aria-label={`Episode ${idx + 1}${ep.title ? `: ${ep.title}` : ""}`}
                      aria-current={idx === currentEpisode ? "true" : undefined}
                      className={`flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-lg text-xs font-medium transition-colors ${
                        idx === currentEpisode
                          ? "bg-[#E85A5A] text-white ring-2 ring-[#E85A5A]/30"
                          : idx < currentEpisode
                            ? "bg-green-100 text-green-700"
                            : "bg-[#F5F0E8] text-[#8B8680]"
                      }`}
                    >
                      {idx < currentEpisode ? <CheckIcon /> : idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setCurrentEpisode(
                    Math.min(novel.episodesList.length - 1, currentEpisode + 1)
                  )
                }
                disabled={currentEpisode === novel.episodesList.length - 1}
                aria-label="Next episode"
                className="flex-shrink-0 px-2 sm:px-4 py-2 bg-[#F5F0E8] text-[#8B8680] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#E8E2D9] transition-colors text-sm"
              >
                <span className="hidden sm:inline">Next →</span>
                <span className="sm:hidden">→</span>
              </button>
            </div>
          </div>
        )}

        {episode ? (
          <article className="bg-white rounded-2xl p-5 sm:p-8 md:p-12 shadow-sm font-serif min-w-0 break-words">
            <PlainTextContent text={episode.content} />
          </article>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <p className="text-[#8B8680]">Episode content not available.</p>
          </div>
        )}

        <ContentInteractions contentType="novels" contentId={novelId} likeCount={novel.likeCount} />

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-8">
          <Link
            href="/novels"
            className="px-6 py-3 bg-white rounded-xl text-[#8B8680] hover:text-[#2D2D2D] hover:shadow-md transition-all text-sm text-center"
          >
            ← All Novels
          </Link>
          {currentEpisode < novel.episodesList.length - 1 && (
            <button
              type="button"
              onClick={() => setCurrentEpisode(currentEpisode + 1)}
              className="px-6 py-3 bg-[#2D2D2D] text-white rounded-xl hover:bg-[#1A1A1A] transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <PlayIcon /> Next Episode
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
}
