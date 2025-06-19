import { fetchUserProfile } from "@/utils/api";
import React, { useEffect, useState } from "react";

export default function ProfileCard({ identifier }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadingContent = (
    <div className="flex w-52 flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className="skeleton skeleton-animated h-16 w-16 shrink-0 rounded-full"></div>
        <div className="flex flex-col gap-4">
          <div className="skeleton skeleton-animated h-4 w-20"></div>
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
    const fetchProfile = async () => {
      try {
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

  // Récupère les initiales de l'username (ou "??" si absent)
  const initials = user?.username
    ? user.username
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "??";

  return (
    <>
      {loading ? (
        loadingContent
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        // <div className="rounded-lg p-4 flex items-center space-x-4">
        //   <div className="avatar avatar-placeholder">
        //     <div className="bg-neutral text-neutral-content w-10 h-10 rounded-full flex items-center justify-center">
        //       <span className="text-md uppercase">{initials}</span>
        //     </div>
        //   </div>
        //   <div>
        //     <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        //       @{user?.username || "Utilisateur"}
        //     </h2>
        //   </div>
        // </div>
        <div className="flex w-52 flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-neutral text-neutral-content h-16 w-16 shrink-0 rounded-full flex items-center justify-center">
              <span className="text-xl uppercase">{initials}</span>
            </div>
            <div className="flex flex-col gap-4">
              <p className="h-4 w-20 text-lg font-semibold">{user?.username}</p>
              <div className="skeleton h-4 w-28"></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
