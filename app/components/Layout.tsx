"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import SearchBar from "./SearchBar";

const HomeIcon = ({ active = false }: { active?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const BookIcon = ({ active = false }: { active?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
);

const NovelIcon = ({ active = false }: { active?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/><path d="M6 8h4"/><path d="M6 12h4"/><path d="M16 8h2"/><path d="M16 12h2"/>
  </svg>
);

const PoemIcon = ({ active = false }: { active?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z"/><path d="M12 3v18"/><path d="M5 12h14"/>
  </svg>
);

const BlogIcon = ({ active = false }: { active?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M4 8h16"/><path d="M8 12h8"/><path d="M8 16h5"/>
  </svg>
);

const ArticleIcon = ({ active = false }: { active?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/>
  </svg>
);

const AboutIcon = ({ active = false }: { active?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/>
  </svg>
);

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const prevPathRef = useRef(pathname);
  const [animationClass, setAnimationClass] = useState("animate-fade-slide");

  const navItems = [
    { id: "home", href: "/", icon: HomeIcon, title: "Home" },
    { id: "books", href: "/books", icon: BookIcon, title: "Books" },
    { id: "novels", href: "/novels", icon: NovelIcon, title: "Novels" },
    { id: "poems", href: "/poems", icon: PoemIcon, title: "Poems" },
    { id: "blog", href: "/blog", icon: BlogIcon, title: "Blog" },
    { id: "articles", href: "/articles", icon: ArticleIcon, title: "Articles" },
    { id: "about", href: "/about", icon: AboutIcon, title: "About" },
  ];
  
  const getActiveTab = () => {
    if (pathname === "/") return "home";
    if (pathname.startsWith("/books")) return "books";
    if (pathname.startsWith("/novels")) return "novels";
    if (pathname.startsWith("/poems")) return "poems";
    if (pathname.startsWith("/articles")) return "articles";
    if (pathname.startsWith("/blog")) return "blog";
    if (pathname.startsWith("/about")) return "about";
    return "";
  };

  const activeTab = getActiveTab();

  // Calculate animation direction based on nav position change
  useEffect(() => {
    const prevPath = prevPathRef.current;
    
    if (prevPath !== pathname) {
      const prevTab = navItems.find(item => 
        prevPath === item.href || prevPath.startsWith(item.href + "/")
      )?.id || "";
      
      const currentTab = activeTab;
      
      const prevIndex = navItems.findIndex(item => item.id === prevTab);
      const currentIndex = navItems.findIndex(item => item.id === currentTab);
      
      if (prevIndex !== -1 && currentIndex !== -1) {
        if (currentIndex > prevIndex) {
          setAnimationClass("animate-slide-up"); // Moving down the nav
        } else if (currentIndex < prevIndex) {
          setAnimationClass("animate-slide-down"); // Moving up the nav
        } else {
          setAnimationClass("animate-fade-slide");
        }
      }
      
      prevPathRef.current = pathname;
    }
  }, [pathname, activeTab, navItems]);

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex">
      {/* Left Sidebar Navigation - Desktop */}
      <aside className="hidden md:flex w-16 lg:w-20 bg-[#FAF8F5] border-r border-[#E8E2D9] flex-col items-center py-6 fixed h-full z-50">
        {/* Logo */}
        <Link href="/" className="mb-10">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-[#2D2D2D]">
            <path d="M16 4C16 4 8 8 8 16C8 20 10 24 16 28C22 24 24 20 24 16C24 8 16 4 16 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 10C16 10 12 12 12 16C12 18 13 20 16 22C19 20 20 18 20 16C20 12 16 10 16 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>

        {/* Navigation Icons */}
        <nav className="flex flex-col gap-3">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              title={item.title}
              className={`p-3 rounded-xl transition-all duration-300 ${
                activeTab === item.id 
                  ? "bg-[#E85A5A] text-white shadow-lg" 
                  : "text-[#8B8680] hover:bg-[#F0EBE3] hover:text-[#5A5A5A]"
              }`}
            >
              <item.icon active={activeTab === item.id} />
            </Link>
          ))}
        </nav>

        {/* Menu button at bottom */}
        <div className="mt-auto">
          <button className="p-3 rounded-xl text-[#8B8680] hover:bg-[#F0EBE3] hover:text-[#5A5A5A] transition-all duration-300">
            <MenuIcon />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-16 lg:ml-20 pb-20 md:pb-0">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-[#F5F0E8]/95 backdrop-blur-sm px-4 sm:px-6 lg:px-10 py-4 sm:py-5">
          <div className="flex items-center gap-3">
            {/* Mobile Logo */}
            <Link href="/" className="md:hidden flex-shrink-0">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none" className="text-[#2D2D2D]">
                <path d="M16 4C16 4 8 8 8 16C8 20 10 24 16 28C22 24 24 20 24 16C24 8 16 4 16 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 10C16 10 12 12 12 16C12 18 13 20 16 22C19 20 20 18 20 16C20 12 16 10 16 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            
            <SearchBar />
          </div>
        </header>

        {/* Page Content */}
        <div className="px-4 sm:px-6 lg:px-10 pb-10">
          <div key={pathname} className={animationClass}>
            {children}
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#FAF8F5] border-t border-[#E8E2D9] z-50 safe-area-pb">
        <div className="flex justify-around items-center py-2 px-2">
          {navItems.slice(0, 5).map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all duration-300 min-w-[56px] ${
                activeTab === item.id 
                  ? "text-[#E85A5A]" 
                  : "text-[#8B8680]"
              }`}
            >
              <item.icon active={activeTab === item.id} />
              <span className="text-[10px] font-medium">{item.title}</span>
            </Link>
          ))}
          <Link
            href="/about"
            className={`flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all duration-300 min-w-[56px] ${
              activeTab === "about"
                ? "text-[#E85A5A]"
                : "text-[#8B8680]"
            }`}
          >
            <AboutIcon active={activeTab === "about"} />
            <span className="text-[10px] font-medium">About</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
