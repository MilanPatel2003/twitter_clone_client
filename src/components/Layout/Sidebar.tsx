// src/components/layout/Sidebar.tsx
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  User,
  LogOut,
  Feather,
  Search,
  LucideFileCodeCorner,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home", to: "/" },
  // { icon: Bell, label: "Notifications", to: "/notifications" },
  { icon: Search, label: "Search", to: "/search" },
    { icon: LucideFileCodeCorner, label: "Github", to: "https://github.com/MilanPatel2003/twitter-clone-server" },

  { icon: User, label: "Profile", to: "/profile" },
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <aside className="h-screen sticky top-0 flex flex-col items-end pr-2 xl:pr-6 py-2 w-[72px] xl:w-[275px]">
      {/* Logo */}
      <div className="w-full flex justify-center xl:justify-start mb-2 px-3">
        <div className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer transition-colors">
          {/* Classic Twitter bird icon */}
          <svg viewBox="0 0 24 24" className="w-7 h-7 fill-[#1d9bf0]">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
          </svg>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-1 w-full">
        {navItems.map(({ icon: Icon, label, to }) => {
          const resolvedTo = to === "/profile" ? `/${user?.username}` : to;
          return (
            <NavLink key={label} to={resolvedTo} end={to === "/"}>
              {({ isActive }) => (
                <div
                  className={cn(
                    "flex items-center gap-4 px-3 py-3 rounded-full transition-colors w-fit xl:w-full",
                    "hover:bg-gray-100 cursor-pointer",
                    isActive && "font-bold",
                  )}
                >
                  <Icon
                    className={cn(
                      "w-6 h-6 shrink-0",
                      isActive ? "text-gray-900" : "text-gray-700",
                    )}
                  />
                  <span className="hidden xl:block text-gray-900 text-xl">
                    {label}
                  </span>
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Tweet button */}
      <div className="mt-4 w-full flex justify-center xl:justify-start px-0">
        <Button
          className="bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-bold rounded-full w-12 h-12 xl:w-full xl:h-auto xl:py-3.5 xl:px-6 xl:text-lg"
          onClick={() => navigate("/")}
        >
          <Feather className="w-5 h-5 xl:hidden" />
          <span className="hidden xl:block">Tweet</span>
        </Button>
      </div>

      {/* User account at bottom */}
      {user && (
        <div className="mt-auto w-full">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 px-3 py-3 rounded-full hover:bg-gray-100 transition-colors w-full text-left">
                <Avatar className="w-10 h-10 shrink-0">
                  <AvatarImage src={user.profile_image} />
                  <AvatarFallback className="bg-[#1d9bf0] text-white font-semibold">
                    {/* {user.fullname[0].toUpperCase()} */}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden xl:block min-w-0">
                  <p className="font-bold text-gray-900 text-sm truncate">
                    {user.fullname}
                  </p>
                  <p className="text-gray-500 text-sm truncate">
                    @{user.username}
                  </p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem
                className="cursor-pointer text-red-500 focus:text-red-500"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </aside>
  );
}
