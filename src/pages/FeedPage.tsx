// src/pages/FeedPage.tsx
import { MainLayout } from "@/components/Layout/MainLayout";
import { TweetCard } from "@/components/tweet/TweetCard";
import { TweetComposer } from "@/components/tweet/TweetComposer";
import { useFeedTweets } from "@/hooks/useTweets";

export function FeedPage() {
  const { tweets, isLoading, error, deleteTweet , createTweet} =
    useFeedTweets();

  return (
    <MainLayout>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <h1 className="px-4 py-3 font-bold text-xl text-gray-900">Home</h1>
      </div>

      {/* Composer */}
      <TweetComposer onTweet={createTweet} />

      {/* Feed */}
      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="w-6 h-6 border-2 border-[#1d9bf0] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="py-10 text-center text-gray-400 text-sm">{error}</div>
      ) : tweets.length === 0 ? (
        <div className="py-16 px-8 text-center">
          <h2 className="font-bold text-2xl text-gray-900 mb-2">
            Welcome to Twitter!
          </h2>
          <p className="text-gray-500">
            Follow some people to see their tweets here.
          </p>
        </div>
      ) : (
        tweets.map((tweet) => (
          <TweetCard
            key={`${tweet.tweet_id}-${tweet.type}`}
            tweet={tweet}
            onDelete={deleteTweet}
          />
        ))
      )}
    </MainLayout>
  );
}