// src/hooks/useTweets.ts
import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { type Tweet } from "@/types";

export function useFeedTweets() {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  useEffect(() => {
    api
      .get("/tweets/feed")
      .then((res) => {
        setTweets(res.data);
        setHasMore(res.data.length === 10);
      })
      .catch(() => setError("Failed to load feed"))
      .finally(() => setIsLoading(false));
  }, []);

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) {
      return;
    }
    setIsLoadingMore(true);
    const next = page + 1;
    const res = await api.get(`/tweets/feed?page=${next}&limit=10`);
    setTweets((prev) => [...prev, ...res.data]);
    setPage(next);
    setHasMore(res.data.length === 10);
    setIsLoadingMore(false);
  }, [isLoadingMore, hasMore, page]);

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

  return {
    tweets,
    isLoading,
    error,
    createTweet,
    deleteTweet,
    isLoadingMore,
    hasMore,
    loadMore,
  };
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
