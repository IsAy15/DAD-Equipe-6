"use client";
import Feed from "@/components/Feed";
import { useAuth } from "@/contexts/authcontext";
import { fetchUserFeed } from "@/utils/api";
import { useEffect, useState } from "react";

export default function Index() {
  const { accessToken } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      setLoadingPosts(true);
      try {
        const userPosts = await fetchUserFeed(accessToken);
        setPosts(userPosts || []);
      } catch (err) {
        setPosts([]);
      }
      setLoadingPosts(false);
    }
    loadPosts();
  }, [accessToken]);

  return (
    <main className="p-6">
      <Feed posts={posts} loadingPosts={loadingPosts} />
    </main>
  );
}
