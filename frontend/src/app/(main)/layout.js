"use client";
import NavBar from "../../components/NavBar";
import { useAuth } from "@/contexts/authcontext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MainLayout({ children }) {
  const { accessToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!accessToken) {
      router.replace("/"); // Redirige vers la page de login si non connecté
    }
  }, [accessToken, router]);

  if (!accessToken) return null; // Optionnel : évite le flash de contenu

  return (
    <div>
      <NavBar />
      <div className="flex justify-center pt-16 sm:pt-6">
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
