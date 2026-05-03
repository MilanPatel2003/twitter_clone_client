import api from "@/lib/api";
import type { User } from "@/types";
import { useState, useEffect } from "react";

export function useFollow(initialFollowing: boolean) {
  const [isFollowing, setIsFollowing] = useState(initialFollowing);

  useEffect(() => {
    setIsFollowing(initialFollowing);
  }, [initialFollowing]);

  const follow = async (userId: number) => {
    await api.post(`/follows/${userId}`);
    setIsFollowing(true);
  };

  const unFollow = async (userId: number) => {
    await api.delete(`/follows/${userId}`);
    setIsFollowing(false);
  };

  return { isFollowing, follow, unFollow };
}

export function useFollowers(userId: number) {
  const [followers, setFollowers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/follows/${userId}/followers`)
      .then((res) => setFollowers(res.data))
      .finally(() => setIsLoading(false));
  }, [userId]);

  return { followers, isLoading };
}

export function useFollowing(userId: number) {
  const [followings, setFollowing] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/follows/${userId}/following`)
      .then((res) => setFollowing(res.data))
      .finally(() => setIsLoading(false));
  }, [userId]);

  return { followings, isLoading };
}
