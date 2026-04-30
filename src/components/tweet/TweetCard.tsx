// src/components/tweet/TweetCard.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Repeat2, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TweetMedia } from "./TweetMedia";
import { TweetActions } from "./TweetActions";
import { formatDate } from "@/lib/utils";
import {type Tweet } from "@/types";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

interface Props {
  tweet: Tweet;
  onDelete?: (tweetId: number) => void;
}

export function TweetCard({ tweet, onDelete }: Props) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(tweet);

  const isOwner = user?.username === data.username;

  const handleLike = async () => {
    if (data.isLiked) {
      await api.delete(`/reactions/tweets/${data.tweet_id}`);
      setData((prev) => ({ ...prev, isLiked: false, like_count: prev.like_count - 1 }));
    } else {
      await api.post(`/reactions/tweets/${data.tweet_id}`);
      setData((prev) => ({ ...prev, isLiked: true, like_count: prev.like_count + 1 }));
    }
  };

  const handleRetweet = async () => {
    if (data.isRetweeted) {
      await api.delete(`/retweets/${data.tweet_id}`);
      setData((prev) => ({ ...prev, isRetweeted: false, retweet_count: prev.retweet_count - 1 }));
    } else {
      await api.post(`/retweets/${data.tweet_id}`);
      setData((prev) => ({ ...prev, isRetweeted: true, retweet_count: prev.retweet_count + 1 }));
    }
  };

  return (
    <div
      onClick={() => navigate(`/tweet/${data.tweet_id}`)}
      className="border-b border-gray-200 px-4 py-3 hover:bg-gray-50 cursor-pointer"
    >
      {/* Retweet label */}
      {data.type === "retweet" && (
        <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-2 ml-10">
          <Repeat2 className="w-3.5 h-3.5" />
          <span>{data.fullname} retweeted</span>
        </div>
      )}

      <div className="flex gap-3">
        {/* Avatar */}
        <Avatar
          className="w-10 h-10 shrink-0"
          onClick={(e) => { e.stopPropagation(); navigate(`/${data.username}`); }}
        >
          <AvatarImage src={data.profile_image} />
          <AvatarFallback className="bg-[#1d9bf0] text-white font-semibold">
            {data.fullname[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          {/* Name row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-gray-900">{data.fullname}</span>
              <span className="text-gray-500 text-sm">@{data.username}</span>
              <span className="text-gray-400 text-sm">· {formatDate(data.created_at)}</span>
            </div>

            {/* Delete button */}
            {isOwner && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete?.(data.tweet_id); }}
                className="text-gray-400 hover:text-red-500 transition-colors p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Content */}
          <p className="text-sm text-gray-900 mt-1 leading-relaxed">{data.content}</p>

          {/* Media */}
          {data.media_url && data.media_type && (
            <div onClick={(e) => e.stopPropagation()}>
              <TweetMedia url={data.media_url} type={data.media_type} />
            </div>
          )}

          {/* Actions */}
          <div onClick={(e) => e.stopPropagation()}>
            <TweetActions
              tweet={data}
              onLike={handleLike}
              onRetweet={handleRetweet}
              onComment={() => navigate(`/tweet/${data.tweet_id}`)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
