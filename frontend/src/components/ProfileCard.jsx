import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import UserAvatar from "./UserAvatar";

export default function ProfileCard({ user, full = false }) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  useEffect(() => {
    if (!user) {
      setLoading(true);
      setError("Utilisateur introuvable");
      return;
    }
    if (user?.username) {
      setTimeout(() => {
        setLoading(false);
        setError(null);
      }, 1000);
    } else {
      setLoading(true);
      setError("Chargement du profil...");
    }
  }, [user]);

  const loadingContent = (
    <div className="flex w-52 flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className="skeleton skeleton-animated h-16 w-16 shrink-0 rounded-full"></div>
        <div className="flex flex-col gap-4">
          <div className="skeleton skeleton-animated h-4 w-20"></div>
          <div className="skeleton skeleton-animated h-4 w-28"></div>
          <div className="skeleton skeleton-animated h-4 w-28"></div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {loading ? (
        loadingContent
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="flex items-center gap-4">
          <UserAvatar user={user} size="md" />
          <div className="flex flex-col gap-2">
            <div>
              <Link
                className="h-4 w-20 text-lg font-semibold text-base-content"
                href={`/profile/${user.username}`}
              >
                {user?.username}
              </Link>
              {full && <p className="text-base-content text-sm">{user.bio}</p>}
            </div>
            <div className="h-4 w-28 text-base-content/80">
              <span className="text-base-content font-semibold">
                {user?.followingCount}
              </span>{" "}
              abonnements
            </div>
            <div className="h-4 w-28 text-base-content/80">
              <span className="text-base-content font-semibold">
                {user?.followersCount}
              </span>{" "}
              abonnés
            </div>
          </div>
        </div>
      )}
    </>
  );
}
