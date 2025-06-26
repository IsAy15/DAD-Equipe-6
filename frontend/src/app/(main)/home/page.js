"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/authcontext";
import { fetchUserFeed } from "@/utils/api";
import Feed from "@/components/Feed";
import { useTranslations } from "next-intl";

export default function HomePage() {
  const { accessToken } = useAuth();
  const t = useTranslations("homepage");
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [selectedTab, setSelectedTab] = useState("forYou"); // 'home' ou 'profile'

  useEffect(() => {
    async function loadPosts() {
      setLoadingPosts(true);
      try {
        const userPosts = await fetchUserFeed(accessToken);
        setPosts(userPosts || []);
      } catch {
        setPosts([]);
      }
      setLoadingPosts(false);
    }
    loadPosts();
  }, [accessToken]);

  return (
    <main className="p-6">
      {/* Onglets */}
      <nav className="tabs tabs-bordered mb-4" role="tablist">
        <button
          role="tab"
          aria-selected={selectedTab === "forYou"}
          className={`tab w-full ${
            selectedTab === "forYou" ? "tab-active" : ""
          }`}
          onClick={() => setSelectedTab("forYou")}
        >
          {t("forYou")}
        </button>
        <button
          role="tab"
          aria-selected={selectedTab === "follow"}
          className={`tab w-full ${
            selectedTab === "follow" ? "tab-active" : ""
          }`}
          onClick={() => setSelectedTab("follow")}
        >
          {t("follow")}
        </button>
      </nav>

      {/* Contenu de l’onglet Home */}
      {selectedTab === "forYou" && (
        <section role="tabpanel" className="space-y-4"></section>
      )}

      {/* Contenu de l’onglet Profile */}
      {selectedTab === "follow" && (
        <section role="tabpanel" className="space-y-4">
          <Feed posts={posts} loadingPosts={loadingPosts} />
        </section>
      )}
    </main>
  );
}
