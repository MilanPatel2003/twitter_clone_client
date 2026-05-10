import { useCallback, useState } from "react";
import api from "@/lib/api";
import { type User, type Tweet } from "@/types";

export function useSearch() {
  const [users, setUsers] = useState<User[]>([]);
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [query, setQuery] = useState("");

  const search = async (q: string) => {
    if (!q.trim()) {
      setUsers([]);
      setTweets([]);
      return;
    }

    setQuery(q);
    setPage(1);

    setIsLoading(true);

    try {
      const res = await api.get(`/search?q=${q}&page=1&limit=15`);

      setUsers(res.data.users);
      setTweets(res.data.tweets);

      setHasMore(res.data.tweets.length === 15);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore || !query) {
      return;
    }

    try {
      setIsLoadingMore(true);

      const next = page + 1;

      const res = await api.get(
        `/search?q=${query}&page=${next}&limit=15`
      );

      setPage(next);

      setTweets((prev) => [...prev, ...res.data.tweets]);

      setHasMore(res.data.tweets.length === 15);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore, page, query]);

  return {
    users,
    tweets,
    isLoading,
    search,
    isLoadingMore,
    hasMore,
    loadMore,
  };
}