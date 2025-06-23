"use client";

import { useState } from "react";

const mockNotifications = [
  {
    id: 1,
    user: "Alice Dupont",
    action: "a aimé votre tweet",
    content: "“Je viens de découvrir ce super tuto !”",
    time: "2h",
  },
  {
    id: 2,
    user: "Bob Martin",
    action: "a commencé à vous suivre",
    content: "",
    time: "4h",
  },
  {
    id: 3,
    user: "Charlie",
    action: "a retweeté",
    content: "“Les callbacks en JS, c'est la vie 🌟”",
    time: "1j",
  },
  {
    id: 4,
    user: "Dev Team",
    action: "a mentionné",
    content: "@vous sur leur dernier post",
    time: "3j",
  },
];

export default function NotificationsPage() {
  const [notifications] = useState(mockNotifications);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 bg-white shadow flex items-center">
        <h1 className="text-xl font-bold flex-1">Notifications</h1>
        <button aria-label="Marquer tout comme lu">
          <span className="icon-[tabler--check] size-6 text-gray-500"></span>
        </button>
      </header>

      {/* Filtres */}
      <div className="bg-white border-b">
        <div className="max-w-md mx-auto flex">
          <button className="flex-1 py-2 text-center font-medium text-blue-500 border-b-2 border-blue-500">
            Tous
          </button>
          <button className="flex-1 py-2 text-center font-medium text-gray-600 hover:bg-gray-50">
            Mentions
          </button>
        </div>
      </div>

      {/* Liste */}
      <main className="flex-1 overflow-auto">
        <ul className="divide-y divide-gray-200">
          {notifications.map((n) => (
            <li key={n.id} className="p-4 flex bg-white hover:bg-gray-50">
              <div className="w-12 h-12 bg-gray-200 rounded-full" />
              <div className="ml-4 flex-1">
                <p className="text-sm">
                  <span className="font-semibold">{n.user}</span>{" "}
                  <span className="text-gray-700">{n.action}</span>
                </p>
                {n.content && (
                  <p className="mt-1 text-sm text-gray-600 truncate">
                    {n.content}
                  </p>
                )}
              </div>
              <div className="text-xs text-gray-500 ml-4 self-start">
                {n.time}
              </div>
            </li>
          ))}
        </ul>
      </main>

      {/* Nav bottom */}
      <nav className="h-14 bg-white border-t flex justify-around items-center">
        <button className="icon-[tabler--home] size-6 text-gray-400" />
        <button className="icon-[tabler--search] size-6 text-gray-400" />
        <button className="icon-[tabler--bell] size-6 text-blue-500" />
        <button className="icon-[tabler--message] size-6 text-gray-400" />
      </nav>
    </div>
  );
}
