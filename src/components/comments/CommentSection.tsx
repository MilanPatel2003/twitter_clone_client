import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useComments } from "@/hooks/useComments";
import { useAuth } from "@/context/AuthContext";
import { CommentItem } from "./CommentItem";

interface Props {
  tweetId: number;
}

export function CommentSection({ tweetId }: Props) {
  const { user } = useAuth();
  const { comments, isLoading, addComment, deleteComment } = useComments(tweetId);
  const [text, setText] = useState("");

  const handleSubmit = async () => {
    if (!text.trim()) return;
    await addComment(text);
    setText("");
  };

  return (
    <div className="px-4">

      {/* Input to write new comment */}
      <div className="flex gap-3 py-3 border-b border-gray-200">
        <Avatar className="w-8 h-8 shrink-0">
          <AvatarImage src={user?.profile_image} />
          <AvatarFallback className="bg-[#1d9bf0] text-white text-xs font-semibold">
            {user?.fullname?.[0]?.toUpperCase() ?? "U"}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 flex gap-2 items-center">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 text-sm border border-gray-200 rounded-full px-3 py-1.5 outline-none focus:border-[#1d9bf0]"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={!text.trim()}
            className="text-sm font-bold text-[#1d9bf0] disabled:opacity-40 shrink-0"
          >
            Post
          </button>
        </div>
      </div>

      {/* Comments list */}
      {isLoading ? (
        <div className="flex justify-center py-6">
          <div className="w-5 h-5 border-2 border-[#1d9bf0] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-6">
          No comments yet. Be the first!
        </p>
      ) : (
        comments.map((comment) => (
          <CommentItem
            key={comment.comment_id}
            comment={comment}
            onDelete={deleteComment}
          />
        ))
      )}
    </div>
  );
}