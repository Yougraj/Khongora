"use client";

import { AUTHOR_FACEBOOK_URL, AUTHOR_IMAGE_SRC, AUTHOR_NAME } from "@/lib/author";

type AuthorPhotoProps = {
  className?: string;
};

export default function AuthorPhoto({ className }: AuthorPhotoProps) {
  return (
    <a
      href={AUTHOR_FACEBOOK_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="flex-shrink-0 rounded-2xl overflow-hidden shadow-md ring-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E85A5A]"
      title={`${AUTHOR_NAME} on Facebook`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${AUTHOR_IMAGE_SRC}?v=jugalkishur`}
        alt={`${AUTHOR_NAME} profile photo`}
        width={128}
        height={128}
        className={className ?? "w-28 h-28 sm:w-32 sm:h-32 object-cover"}
        referrerPolicy="no-referrer"
      />
    </a>
  );
}
