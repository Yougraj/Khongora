"use client";

import Link from "next/link";
import Layout from "./components/Layout";
import { HomeSkeleton } from "./components/skeletons";
import { useJson } from "@/lib/hooks/use-json";
import { prefetchApi } from "@/lib/prefetch";
import type { ContentType } from "@/lib/content-types";

interface LatestItem {
  type: ContentType;
  _id: string;
  title: string;
  author: string;
  date: string;
  dateRelative: string;
  uploadedAt: string;
  cover?: string;
  excerpt?: string;
  description?: string;
}

interface RecentComment {
  _id: string;
  name: string;
  text: string;
  date: string;
  contentType: ContentType;
  contentId: string;
}

interface HomeData {
  latest: LatestItem[];
  recentComments: RecentComment[];
}

function itemHref(item: LatestItem) {
  if (item.type === "blogs") return `/blog/${item._id}`;
  return `/${item.type}/${item._id}`;
}

function itemExcerpt(item: LatestItem) {
  return item.excerpt || item.description || "";
}

export default function Home() {
  const { data, loading, error } = useJson<HomeData>("/api/home");
  const latest = data?.latest ?? [];
  const recentComments = data?.recentComments ?? [];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-serif text-[#2D2D2D] mb-2">
            Latest on Khongora
          </h1>
          <p className="text-sm text-[#8B8680]">
            Five newest uploads across everything — read freely, no login required.
          </p>
        </header>

        {loading ? (
          <HomeSkeleton />
        ) : error ? (
          <p className="text-sm text-[#8B8680] text-center py-12">{error}</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-lg font-semibold text-[#2D2D2D]">Latest</h2>
              {latest.length === 0 ? (
                <p className="text-[#8B8680] text-sm">No content yet.</p>
              ) : (
                latest.map((item) => {
                  const href = itemHref(item);
                  return (
                    <Link
                      key={`${item.type}-${item._id}`}
                      href={href}
                      prefetch
                      onMouseEnter={() => prefetchApi(href)}
                      className="flex gap-5 bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-150"
                    >
                      {item.cover ? (
                        <img
                          src={item.cover}
                          alt=""
                          className="w-20 h-28 object-cover rounded-lg flex-shrink-0"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="w-20 h-28 bg-gradient-to-b from-[#F5F0E8] to-[#E8E2D9] rounded-lg flex-shrink-0 flex items-center justify-center">
                          <span className="text-xs text-[#8B8680] uppercase">{item.type}</span>
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-medium text-[#E85A5A] uppercase">
                          {item.type.replace(/s$/, "")} · {item.date}
                        </span>
                        <h3 className="font-semibold text-[#2D2D2D] mt-1 mb-1 line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-xs text-[#8B8680] mb-2">{item.author}</p>
                        {itemExcerpt(item) && (
                          <p className="text-sm text-[#8B8680] line-clamp-2">{itemExcerpt(item)}</p>
                        )}
                        <p className="text-xs text-[#A8A3A0] mt-2">{item.dateRelative}</p>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>

            <aside className="space-y-6">
              <section className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-[#2D2D2D] mb-4">Reader comments</h2>
                {recentComments.length === 0 ? (
                  <p className="text-sm text-[#8B8680]">No comments yet.</p>
                ) : (
                  <ul className="space-y-4">
                    {recentComments.map((c) => (
                      <li key={c._id} className="border-b border-[#F5F0E8] pb-4 last:border-0">
                        <p className="text-sm text-[#5A5A5A] leading-relaxed mb-2">
                          &ldquo;{c.text}&rdquo;
                        </p>
                        <p className="text-xs text-[#8B8680]">
                          — {c.name} · {c.date}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </aside>
          </div>
        )}
      </div>
    </Layout>
  );
}
