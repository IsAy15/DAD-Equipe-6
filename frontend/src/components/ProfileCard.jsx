import { fetchUserProfile } from "@/utils/api";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import UserAvatar from "./UserAvatar";

export default function ProfileCard({ identifier }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

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

  useEffect(() => {
    if (!identifier) {
      setUser(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const fetchProfile = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const profileData = await fetchUserProfile(identifier);
        setUser(profileData);
        setError(null);
      } catch (err) {
        setError("Erreur lors de la récupération du profil");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [identifier]);

  return (
    <>
      {loading ? (
        loadingContent
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="flex w-52 flex-col gap-4">
          <div className="flex items-center gap-4">
            <UserAvatar user={user} size="md" />
            <div className="flex flex-col gap-4">
              <Link
                className="h-4 w-20 text-lg font-semibold"
                href={`/profile/${user.username}`}
              >
                {user?.username}
              </Link>
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
        </div>
      )}
    </>
  );
}
