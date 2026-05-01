import api from "@/lib/api";

export function useReactions() {
  const likeTweet = (tweetId: number) =>
    api.post(`/reactions/tweets/${tweetId}`);

  const unlikeTweet = (tweetId: number) =>
    api.delete(`/reactions/tweets/${tweetId}`);

  return { likeTweet, unlikeTweet };
}