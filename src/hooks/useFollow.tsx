import api from "@/lib/api";
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