// src/types/index.ts

export interface User {
  user_id: number;
  username: string;
  fullname?: string;
  bio?: string;
  profile_image?: string;
  cover_image?: string;
  isFollowing?:boolean
} 

export interface TweetMedia {
  media_url: string;
  media_type: "image" | "video";
}

export interface Tweet {
  tweet_id: number;
  content: string;
  created_at: string;
  username: string;
  fullname: string;
  profile_image?: string;
  media_url?: string;
  media_type?: "image" | "video";
  like_count: number;
  retweet_count: number;
  isLiked: boolean;
  isRetweeted: boolean;
  type: "tweet" | "retweet";
  retweeted_by_fullname:string

}

export interface Comment {
  comment_id: number;
  content: string;
  created_at: string;
  username: string;
  fullname: string;
  profile_image?: string;
  tweet_id: number;
  parent_comment_id?: number | null;
  replies?: Comment[];
}

export interface Notification {
  notification_id: number;
  user_id: number;
  actor_id: number;
  tweet_id?: number;
  comment_id?: number;
  type: "like" | "comment" | "reply" | "follow" | "retweet";
  is_read: boolean;
  created_at: string;
  actor?: Pick<User, "username" | "fullname" | "profile_image">;
}

export interface AuthUser extends User {
  email: string;
}