// src/pages/ProfilePage.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ProfileHeader } from "@/components/Profile/ProfileHeader";
import { type User, type Tweet } from "@/types";
import api from "@/lib/api";
import { MainLayout } from "@/components/Layout/MainLayout";
import { ProfileTabs } from "@/components/Profile/ProfileTabs";
import { useFeedTweets } from "@/hooks/useTweets";
import { toast } from "sonner";

export function ProfilePage() {
  const { username } = useParams<{ username: string }>();

  const [profile, setProfile] = useState<User | null>(null);
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [replies, setReplies] = useState<Tweet[]>([]);
    const [likes, setLikes] = useState<Tweet[]>([]);

  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  

  useEffect(() => {
    if (!username) return;
    setIsLoading(true);

    Promise.all([
      api.get(`/users/${username}`),
      api.get(`/users/${username}/tweets`),
      api.get(`/users/${username}/replies`),
      api.get(`/users/${username}/likes`),
    ])
      .then(([profileRes, tweetsRes,repliesRes,likesRes]) => {
        setProfile(profileRes.data);
        setTweets(tweetsRes.data ?? []);
        setReplies(repliesRes.data ?? []);
        setLikes(likesRes.data ?? []);

        setIsFollowing(profileRes.data.isFollowing ?? false);
      })
      .finally(() => setIsLoading(false));
  }, [username]);
    const handleDeleteTweet = async(tweetId: number) => {
      try {
        await api.delete(`tweets/${tweetId}`);
      } catch {
        toast.error("Failed to delete tweet")
      }
    setTweets((prev) => prev.filter((t) => t.tweet_id !== tweetId));
    
    
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 border-2 border-[#1d9bf0] border-t-transparent rounded-full animate-spin" />
        </div>
      </MainLayout>
    );
  }

  if (!profile) {
    return (
      <MainLayout>
        <div className="py-20 text-center text-gray-400">
          This account doesn't exist.
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <ProfileHeader
        profile={profile}
        tweetCount={tweets.length}
        isFollowing={isFollowing}
      />
      <ProfileTabs
        tweets={tweets}
        replies={replies}
        likes={likes}
        isLoading={false}
        onDeleteTweet={handleDeleteTweet}
      />
    </MainLayout>
  );
}
