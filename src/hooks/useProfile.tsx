import api from "@/lib/api";
import {type User } from "@/types";
import { useEffect, useState } from "react";

export function useProfile(username: string) {
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/users/${username}`)
      .then((res) => setProfile(res.data.user))
      .finally(() => setIsLoading(false));
  }, [username]);

  return { profile, isLoading };
}