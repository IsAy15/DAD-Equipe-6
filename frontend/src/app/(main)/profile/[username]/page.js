"use client";

import { useEffect, useState, use } from "react";
import UserAvatar from "@/components/UserAvatar";
import { useLocale } from "next-intl";
import {
  fetchUserProfile,
  fetchUserFollowing,
  fetchUserFollowers,
  fetchUserPosts,
} from "@/utils/api";
import { useAuth } from "@/contexts/authcontext";
import { useTranslations } from "next-intl";
import EditProfile from "@/components/EditProfile";
import Feed from "@/components/Feed";

export default function UserPage({ params }) {
  const t = useTranslations("Profile");
  const { identifier, accessToken } = useAuth();
  // Utilisez React.use() pour obtenir les params
  const { username } = use(params);
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("not-following");
  // Ajoutez ces deux lignes :
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

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

  // Ajoutez ce useEffect pour charger les posts
  useEffect(() => {
    async function loadPosts() {
      if (!userProfile) return;
      setLoadingPosts(true);
      try {
        const userPosts = await fetchUserPosts(userProfile.id, accessToken);
        setPosts(userPosts || []);
      } catch (err) {
        setPosts([]);
      }
      setLoadingPosts(false);
    }
    loadPosts();
  }, [userProfile, accessToken]);

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
        <button
          type="button"
          className="btn btn-primary btn-outline px-6 py-2 font-semibold"
          aria-haspopup="dialog"
          aria-expanded="false"
          aria-controls="slide-up-animated-modal"
          data-overlay="#slide-up-animated-modal"
        >
          {t("editProfile")}
        </button>
      );
      break;
    case status === "following":
      actionButton = (
        <button
          className="btn btn-primary btn-outline px-6 py-2 font-semibold"
          onClick={() => setStatus("not-following")}
        >
          {t.raw("status")["following"]}
        </button>
      );
      break;
    case status === "not-following":
      actionButton = (
        <button
          className="btn btn-primary px-6 py-2 font-semibold"
          onClick={() => setStatus("following")}
        >
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
    <div className="flex flex-col items-center max-sm:p-6 p-8 gap-4">
      <EditProfile />
      <div className="w-full">
        <div className="flex gap-4 items-center justify-between w-full">
          <UserAvatar user={userProfile} size="lg" />
          <h2 className="text-2xl font-bold flex-1">{userProfile.username}</h2>
          <div className="flex flex-col items-center gap-2">{actionButton}</div>
        </div>
        <div className="w-full p-4">
          <p className="text-lg mb-4">{userProfile.bio}</p>

          <table className="w-full text-left table-auto border-separate border-spacing-y-2">
            <tbody>
              <tr>
                <td className="text-primary/80">
                  <div className="flex items-center">
                    <span className="icon-[tabler--wind] size-6 mr-2" />
                    <span>Breezes {posts.length}</span>
                  </div>
                </td>
                <td className="text-primary/80">
                  <div className="flex items-center">
                    <span className="icon-[tabler--calendar-week] size-6 mr-2" />
                    <span>
                      {t("joined")}{" "}
                      <span className="capitalize">
                        {userProfile.joinedAt
                          ? new Date(userProfile.joinedAt).toLocaleDateString(
                              useLocale(),
                              {
                                year: "numeric",
                                month: "long",
                              }
                            )
                          : t("unknownDate")}
                      </span>
                    </span>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="text-base-content/80">
                  <span className="text-base-content font-semibold">
                    {userProfile.followingCount}
                  </span>{" "}
                  {t("followings")}
                </td>
                <td className="text-base-content/80">
                  <span className="text-base-content font-semibold">
                    {userProfile.followersCount}
                  </span>{" "}
                  {t("followers")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <hr className="border-t border-base-content/30 w-full" />
      <Feed posts={posts} loadPosts={loadingPosts} />
    </div>
  );
}
