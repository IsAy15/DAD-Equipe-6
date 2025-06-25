"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authcontext";
import { fetchNotifications } from "@/utils/api";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

export default function NotificationsPage() {
  const router = useRouter();
  const { accessToken } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // 'all' ou 'mentions'
  const t = useTranslations("Notifications");
  const locale = useLocale();

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchNotifications(accessToken);
        setNotifications(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [accessToken]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  const displayed = notifications.filter((n) =>
    filter === "all" ? true : n.action.toLowerCase().includes("mention")
  );

  // Helper to get relative time
  function getRelativeTime(date) {
    const now = new Date();
    const diff = Math.floor((now - new Date(date)) / 1000);

    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} h`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)} j`;
    return new Date(date).toLocaleDateString(locale);
  }

  return (
    <div className="flex h-screen flex-col bg-base-200">
      {/* Header */}
      <header className="flex items-center border-b bg-base-100 px-4 py-3">
        <button
          onClick={() => router.push("/home")}
          className="btn btn-text btn-square mr-3"
          aria-label="Retour"
        >
          <span className="icon-[tabler--arrow-left] size-6" />
        </button>
        <h1 className="text-lg font-semibold">Notifications</h1>
      </header>

      {/* Filtres */}
      <div className="bg-base-100 border-b">
        <div className="max-w-md mx-auto flex">
          <button
            onClick={() => setFilter("all")}
            className={`flex-1 py-2 text-center font-medium ${
              filter === "all"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Tous
          </button>
          <button
            onClick={() => setFilter("mentions")}
            className={`flex-1 py-2 text-center font-medium ${
              filter === "mentions"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Mentions
          </button>
        </div>
      </div>

      {/* Liste */}
      <main className="flex-1 overflow-auto px-4 py-4 space-y-2 bg-base-200">
        <ul>
          {displayed.length === 0 ? (
            <p className="text-center text-gray-600">
              {filter === "all"
                ? "Vous n'avez aucune notification."
                : "Aucune mention."}
            </p>
          ) : (
            displayed.map((n) => (
              <li key={n._id} className="p-3 card mb-2 bg-base-100">
                <div className="flex items-center justify-between ">
                  <div>
                    <p className="font-semibold">{n.action}</p>
                    <p className="text-sm">{n.content}</p>
                  </div>
                  <span className="text-xs text-base-content/50">
                    {getRelativeTime(n.createdAt)}
                  </span>
                </div>
                {n.link && (
                  <Link href={n.link} className="text-accent mt-2 block">
                    Voir plus
                  </Link>
                )}
              </li>
            ))
          )}
        </ul>
      </main>
    </div>
  );
}
