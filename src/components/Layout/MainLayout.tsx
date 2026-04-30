// src/components/layout/MainLayout.tsx
import { type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { RightColumn } from "./RightColumn";

interface MainLayoutProps {
  children: ReactNode;
  /** Pass false to hide the right column (e.g. on tweet detail page) */
  showRight?: boolean;
}

export function MainLayout({ children, showRight = true }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1265px] mx-auto flex">
        {/* Left sidebar */}
        <Sidebar />

        {/* Center content */}
        <main className="flex-1 border-x border-gray-200 min-h-screen max-w-[600px]">
          {children}
        </main>

        {/* Right column */}
        {showRight && <RightColumn />}
      </div>
    </div>
  );
}