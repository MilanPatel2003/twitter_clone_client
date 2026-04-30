// src/hooks/useTweets.ts
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { type Tweet } from "@/types";

export function useFeedTweets() {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get("/tweets/feed")
      .then((res) => setTweets(res.data))
      .catch(() => setError("Failed to load feed"))
      .finally(() => setIsLoading(false));
  }, []);

  const createTweet = async (content: string, mediaFile?: File) => {
    const formData = new FormData();
    formData.append("content", content);
    if (mediaFile) formData.append("media", mediaFile);

    const res = await api.post("/tweets", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setTweets((prev) => [res.data.tweet, ...prev]);
  };

  const deleteTweet = async (tweetId: number) => {
    await api.delete(`/tweets/${tweetId}`);
    setTweets((prev) => prev.filter((t) => t.tweet_id !== tweetId));
  };

  return { tweets, isLoading, error, createTweet, deleteTweet };
}

export function useUserTweets(username: string) {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/users/${username}/tweets`)
      .then((res) => setTweets(res.data.tweets))
      .finally(() => setIsLoading(false));
  }, [username]);

  return { tweets, isLoading };
}

export function useTweetDetails(tweetId: string) {
  const [tweet, setTweet] = useState<Tweet | null>(null);
  const [isLoadingTweet, setIsLoadingTweet] = useState(true);
  useEffect(() => {
    if (!tweetId) return;

    api
      .get(`/tweets/${tweetId}`)
      .then((res) => setTweet(res.data))
      .finally(() => setIsLoadingTweet(false));
  }, [tweetId]);
  return { tweet, isLoadingTweet };
}
