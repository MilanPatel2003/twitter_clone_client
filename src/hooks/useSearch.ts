import { useState } from "react";
import api from "@/lib/api";
import { type User,type Tweet } from "@/types";

export function useSearch() {
  const [users, setUsers] = useState<User[]>([]);
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const search = async (q: string) => {
    if (!q.trim()) {
      setUsers([]);
      setTweets([]);
      return;
    }
    setIsLoading(true);
    try {
      const res = await api.get(`/search?q=${q}`);
      setUsers(res.data.users);
      setTweets(res.data.tweets);
    } finally {
      setIsLoading(false);
    }
  };

  return { users, tweets, isLoading, search };
}