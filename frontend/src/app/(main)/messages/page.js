"use client";

import { useState } from "react";

const mockConversations = [
  {
    id: 1,
    user: "Alice Dupont",
    lastMessage: "Salut, tu as vu le dernier article ?",
    time: "1h",
    unread: true,
  },
  {
    id: 2,
    user: "Bob Martin",
    lastMessage: "Merci pour le feedback 🙂",
    time: "3h",
    unread: false,
  },
  {
    id: 3,
    user: "Charlie",
    lastMessage: "On se retrouve demain à 10h ?",
    time: "1j",
    unread: true,
  },
  {
    id: 4,
    user: "Dev Team",
    lastMessage: "Déploiement terminé 🚀",
    time: "2j",
    unread: false,
  },
];

export default function MessagesPage() {
  const [conversations] = useState(mockConversations);

  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      {/* Header */}
      <div className="p-4 bg-white shadow flex items-center">
        <h1 className="text-xl font-bold flex-1">Messages</h1>
        <button aria-label="Nouveau message">
          <span className="icon-[tabler--edit] size-6 text-gray-500"></span>
        </button>
      </div>

      {/* Liste des conversations */}
      <main className="flex-1 overflow-auto">
        <ul className="divide-y divide-gray-200">
          {conversations.map((conv) => (
            <li
              key={conv.id}
              className={`p-4 flex items-center bg-white hover:bg-gray-50 ${
                conv.unread ? "font-semibold" : "font-normal"
              }`}
            >
              <div className="w-12 h-12 bg-gray-200 rounded-full shrink-0" />
              <div className="ml-4 flex-1">
                <p className="text-sm">{conv.user}</p>
                <p className="mt-1 text-sm text-gray-600 truncate">
                  {conv.lastMessage}
                </p>
              </div>
              <div className="text-xs text-gray-500 ml-4 self-start">
                {conv.time}
              </div>
              {conv.unread && (
                <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full" />
              )}
            </li>
          ))}
        </ul>
      </main>

      {/* Navigation basse */}
      <nav className="h-14 bg-white border-t flex justify-around items-center">
        <button className="icon-[tabler--home] size-6 text-gray-400"></button>
        <button className="icon-[tabler--search] size-6 text-gray-400"></button>
        <button className="icon-[tabler--bell] size-6 text-gray-400"></button>
        <button className="icon-[tabler--message] size-6 text-blue-500"></button>
      </nav>
    </div>
  );
}
