import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { ScrollArea } from "../ui/scroll-area";
import { BsMenuButton, BsTwitter } from "react-icons/bs";
import { FiHome, FiHash, FiBell, FiMail, FiBookmark, FiList, FiUser, FiMoreHorizontal } from "react-icons/fi";
import { CrossIcon } from "lucide-react";

type NavItem = { to: string; label: string; icon: React.ReactNode; accent?: boolean };

const NAV: NavItem[] = [
  { to: "/", label: "Home", icon: <FiHome /> },
  { to: "/explore", label: "Explore", icon: <FiHash /> },
  { to: "/notifications", label: "Notifications", icon: <FiBell /> },
  { to: "/messages", label: "Messages", icon: <FiMail /> },
  { to: "/bookmarks", label: "Bookmarks", icon: <FiBookmark /> },
  { to: "/lists", label: "Lists", icon: <FiList /> },
  { to: "/profile", label: "Profile", icon: <FiUser /> },
  { to: "/more", label: "More", icon: <FiMoreHorizontal /> },
];

type SidebarProps = { children?: React.ReactNode; className?: string };

export function Sidebar({ children, className }: SidebarProps) {
  const [open, setOpen] = React.useState(false);
  const loc = useLocation();

  return (
    <>
      {/* Mobile top bar with menu trigger */}
      <div className="md:hidden flex items-center justify-between px-3 py-2 bg-background border-b">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <BsMenuButton className="w-5 h-5" />
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="w-72 p-0">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="text-lg font-semibold">Home</div>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close">
                <CrossIcon className="w-5 h-5" />
              </Button>
            </div>

            <ScrollArea className="h-[calc(100vh-64px)] p-4">
              <nav className="space-y-1">
                {NAV.map((n) => {
                  const active = loc.pathname === n.to;
                  return (
                    <Link
                      key={n.to}
                      to={n.to}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-full transition-colors",
                        active ? "bg-slate-100 font-semibold" : "hover:bg-slate-50"
                      )}
                    >
                      <span className={cn("w-6 h-6 text-xl", active ? "text-black" : "text-slate-600")}>{n.icon}</span>
                      <span className="text-sm">{n.label}</span>
                    </Link>
                  );
                })}

                <div className="mt-4">
                  <Button className="w-full" aria-label="Post">Post</Button>
                </div>
              </nav>
            </ScrollArea>
          </SheetContent>
        </Sheet>

        <div className="text-xl font-bold">
          <BsTwitter className="w-6 h-6" />
        </div>
        <div className="w-8" />
      </div>

      <div className="flex">
        {/* Desktop sidebar */}
        <aside className={cn("hidden md:flex flex-col w-72 h-screen bg-card border-r px-3 py-4", className)}>
          <div className="px-2 py-2 mb-2">
            <BsTwitter className="w-7 h-7 text-sky-500" />
          </div>

          <nav className="flex-1 space-y-1">
            {NAV.map((n) => {
              const active = loc.pathname === n.to;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={cn(
                    "flex items-center gap-4 px-3 py-3 rounded-full transition-colors",
                    active ? "bg-slate-100 font-semibold" : "hover:bg-slate-50"
                  )}
                >
                  <span className={cn("w-6 h-6 text-xl", active ? "text-black" : "text-slate-600")}>{n.icon}</span>
                  <span className="text-base">{n.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-4 px-2">
            <Button className="w-full rounded-full py-3" aria-label="Post">Post</Button>
          </div>

          <div className="mt-6 px-2">
            <div className="flex items-center gap-3 p-2 rounded-full hover:bg-slate-50">
              <div className="w-10 h-10 bg-slate-200 rounded-full" />
              <div className="flex-1">
                <div className="text-sm font-semibold">Your Name</div>
                <div className="text-xs text-slate-500">@username</div>
              </div>
              <div className="text-slate-500">
                <FiMoreHorizontal />
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-h-screen bg-background p-6">
          <div className="max-w-4xl mx-auto">{children}</div>
        </main>
      </div>
    </>
  );
}
