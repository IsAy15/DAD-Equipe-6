"use client";

import { useState, useEffect } from "react";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);

  // Focus sur l'input au raccourci ⌘+K ou Ctrl+K
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        document.getElementById("searchInput")?.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const onChange = (e) => {
    setQuery(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    // Ajouter à l'historique (en tête)
    setRecentSearches((prev) => [query, ...prev.filter((q) => q !== query)]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      {/* Barre de recherche */}
      <div className="p-4 bg-white shadow">
        <form
          className="input input-lg flex max-w-md mx-auto space-x-4"
          onSubmit={onSubmit}
        >
          {/* Icône loupe */}
          <span className="icon-[tabler--search] text-base-content/80 my-auto size-6 shrink-0"></span>

          <input
            id="searchInput"
            type="search"
            className="grow outline-none text-base-content placeholder:text-base-content/40"
            placeholder="Search"
            value={query}
            onChange={onChange}
          />
          <label className="sr-only" htmlFor="searchInput">
            Search
          </label>

          <span className="my-auto flex gap-2 text-base-content/60">
            <kbd className="kbd kbd-sm">⌘</kbd>
            <kbd className="kbd kbd-sm">K</kbd>
          </span>
        </form>
      </div>

      {/* Contenu principal */}
      <main className="flex-1 overflow-auto p-4">
        {query.trim() === "" ? (
          <>
            <h2 className="font-semibold text-gray-600 mb-2">
              Recent searches
            </h2>
            <div className="flex flex-wrap gap-4">
              {recentSearches.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center text-sm w-20"
                >
                  <div className="w-10 h-10 bg-gray-200 rounded-full mb-1" />
                  <span className="truncate">{item}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-gray-700">
            Résultats pour <strong>"{query}"</strong> …
          </div>
        )}
      </main>

      {/* Nav bas */}
      <nav className="h-14 bg-white border-t flex justify-around items-center">
        <button className="icon-[tabler--home] size-6 text-gray-400"></button>
        <button className="icon-[tabler--search] size-6 text-blue-500"></button>
        <button className="icon-[tabler--bell] size-6 text-gray-400"></button>
        <button className="icon-[tabler--message] size-6 text-gray-400"></button>
      </nav>
    </div>
  );
}
