// src/components/tweet/TweetMedia.tsx
interface Props {
  url: string;
  type: "image" | "video";
}

export function TweetMedia({ url, type }: Props) {
  if (type === "video") {
    return (
      <video
        src={url}
        autoPlay={true}
        loop={true}
        
        className="mt-3 w-full max-h-96 rounded-2xl border border-gray-200 bg-black"
      />
    );
  }

  return (
    <img
      src={url}
      alt="Tweet media"
      className="mt-3 w-full max-h-96 rounded-2xl border border-gray-200 object-cover"
    />
  );
}
