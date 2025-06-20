"use client";

import { useEffect, useState, use } from "react";
import UserAvatar from "@/components/UserAvatar";
import { fetchUserProfile, fetchUserFollowing } from "@/utils/api";
import { useAuth } from "@/contexts/authcontext";
import { useTranslations } from "next-intl";

export default function UserPage({ params }) {
  const t = useTranslations("Profile");
  const { identifier } = useAuth();
  // Utilisez React.use() pour obtenir les params
  const { username } = use(params);
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("not-following");

  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await fetchUserProfile(username);
        setUserProfile(profile);
      } catch (err) {
        setError(err);
      }
    }
    if (username) {
      loadProfile();
    }
  }, [username]);

  useEffect(() => {
    async function loadStatus() {
      try {
        const followings = await fetchUserFollowing(userProfile?.id);
        // Si followings n'est pas un tableau, on le force à []
        const list = Array.isArray(followings)
          ? followings
          : Array.isArray(followings?.data)
          ? followings.data
          : [];
        if (list.some((user) => user.id === identifier)) {
          setStatus("following");
        } else {
          setStatus("not-following");
        }
      } catch (err) {
        console.error("Error fetching following:", err);
      }
    }
    if (userProfile) {
      loadStatus();
    }
  }, [userProfile]);

  if (error || !userProfile) {
    return <h1>{t("userNotFound")}</h1>;
  }
  let actionButton = null;
  switch (true) {
    case userProfile.id === identifier:
      actionButton = (
        <button className="btn btn-primary btn-outline px-6 py-2 font-semibold">
          {t("editProfile")}
        </button>
      );
      break;
    case status === "following":
      actionButton = (
        <button className="btn btn-primary btn-outline px-6 py-2 font-semibold">
          {t.raw("status")["following"]}
        </button>
      );
      break;
    case status === "not-following":
      actionButton = (
        <button className="btn btn-primary px-6 py-2 font-semibold">
          {t.raw("status")["follow"]}
        </button>
      );
      break;
    case status === "friends":
      actionButton = (
        <button className="btn btn-primary btn-outline px-6 py-2 font-semibold">
          {t.raw("status")["friends"]}
        </button>
      );
      break;
    default:
      actionButton = null;
  }

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <div>
        <UserAvatar user={userProfile} size="lg" />
      </div>
      <div className="w-full">
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-2xl font-bold">{userProfile.username}</h2>
          {actionButton}
        </div>
        <p className="mt-4 text-lg">{userProfile.bio}</p>
        <div className="flex gap-4 mt-4 text-gray-500">
          {userProfile.location && (
            <span>
              <i className="fi fi-rr-marker"></i> {userProfile.location}
            </span>
          )}
          {userProfile.joined && (
            <span>
              <i className="fi fi-rr-calendar"></i> Inscrit en{" "}
              {new Date(userProfile.joined).toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "long",
              })}
            </span>
          )}
        </div>
        <div className="flex gap-6 mt-4 font-semibold">
          <span>
            <span className="text-black">{userProfile.followingCount}</span>{" "}
            abonnements
          </span>
          <span>
            <span className="text-black">{userProfile.followersCount}</span>{" "}
            abonnés
          </span>
        </div>
      </div>
      <div className="w-full mt-8">
        <h3 className="text-xl font-bold mb-4">Posts</h3>
        <div className="flex flex-col gap-4">
          {userProfile.posts && userProfile.posts.length > 0 ? (
            userProfile.posts.map((post) => (
              <div key={post.id} className="card bg-base-100 shadow p-4">
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={userProfile.avatarUrl || "/default-avatar.png"}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="font-semibold">
                    {userProfile.displayName}
                  </span>
                  <span className="text-gray-500 text-sm">
                    @{userProfile.username} ·{" "}
                    {new Date(post.createdAt).toLocaleDateString("fr-FR")}
                  </span>
                </div>
                <p>{post.content}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Aucun post pour le moment.</p>
          )}
        </div>
      </div>
    </div>
  );
}
