"use client";
import { useEffect, useRef, useCallback } from "react";

export default function Index() {
  const loader = useRef(null);

  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting) {
      // Ici, vous pouvez charger plus de contenu si besoin
      // Pour l'instant, la page reste vide avec scroll infini
    }
  }, []);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    <main style={{ minHeight: "1000vh" }}>
      {/* Contenu vide */}
      <div ref={loader} />
    </main>
  );
}
