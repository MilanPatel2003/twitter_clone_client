// src/components/layout/RightColumn.tsx
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Static placeholder data — replace with real API calls later
const TRENDING = [
  { topic: "Technology", tag: "#ReactJS", tweets: "24.5K" },
  { topic: "Sports", tag: "#Cricket", tweets: "18.2K" },
  { topic: "Entertainment", tag: "#Bollywood", tweets: "9.8K" },
  { topic: "Politics", tag: "#India", tweets: "51.4K" },
];

const WHO_TO_FOLLOW = [
  {
    username: "dan_abramov",
    fullname: "Dan Abramov",
    profile_image: "",
  },
  {
    username: "kentcdodds",
    fullname: "Kent C. Dodds",
    profile_image: "",
  },
  {
    username: "leeerob",
    fullname: "Lee Robinson",
    profile_image: "",
  },
];

export function RightColumn() {
  return (
    <aside className="w-[350px] py-2 pl-6 sticky top-0 h-screen overflow-y-auto hidden lg:block">
      {/* Search bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search Twitter"
          className="pl-10 rounded-full bg-gray-100 border-transparent focus-visible:bg-white focus-visible:border-[#1d9bf0] focus-visible:ring-0 text-sm"
        />
      </div>

      {/* What's happening */}
      <Card className="border border-gray-200 rounded-2xl overflow-hidden mb-4">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-xl font-extrabold text-gray-900">
            What's happening
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-2">
          {TRENDING.map((item, i) => (
            <div key={i}>
              <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors">
                <p className="text-gray-500 text-xs">{item.topic} · Trending</p>
                <p className="font-bold text-gray-900 text-sm mt-0.5">
                  {item.tag}
                </p>
                <p className="text-gray-500 text-xs mt-0.5">
                  {item.tweets} Tweets
                </p>
              </div>
              {i < TRENDING.length - 1 && <Separator />}
            </div>
          ))}
          <div className="px-4 pt-2">
            <button className="text-[#1d9bf0] text-sm hover:underline">
              Show more
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Who to follow */}
      <Card className="border border-gray-200 rounded-2xl overflow-hidden">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-xl font-extrabold text-gray-900">
            Who to follow
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-2">
          {WHO_TO_FOLLOW.map((person, i) => (
            <div key={i}>
              <div className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer flex items-center gap-3">
                <Avatar className="w-10 h-10 shrink-0">
                  <AvatarImage src={person.profile_image} />
                  <AvatarFallback className="bg-[#1d9bf0] text-white font-semibold text-sm">
                    {person.fullname[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm truncate">
                    {person.fullname}
                  </p>
                  <p className="text-gray-500 text-sm truncate">
                    @{person.username}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full font-bold text-sm border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white h-8 px-4 shrink-0"
                >
                  Follow
                </Button>
              </div>
              {i < WHO_TO_FOLLOW.length - 1 && <Separator />}
            </div>
          ))}
          <div className="px-4 pt-2">
            <button className="text-[#1d9bf0] text-sm hover:underline">
              Show more
            </button>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}