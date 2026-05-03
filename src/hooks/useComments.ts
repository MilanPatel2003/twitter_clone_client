import { useState, useEffect } from "react";
import api from "@/lib/api";

// shape of a comment from backend
export interface Comment {
  comment_id: number;
  content: string;
  created_at: string;
  username: string;
  fullname: string;
  profile_image?: string;
}

// handles top level comments for a tweet
export function useComments(tweetId: number) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // fetch comments when page loads
  useEffect(() => {
    api
      .get(`/comments/tweet/${tweetId}`)
      .then((res) => setComments(res.data))
      .finally(() => setIsLoading(false));
  }, [tweetId]);

  // add new comment then refetch
  const addComment = async (content: string) => {
    await api.post(`/comments/${tweetId}`, { content });
    const res = await api.get(`/comments/tweet/${tweetId}`);
    setComments(res.data);
  };

  // remove from list instantly
  const deleteComment = async (commentId: number) => {
    await api.delete(`/comments/${commentId}`);
    setComments((prev) => prev.filter((c) => c.comment_id !== commentId));
  };

  return { comments, isLoading, addComment, deleteComment };
}

//we don't fetch on mount — only when user clicks "View replies"
export function useReplies(commentId: number) {
  const [replies, setReplies] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // called when user clicks "View replies"
  const fetchReplies = async () => {
    setIsLoading(true);
    const res = await api.get(`/comments/reply/${commentId}`);
    setReplies(res.data);
    setIsLoading(false);
  };

  // add reply then refetch replies
  const addReply = async (content: string) => {
    await api.post(`/comments/reply/${commentId}`, { content });
    await fetchReplies();
  };

  return { replies, isLoading, fetchReplies, addReply };
}