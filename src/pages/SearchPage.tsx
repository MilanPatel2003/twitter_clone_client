import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MainLayout } from "@/components/Layout/MainLayout";
import { useSearch } from "@/hooks/useSearch";
import { SearchCard } from "@/components/search/SearchCard";

export function SearchPage() {
  const [query, setQuery] = useState("");
  const { users, tweets, isLoading, search } = useSearch();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    search(e.target.value);
  };

  return (
    <MainLayout>
      {/* Search input */}
      <div className="sticky top-0 bg-white px-4 py-3 border-b border-gray-200 z-10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={query}
            onChange={handleChange}
            placeholder="Search Twitter"
            className="pl-10 rounded-full bg-gray-100 border-transparent focus-visible:ring-[#1d9bf0]"
          />
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center py-10">
          <div className="w-6 h-6 border-2 border-[#1d9bf0] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Users */}
      {users.length > 0 && (
        <div className="border-b border-gray-200">
          <p className="px-4 py-2 font-bold text-gray-900">People</p>
          {users.map((user) => (
            <div
              key={user.user_id}
              onClick={() => navigate(`/${user.username}`)}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer"
            >
              <Avatar className="w-10 h-10">
                <AvatarImage src={user.profile_image} />
                <AvatarFallback className="bg-[#1d9bf0] text-white font-semibold">
                  {user.fullname?.[0]?.toUpperCase() ?? "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold text-sm text-gray-900">{user.fullname}</p>
                <p className="text-gray-500 text-sm">@{user.username}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tweets */}
      {tweets.length > 0 && (
        <div>
          <p className="px-4 py-2 font-bold text-gray-900">Tweets</p>
          {tweets.map((tweet) => (
            <SearchCard key={tweet.tweet_id} tweet={tweet} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && query && users.length === 0 && tweets.length === 0 && (
        <div className="py-16 text-center text-gray-400">
          No results for "{query}"
        </div>
      )}
    </MainLayout>
  );
}