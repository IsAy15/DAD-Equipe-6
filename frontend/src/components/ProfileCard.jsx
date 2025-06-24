import { useAuth } from "@/contexts/authcontext";
import {
  fetchUserProfile,
  followUser,
  unfollowUser,
  fetchUserFollowing,
} from "@/utils/api";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import UserAvatar from "./UserAvatar";

export default function ProfileCard({ user, full = false }) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("not-following"); // Ajouté

  const { user.id: myId, accessToken } = useAuth(); // Ajouté

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

  useEffect(() => {
    if (!identifier) {
      setUser(null);
      setLoading(false);
      return;
    }
    console.log("ProfileCard identifier:", identifier);
    setLoading(true);
    setError(null);
    const fetchProfile = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const profileData = await fetchUserProfile(identifier);
        console.log("ProfileCard profileData:", profileData);
        setUser(profileData);
        setError(null);

        // Charger le statut de suivi
        if (myId && profileData && profileData.id !== myId) {
          try {
            const followings = await fetchUserFollowing(myId);
            let list = [];
            if (Array.isArray(followings)) {
              list = followings;
            } else if (Array.isArray(followings?.following)) {
              list = followings.following;
            } else if (Array.isArray(followings?.data)) {
              list = followings.data;
            }
            if (list.some((u) => u._id === profileData.id)) {
              setStatus("following");
            } else {
              setStatus("not-following");
            }
          } catch (err) {
            console.error("Erreur lors du fetchUserFollowing:", err);
            setStatus("not-following");
          }
        }
      } catch (err) {
        setError("Erreur lors de la récupération du profil");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [identifier, myId]);

  async function handleFollowClick() {
    if (!user) return;
    try {
      if (status === "not-following") {
        await followUser(user.id, accessToken);
        setStatus("following");
      } else if (status === "following") {
        await unfollowUser(user.id, accessToken);
        setStatus("not-following");
      }
      // Recharge le profil pour mettre à jour le compteur d'abonnés
      const updatedProfile = await fetchUserProfile(identifier);
      setUser(updatedProfile);
    } catch (err) {
      setError("Erreur lors du suivi/désabonnement");
    }
  }

  return (
    <>
      {loading ? (
        loadingContent
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="flex items-center gap-4">
          <UserAvatar user={user} size="md" />
          <div className="flex flex-col gap-2 flex-1">
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
          {/* Bouton suivre/désabonner à droite */}
          {full && user.id !== myId && (
            <button
              className="btn btn-primary px-4 py-1 font-semibold ml-auto"
              onClick={handleFollowClick}
            >
              {status === "following" ? "Se désabonner" : "Suivre"}
            </button>
          )}
        </div>
      )}
    </>
  );
}
