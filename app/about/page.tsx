"use client";

import Link from "next/link";
import Layout from "../components/Layout";
import AuthorPhoto from "../components/AuthorPhoto";
import { AUTHOR_FACEBOOK_URL, AUTHOR_NAME, AUTHOR_TAGLINE } from "@/lib/author";

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
  </svg>
);

export default function AboutPage() {
  return (
    <Layout>
      <div className="max-w-3xl">
        <Link href="/" className="inline-flex items-center gap-2 text-[#8B8680] hover:text-[#2D2D2D] mb-6 text-sm transition-colors">
          <ArrowLeftIcon /> Back to Home
        </Link>

        <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-8 items-start">
            <AuthorPhoto />
            <div>
              <p className="text-xs font-medium text-[#E85A5A] uppercase tracking-wide mb-2">About the author</p>
              <h1 className="text-3xl font-serif text-[#2D2D2D] mb-2">{AUTHOR_NAME}</h1>
              <p className="text-[#8B8680] text-sm mb-4">
                {AUTHOR_TAGLINE}
                {" · "}
                <a
                  href={AUTHOR_FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#E85A5A] hover:underline"
                >
                  Facebook
                </a>
              </p>
              <p className="text-[#5A5A5A] leading-relaxed">
                Welcome to Khongora — a quiet corner on the web for books, novels, poems, articles, and essays.
                Everything here is free to read. No account, no login, no paywall — just open a page and start reading.
              </p>
            </div>
          </div>

          <div className="mt-10 space-y-6 text-[#5A5A5A] leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-[#2D2D2D] mb-2">About me</h2>
              <p>
                I built this site to share stories and ideas I care about: fiction that pulls you in, poems that
                linger, and essays that make you think. Khongora is my personal reading room — organized, calm, and
                meant for anyone who loves words.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#2D2D2D] mb-2">What you&apos;ll find here</h2>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Books and long-form reading</li>
                <li>Serialized novels and episodes</li>
                <li>Poetry collection</li>
                <li>Blog posts and articles</li>
              </ul>
            </section>

            <section className="bg-[#FAF8F5] rounded-xl p-5 border border-[#E8E2D9]">
              <p className="text-sm text-[#8B8680]">
                This is a read-only library. There are no saved lists, settings, or sign-in — pick something from
                the menu and enjoy it at your own pace.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}
