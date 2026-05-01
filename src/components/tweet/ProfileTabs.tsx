// src/components/profile/ProfileTabs.tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TweetCard } from "@/components/tweet/TweetCard";
import {type Tweet } from "@/types";

interface ProfileTabsProps {
  tweets: Tweet[];
  replies: Tweet[];
  likes: Tweet[];
  isLoading: boolean;
  onDeleteTweet?: (tweetId: number) => void;
}

export function ProfileTabs({
  tweets,
  replies,
  likes,
  isLoading,
  onDeleteTweet,
}: ProfileTabsProps) {
  const renderList = (items: Tweet[]) => {
    if (isLoading) {
      return (
        <div className="py-10 text-center text-gray-400 text-sm">Loading...</div>
      );
    }
    if (items.length === 0) {
      return (
        <div className="py-10 text-center text-gray-400 text-sm">Nothing here yet.</div>
      );
    }
    return items.map((tweet) => (
      <TweetCard
        key={`${tweet.tweet_id}-${tweet.type}`}
        tweet={tweet}
        onDelete={onDeleteTweet}
      />
    ));
  };

  return (
    <Tabs defaultValue="tweets" className="w-full">
      <TabsList className="w-full rounded-none border-b border-gray-200 bg-transparent h-auto p-0">
        {(["tweets", "replies", "likes"] as const).map((tab) => (
          <TabsTrigger
            key={tab}
            value={tab}
            className="flex-1 capitalize text-sm font-semibold text-gray-500 rounded-none border-b-2 border-transparent pb-3 pt-2 data-[state=active]:border-[#1d9bf0] data-[state=active]:text-gray-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:bg-gray-50 transition-colors"
          >
            {tab}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="tweets" className="mt-0">
        {renderList(tweets)}
      </TabsContent>
      <TabsContent value="replies" className="mt-0">
        {renderList(replies)}
      </TabsContent>
      <TabsContent value="likes" className="mt-0">
        {renderList(likes)}
      </TabsContent>
    </Tabs>
  );
}