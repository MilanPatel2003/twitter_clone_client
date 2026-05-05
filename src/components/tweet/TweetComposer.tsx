// src/components/tweet/TweetComposer.tsx
import { useState, useRef } from "react";
import { Image, Video, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

interface Props {
  onTweet: (content: string, mediaFile?: File) => Promise<void>;
}

export function TweetComposer({ onTweet }: Props) {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<"image" | "video" | null>(null);
  const [isPosting, setIsPosting] = useState(false);

  const imageRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  const MAX = 600;
  const canPost =
    content.trim().length > 0 && content.length <= MAX && !isPosting;

  // When user picks a file
  const handleFile = (picked: File, type: "image" | "video") => {
    setFile(picked);
    setFileType(type);
    setPreview(URL.createObjectURL(picked));
  };

  // Remove selected media
  const removeMedia = () => {
    setFile(null);
    setPreview(null);
    setFileType(null);
  };

  // Submit tweet
  const handlePost = async () => {
    if (!canPost) return;
    setIsPosting(true);
    try {
      await onTweet(content, file ?? undefined);
      setContent("");
      removeMedia();
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="flex gap-3 px-4 py-3 border-b border-gray-200">
      {/* Avatar */}
      <Avatar className="w-10 h-10 shrink-0 mt-1">
        <AvatarImage src={user?.profile_image} />
        <AvatarFallback className="bg-[#1d9bf0] text-white font-semibold">
          {user?.fullname?.[0]?.toUpperCase() ?? "U"}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1">
        {/* Text input */}
        <textarea
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = e.target.scrollHeight + "px";
          }}
          placeholder="What's happening?"
          rows={1}
          className="w-full resize-none text-gray-900 placeholder-gray-400 text-xl outline-none bg-transparent pt-2 overflow-hidden"
          style={{ minHeight: "48px" }}
        />
        {/* Media preview */}
        {preview && (
          <div className="relative mt-2 rounded-2xl overflow-hidden border border-gray-200">
            {/* Remove button */}
            <button
              onClick={removeMedia}
              className="absolute top-2 right-2 z-10 w-7 h-7 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>

            {fileType === "image" ? (
              <img src={preview} className="w-full max-h-72 object-cover" />
            ) : (
              <video
                src={preview}
                controls
                className="w-full max-h-72 bg-black"
              />
            )}
          </div>
        )}

        {/* Bottom row */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          {/* Media buttons */}
          <div className="flex items-center gap-1">
            {/* Hidden file inputs */}
            <input
              ref={imageRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f, "image");
                e.target.value = "";
              }}
            />
            <input
              ref={videoRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f, "video");
                e.target.value = "";
              }}
            />

            <button
              onClick={() => imageRef.current?.click()}
              disabled={!!file}
              className="p-2 rounded-full text-[#1d9bf0] hover:bg-[#1d9bf0]/10 disabled:opacity-40 transition-colors"
            >
              <Image className="w-5 h-5" />
            </button>

            <button
              onClick={() => videoRef.current?.click()}
              disabled={!!file}
              className="p-2 rounded-full text-[#1d9bf0] hover:bg-[#1d9bf0]/10 disabled:opacity-40 transition-colors"
            >
              <Video className="w-5 h-5" />
            </button>
          </div>

          {/* Char count + post button */}
          <div className="flex items-center gap-3">
            {content.length > 0 && (
              <span
                className={`text-sm ${content.length > MAX ? "text-red-500" : "text-gray-400"}`}
              >
                {MAX - content.length}
              </span>
            )}
            <Button
              onClick={handlePost}
              disabled={!canPost}
              className="bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-bold rounded-full px-5 h-9"
            >
              {isPosting ? "Posting..." : "Tweet"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
