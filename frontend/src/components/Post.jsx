import ProfileCard from "./ProfileCard";
import UserAvatar from "./UserAvatar";
import LikeButton from "./LikeButton";
import { likeBreeze, fetchUserProfile } from "@/utils/api";
import React, { useEffect, useState } from "react";

export default function Post({ post }) {
  const [author, setAuthor] = useState(null);

  useEffect(() => {
    console.log(post);
    async function loadAuthor() {
      try {
        const authorProfile = await fetchUserProfile(post.author);
        setAuthor(authorProfile);
      } catch (error) {
        console.error("Error fetching author profile:", error);
        setAuthor("Unknown User");
      }
    }
    loadAuthor();
  }, [post.author]);



  return (
    <div className="">
      <div className="flex items-center gap-3 mb-2">
        <div className="tooltip tooltip-toggle" aria-label="Popover Button">
          <UserAvatar size="xs" user={author} />
          <div
            className="tooltip-content tooltip-shown:opacity-100 tooltip-shown:visible z-80"
            role="popover"
          >
            <div className="tooltip-body bg-base-200 max-w-xs card p-4 text-start outline-solid">
              <ProfileCard identifier={post.author} full={true} />
            </div>
          </div>
        </div>
        <span className="font-semibold">
          {author && typeof author === "object" && author.username
            ? author.username
            : "Utilisateur inconnu"}
        </span>
        <span
          className="text-gray-500 text-sm tooltip tooltip-toggle"
          title={new Date(post.createdAt).toLocaleString("fr-FR", {
            dateStyle: "full",
            timeStyle: "short",
          })}
        >
          {new Date(post.createdAt).toLocaleDateString("fr-FR")}
          <LikeButton active={true} count={post.likesCount} onLike={likeBreeze} idToLike={post._id}  />
        </span>
      </div>
      <p>{post.content}</p>
      {post.mediaUrls && post.mediaUrls.length > 0 && (
        <div className="mt-4">
          {post.mediaUrls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Post image ${index + 1}`}
              className="w-full h-auto rounded-lg shadow-md"
            />
          ))}
        </div>
      )}
      <hr className="border-t border-base-content/30 mt-4 w-full" />
    </div>
  );
}
