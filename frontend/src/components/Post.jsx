import ProfileCard from "./ProfileCard";
import UserAvatar from "./UserAvatar";
import { fetchUserProfile } from "@/utils/api";
import React, { useEffect, useState } from "react";

export default function Post({ post }) {
  const [author, setAuthor] = useState(null);

  useEffect(() => {
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
    <div className="card bg-base-100 shadow p-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="tooltip tooltip-toggle" aria-label="Popover Button">
          <UserAvatar size="xs" user={author} />
          <div
            className="tooltip-content tooltip-shown:opacity-100 tooltip-shown:visible z-80"
            role="popover"
          >
            <div className="tooltip-body bg-base-200 max-w-xs card p-4 text-start outline-solid">
              <ProfileCard identifier={post.author} />
            </div>
          </div>
        </div>
        <span className="font-semibold">
          {author && typeof author === "object" && author.username
            ? author.username
            : "Utilisateur inconnu"}
        </span>
        <span className="text-gray-500 text-sm">
          {new Date(post.createdAt).toLocaleDateString("fr-FR")}
        </span>
      </div>
      <p>{post.content}</p>
    </div>
  );
}
