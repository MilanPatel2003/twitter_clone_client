// src/components/profile/ProfileHeader.tsx
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { type User } from "@/types";
import { useAuth } from "@/context/AuthContext";

interface ProfileHeaderProps {
  profile: User;
  tweetCount?: number;
  isFollowing?: boolean;
  onFollow?: () => void;
  onUnfollow?: () => void;
}

export function ProfileHeader({
  profile,
  tweetCount = 0,
  isFollowing = false,
  onFollow,
  onUnfollow,
}: ProfileHeaderProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isOwnProfile = user?.username === profile.username;
  const [following, setFollowing] = useState(isFollowing);

  const handleFollowToggle = async () => {
    if (following) {
      await onUnfollow?.();
      setFollowing(false);
    } else {
      await onFollow?.();
      setFollowing(true);
    }
  };

  return (
    <div>
      {/* Top bar */}
      <div className="flex items-center gap-6 px-4 py-3 sticky top-0 bg-white/90 backdrop-blur-sm z-10 border-b border-gray-200">
        <button
          className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-bold text-xl text-gray-900">{profile.fullname}</h1>
          <p className="text-gray-500 text-sm">{tweetCount} Tweets</p>
        </div>
      </div>

      {/* Cover image */}
      <div className="relative">
        <div className="h-48 bg-[#cfd9de] overflow-hidden">
          {profile.cover_image ? (
            <img
              src={profile.cover_image}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-[#1d9bf0]/30 to-[#1d9bf0]/10" />
          )}
        </div>

        {/* Avatar overlapping cover */}
        <div className="absolute -bottom-12 left-4">
          <Avatar className="w-24 h-24 border-4 border-white">
            <AvatarImage src={profile.profile_image} />
            <AvatarFallback className="bg-[#1d9bf0] text-white text-3xl font-bold">
              {/* {profile.fullname.toUpperCase()} */}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Action button top-right */}
        <div className="absolute -bottom-12 right-4">
          {isOwnProfile ? (
            <Button
              variant="outline"
              className="rounded-full font-bold border-gray-300 text-gray-900 hover:bg-gray-50 h-9 px-4"
            >
              Edit profile
            </Button>
          ) : (
            <Button
              variant={following ? "outline" : "default"}
              className={
                following
                  ? "rounded-full font-bold border-gray-900 text-gray-900 hover:border-red-300 hover:bg-red-50 hover:text-red-500 h-9 px-4 group"
                  : "rounded-full font-bold bg-gray-900 hover:bg-gray-700 text-white h-9 px-4"
              }
              onClick={handleFollowToggle}
            >
              {following ? (
                <>
                  <span className="group-hover:hidden">Following</span>
                  <span className="hidden group-hover:inline">Unfollow</span>
                </>
              ) : (
                "Follow"
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Profile info */}
      <div className="px-4 pt-16 pb-4">
        <h2 className="font-extrabold text-xl text-gray-900">{profile.fullname}</h2>
        <p className="text-gray-500 text-sm">@{profile.username}</p>
        {profile.bio && (
          <p className="text-gray-900 text-sm mt-3 leading-relaxed">{profile.bio}</p>
        )}
      </div>
    </div>
  );
}