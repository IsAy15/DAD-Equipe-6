"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";
import clsx from "clsx";
import AppearanceSettings from "./AppearanceSettings";

const ASIDE_WIDTH = 256; // px

export default function NavBar() {
  const t = useTranslations("Navbar");
  const [asideOpen, setAsideOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);
  const [dragX, setDragX] = useState(null);
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Détection mobile (évite le SSR)
  useEffect(() => {
    function checkMobile() {
      setIsMobile(window.innerWidth < 640);
    }
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fermer l'aside (avec délai pour l'animation overlay)
  const handleAsideClose = () => {
    setTimeout(() => setAsideOpen(false), 300);
  };

  // Gestion du swipe pour ouvrir/fermer l'aside sur mobile
  useEffect(() => {
    if (!isMobile) return;
    function handleTouchStart(e) {
      setTouchStartX(e.touches[0].clientX);
      setDragX(0);
    }
    function handleTouchMove(e) {
      if (touchStartX !== null) {
        const currentX = e.touches[0].clientX;
        let delta = currentX - touchStartX;
        if (!asideOpen) delta = Math.max(0, Math.min(delta, ASIDE_WIDTH));
        if (asideOpen) delta = Math.min(0, Math.max(delta, -ASIDE_WIDTH));
        setDragX(delta);
        setTouchEndX(currentX);
      }
    }
    function handleTouchEnd() {
      if (touchStartX !== null && touchEndX !== null) {
        const deltaX = touchEndX - touchStartX;
        if (!asideOpen && deltaX > 60) setAsideOpen(true);
        else if (asideOpen && deltaX < -60) setAsideOpen(false);
      }
      setTouchStartX(null);
      setTouchEndX(null);
      setDragX(null);
    }
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [asideOpen, touchStartX, touchEndX, isMobile]);

  // Style dynamique pour l'aside (mobile uniquement)
  const asideStyle = isMobile
    ? {
        zIndex: 60,
        transition: dragX === null ? "transform 0.3s" : "none",
        transform:
          dragX !== null
            ? `translateX(${asideOpen ? dragX : -ASIDE_WIDTH + dragX}px)`
            : asideOpen
            ? "translateX(0)"
            : `translateX(-${ASIDE_WIDTH}px)`,
      }
    : { zIndex: 60 };

  // Overlay dynamique
  let openProgress = 0;
  if (dragX !== null) {
    openProgress = asideOpen ? 1 + dragX / ASIDE_WIDTH : dragX / ASIDE_WIDTH;
    openProgress = Math.max(0, Math.min(openProgress, 1));
  } else {
    openProgress = asideOpen ? 1 : 0;
  }
  const overlayOpacity = 0.4 * openProgress;

  // Navbar mobile hide/show on scroll
  useEffect(() => {
    if (!isMobile) return;
    let ticking = false;
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          setShowNav(currentY < lastScrollY || currentY < 10);
          setLastScrollY(currentY);
          ticking = false;
        });
        ticking = true;
      }
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastScrollY, isMobile]);

  return (
    <>
      {/* Aside latérale */}
      <aside
        className={clsx(
          "fixed top-0 left-0 h-full w-64 bg-base-100 shadow-lg z-60",
          "transition-transform duration-300",
          "sm:translate-x-0"
        )}
        style={asideStyle}
      >
        <div className="flex flex-col h-full">
          {/* User */}
          <div className="flex items-center justify-between p-4 border-b">
            {/* <img src="/logo.svg" /> */}
          </div>
          {/* Menu */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="menu menu-horizontal gap-2 p-0 text-base rtl:ml-20">
              <li className="w-full">
                <Link href="/home" className="btn btn-text justify-start">
                  <span className="icon-[tabler--home] size-6"></span>
                  <span>{t("home")}</span>
                </Link>
              </li>
              <li className="w-full">
                <Link href="#" className="btn btn-text justify-start">
                  <span className="icon-[tabler--user] size-6"></span>
                  <span>{t("profile")}</span>
                </Link>
              </li>
            </ul>
          </nav>
          {/* Sélecteurs thème/langue */}
          <div className="flex justify-center p-4 border-t">
            <AppearanceSettings />
          </div>
        </div>
      </aside>

      {/* Navbar mobile */}
      <nav
        className={clsx(
          "navbar shadow sm:hidden fixed top-0 left-0 right-0 z-50 bg-base-100 transition-transform duration-300",
          showNav ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <div className="flex w-full items-center justify-between">
          <button
            className="btn btn-square btn-ghost"
            onClick={() => setAsideOpen(true)}
            aria-label="Ouvrir le menu"
          >
            {/* <img src="" /> */}
          </button>
          <Link className="ml-2 text-xl font-semibold no-underline" href="/">
            {t("title")}
          </Link>
        </div>
        {/* Tu peux ajouter ici les sélecteurs thème/langue si tu veux accès rapide sur mobile */}
      </nav>

      {/* Overlay pour fermer l'aside sur mobile */}
      {(asideOpen || dragX !== null) && (
        <div
          className="fixed inset-0 bg-black z-30 sm:hidden"
          style={{
            opacity: overlayOpacity,
            transition: dragX === null ? "opacity 0.3s" : "none",
          }}
          onClick={handleAsideClose}
          aria-label="Fermer le menu"
        />
      )}
    </>
  );
}
