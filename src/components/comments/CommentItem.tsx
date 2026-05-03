import { useState } from "react";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useReplies,type Comment } from "@/hooks/useComments";

interface Props {
  comment: Comment;
  onDelete: (commentId: number) => void;
}

export function CommentItem({ comment, onDelete }: Props) {
  const { user } = useAuth();
  const isOwner = user?.username === comment.username;

  // reply input visibility
  const [showInput, setShowInput] = useState(false);
  const [replyText, setReplyText] = useState("");

  // replies visibility — false by default (lazy load)
  const [showReplies, setShowReplies] = useState(false);

  const { replies, isLoading, fetchReplies, addReply } = useReplies(
    comment.comment_id
  );

  // when user clicks "View replies" for first time → fetch
  // second time → just hide/show
  const handleToggleReplies = () => {
    if (!showReplies && replies.length === 0) {
      fetchReplies(); // only fetch if not already fetched
    }
    setShowReplies((prev) => !prev);
  };

  const handleReply = async () => {
    if (!replyText.trim()) return;
    await addReply(replyText);
    setReplyText("");
    setShowInput(false);
    setShowReplies(true); // auto show replies after replying
  };

  return (
    <div className="py-3 border-b border-gray-100">

      {/* Main comment row */}
      <div className="flex gap-3">
        <Avatar className="w-8 h-8 shrink-0">
          <AvatarImage src={comment.profile_image} />
          <AvatarFallback className="bg-[#1d9bf0] text-white text-xs font-semibold">
            {comment.fullname?.[0]?.toUpperCase() ?? "U"}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          {/* Name + time + delete */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-sm text-gray-900">
                {comment.fullname}
              </span>
              <span className="text-gray-500 text-xs">
                @{comment.username}
              </span>
              <span className="text-gray-400 text-xs">
                · {formatDate(comment.created_at)}
              </span>
            </div>

            {/* Only show delete for your own comment */}
            {isOwner && (
              <button
                onClick={() => onDelete(comment.comment_id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Comment text */}
          <p className="text-sm text-gray-900 mt-1 leading-relaxed">
            {comment.content}
          </p>

          {/* Reply toggle */}
          <button
            onClick={() => setShowInput((prev) => !prev)}
            className="text-xs text-gray-500 hover:text-[#1d9bf0] mt-1.5 font-semibold"
          >
            Reply
          </button>
        </div>
      </div>

      {/* Reply input — shows when Reply is clicked */}
      {showInput && (
        <div className="flex gap-2 mt-2 ml-11">
          <input
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={`Reply to @${comment.username}...`}
            className="flex-1 text-sm border border-gray-200 rounded-full px-3 py-1.5 outline-none focus:border-[#1d9bf0]"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleReply();
            }}
          />
          <button
            onClick={handleReply}
            disabled={!replyText.trim()}
            className="text-sm font-bold text-[#1d9bf0] disabled:opacity-40"
          >
            Reply
          </button>
        </div>
      )}

      {/* View/hide replies button */}
      <button
        onClick={handleToggleReplies}
        className="flex items-center gap-1 ml-11 mt-2 text-[#1d9bf0] text-xs font-semibold"
      >
        {showReplies ? (
          <>
            <ChevronUp className="w-3.5 h-3.5" />
            Hide replies
          </>
        ) : (
          <>
            <ChevronDown className="w-3.5 h-3.5" />
            View replies
          </>
        )}
      </button>

      {/* Replies list — only renders when showReplies is true */}
      {showReplies && (
        <div className="ml-11 mt-2 border-l-2 border-gray-100 pl-3">
          {isLoading ? (
            <p className="text-xs text-gray-400 py-2">Loading...</p>
          ) : replies.length === 0 ? (
            <p className="text-xs text-gray-400 py-2">No replies yet.</p>
          ) : (
            replies.map((reply) => (
              <div key={reply.comment_id} className="flex gap-2 py-2">
                <Avatar className="w-6 h-6 shrink-0">
                  <AvatarImage src={reply.profile_image} />
                  <AvatarFallback className="bg-[#1d9bf0] text-white text-xs">
                    {reply.fullname?.[0]?.toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-gray-900">
                      {reply.fullname}
                    </span>
                    <span className="text-gray-400 text-xs">
                      · {formatDate(reply.created_at)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-900 mt-0.5">
                    {reply.content}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}