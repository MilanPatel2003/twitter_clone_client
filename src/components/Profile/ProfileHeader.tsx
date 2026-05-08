// src/components/profile/ProfileHeader.tsx
import { ArrowLeft, VerifiedIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { type User } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { useFollow, useFollowers, useFollowing } from "@/hooks/useFollow";
interface Props {
  profile: User;
  tweetCount?: number;
  isFollowing?: boolean;
}

export function ProfileHeader({ profile, tweetCount = 0, isFollowing = false }: Props) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isOwn = user?.username === profile.username;
  const { isFollowing: following, follow, unFollow } = useFollow(isFollowing);
  const { followers } = useFollowers(profile.user_id);
  const { followings: followingList } = useFollowing(profile.user_id);

  return (
    <div>

      {/* Back button + name */}
      <div className="flex items-center gap-4 px-4 py-3 sticky top-0 bg-white/90 backdrop-blur-sm border-b border-gray-200 z-10">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <p className="font-bold text-lg text-gray-900">{profile.fullname} </p>
          <p className="text-gray-500 text-sm">{tweetCount} Tweets</p>
        </div>
      </div>

      {/* Cover */}
      <div className="h-48 bg-gradient-to-r from-[#1d9bf0]/30 to-[#1d9bf0]/10">
        {profile.cover_image && (
          <img src={profile.cover_image} className="w-full h-full object-cover" />
        )}
      </div>

      {/* Avatar + follow button */}
      <div className="flex items-end justify-between px-4 -mt-12 mb-3">
        <Avatar className="w-24 h-24 border-4 border-white">
          <AvatarImage src={profile.profile_image} />
          <AvatarFallback className="bg-[#1d9bf0] text-white text-3xl font-bold">
            {profile.fullname?.[0]?.toUpperCase() ?? "U"} 
          </AvatarFallback>
        </Avatar>

        {isOwn ? (
          <Button
            onClick={() => navigate("/profile/edit")}
            variant="outline"
            className="rounded-full font-bold h-9 px-4"
          >
            Edit profile
          </Button>
        ) : (
          <Button
            onClick={() => following ? unFollow(profile.user_id) : follow(profile.user_id)}
            className={`rounded-full font-bold h-9 px-4 ${
              following
                ? "bg-white text-gray-900 border border-gray-300 hover:border-red-300 hover:text-red-500"
                : "bg-gray-900 text-white hover:bg-gray-700"
            }`}
          >
            {following ? "Following" : "Follow"}
          </Button>
        )}
      </div>

      {/* Bio */}
      <div className="px-4 pb-4">
         <div className="flex items-center gap-1">
    <p className="font-bold text-xl text-gray-900">
      {profile.fullname ?? ""}
    </p>

    {profile.username === "milan22102003" && (
      <VerifiedIcon className="w-5 h-5 text-white fill-blue-400" />
    )}
  </div>

        {/* Followers + Following count */}
        <div className="flex items-center gap-4 mt-2">
          <button
            onClick={() => navigate(`/${profile.username}/${profile.user_id}/following`)}
            className="flex items-center gap-1 hover:underline"
          >
            <span className="font-bold text-gray-900 text-sm">{followingList.length}</span>
            <span className="text-gray-500 text-sm">Following</span>
          </button>
          <button
            onClick={() => navigate(`/${profile.username}/${profile.user_id}/followers`)}
            className="flex items-center gap-1 hover:underline"
          >
            <span className="font-bold text-gray-900 text-sm">{followers.length}</span>
            <span className="text-gray-500 text-sm">Followers</span>
          </button>
        </div>

        {profile.bio && (
          <p className="text-gray-800 text-sm mt-2">{profile.bio}</p>
        )}
      </div>

    </div>
  );
}