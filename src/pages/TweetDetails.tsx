// src/pages/TweetDetailPage.tsx

import { MainLayout } from "@/components/Layout/MainLayout";
import { TweetCard } from "@/components/tweet/TweetCard";
import { useTweetDetails } from "@/hooks/useTweets";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export function TweetDetailPage() {
  const { tweetId } = useParams<{ tweetId: string }>();
  const navigate = useNavigate();
  if (!tweetId) {
    return;
  }
  const { isLoadingTweet, tweet } = useTweetDetails(tweetId);

  return (
    <MainLayout showRight>
      {/* Header */}
      <div className="flex items-center gap-6 px-4 py-3 sticky top-0 bg-white/90 backdrop-blur-sm border-b border-gray-200 z-10">
        <button
          className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-bold text-xl text-gray-900">Tweet</h1>
      </div>
        {isLoadingTweet ? (
        <div className="flex justify-center py-10">
          <div className="w-6 h-6 border-2 border-[#1d9bf0] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : tweet ? (
        <TweetCard tweet={tweet} />
      ) : (
        <div className="py-10 text-center text-gray-400">Tweet not found.</div>
      )}
    </MainLayout>
  );
}
