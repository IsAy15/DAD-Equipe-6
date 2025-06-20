"use client";
import NavBar from "../../components/NavBar";
import { useAuth } from "@/contexts/authcontext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function MainLayout({ children }) {
  const { accessToken } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!accessToken) {
      router.replace(`/?from=${encodeURIComponent(pathname)}`);
    }
  }, [accessToken, router, pathname]);

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
