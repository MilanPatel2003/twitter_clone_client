// src/components/tweet/TweetActions.tsx
import { Heart, MessageCircle, Repeat2 } from "lucide-react";
import { type Tweet } from "@/types";
import { formatCount } from "@/lib/utils";

interface Props {
  tweet: Tweet;
  onLike: () => void;
  onRetweet: () => void;
  onComment?: () => void;
}

export function TweetActions({ tweet, onLike, onRetweet, onComment }: Props) {
  return (
    <div className="flex items-center gap-6 mt-3">

      {/* Comment */}
      <button
        onClick={onComment}
        className="flex items-center gap-1.5 text-gray-500 hover:text-[#1d9bf0] transition-colors"
      >
        <MessageCircle className="w-4 h-4" />
        <span className="text-sm">{formatCount(0)}</span>
      </button>

      {/* Retweet */}
      <button
        onClick={onRetweet}
        className={`flex items-center gap-1.5 transition-colors ${
          tweet.isRetweeted ? "text-green-500" : "text-gray-500 hover:text-green-500"
        }`}
      >
        <Repeat2 className="w-4 h-4" />
        <span className="text-sm">{formatCount(tweet.retweet_count)}</span>
      </button>

      {/* Like */}
      <button
        onClick={onLike}
        className={`flex items-center gap-1.5 transition-colors ${
          tweet.isLiked ? "text-pink-500" : "text-gray-500 hover:text-pink-500"
        }`}
      >
        <Heart className={`w-4 h-4 ${tweet.isLiked ? "fill-current" : ""}`} />
        <span className="text-sm">{tweet.like_count}</span>
      </button>

    </div>
  );
}
