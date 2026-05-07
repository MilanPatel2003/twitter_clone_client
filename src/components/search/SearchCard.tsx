import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import { type Tweet } from "@/types";

interface Props {
  tweet: Tweet;
}

export function SearchCard({ tweet }: Props) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/tweet/${tweet.tweet_id}`)}
      className="border-b border-gray-200 px-4 py-3 hover:bg-gray-50 cursor-pointer"
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <Avatar
          className="w-10 h-10 shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/${tweet.username}`);
          }}
        >
          <AvatarImage src={tweet.profile_image} />
          <AvatarFallback className="bg-[#1d9bf0] text-white font-semibold">
            {tweet.fullname[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          {/* Name row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-gray-900">
                {tweet.fullname}
              </span>
              <span className="text-gray-500 text-sm">@{tweet.username}</span>
              <span className="text-gray-400 text-sm">
                · {formatDate(tweet.created_at)}
              </span>
            </div>
          </div>

          {/* Content */}
          <p className="text-sm text-gray-900 mt-1 leading-relaxed wrap-break-word">
            {tweet.content}
          </p>
        </div>
      </div>
    </div>
  );
}
