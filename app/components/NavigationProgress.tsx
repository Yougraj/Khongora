"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function NavigationProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);
    const start = requestAnimationFrame(() => setProgress(70));
    const finish = setTimeout(() => setProgress(100), 120);
    const hide = setTimeout(() => setProgress(0), 280);

    return () => {
      cancelAnimationFrame(start);
      clearTimeout(finish);
      clearTimeout(hide);
    };
  }, [pathname]);

  if (progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[100] h-0.5 pointer-events-none"
      role="progressbar"
      aria-hidden
    >
      <div
        className="h-full bg-[#E85A5A] transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
