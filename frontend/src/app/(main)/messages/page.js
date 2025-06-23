"use client";

import UserAvatar from "@/components/UserAvatar";
import { fetchUserProfile, fetchUserMessages } from "@/utils/api";
import { useAuth } from "@/contexts/authcontext";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

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
  const [conversations, setConversations] = useState(mockConversations);
  const { user, accessToken } = useAuth();
  const t = useTranslations("Messages");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMessages() {
      try {
        const apiResult = await fetchUserMessages(accessToken);
        // On suppose que tu as une fonction pour récupérer le profil et le message
        const formattedConversations = await Promise.all(
          apiResult.inbox.map(async (conv) => {
            // Récupère le profil de l'expéditeur
            const senderProfile = await fetchUserProfile(conv.sender);
            // Récupère le contenu du dernier message
            // Ici, on prend le dernier message de la liste
            const lastMessageId = conv.messages[conv.messages.length - 1];
            // À adapter selon ton API pour récupérer le contenu du message
            const lastMessageObj = await fetchMessageById(
              lastMessageId,
              accessToken
            );
            return {
              id: conv.sender,
              user: senderProfile.name || senderProfile.username || conv.sender,
              lastMessage: lastMessageObj.content || "",
              time: lastMessageObj.time || "",
              unread: !lastMessageObj.read, // À adapter selon ta structure
            };
          })
        );
        setConversations(formattedConversations);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setLoading(false);
      }
    }
    loadMessages();
  }, [accessToken]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!conversations || conversations.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-base-content/80">{t("noMessages")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      {/* Header */}
      <div className="p-4 bg-base-100 shadow flex items-center">
        <h1 className="text-xl font-bold flex-1">Messages</h1>
        <button aria-label="Nouveau message">
          <span className="icon-[tabler--edit] size-6 text-base-content"></span>
        </button>
      </div>

      {/* Liste des conversations */}
      <main className="flex-1 overflow-auto">
        <ul className="divide-y divide-base-content/30">
          {conversations.map((conv) => (
            <li
              key={conv.id}
              className={`p-4 flex items-center bg-base-100 hover:bg-primary ${
                conv.unread ? "font-semibold" : "font-normal"
              }`}
            >
              {/* <div className="w-12 h-12 bg-base-200 rounded-full shrink-0" /> */}
              <UserAvatar user={conv.id} link={false} size="gs" />
              <div className="ml-4 flex-1">
                <p className="text-sm">{conv.user}</p>
                <p className="mt-1 text-sm text-base-600 truncate">
                  {conv.lastMessage}
                </p>
              </div>
              <div className="text-xs text-base-500 ml-4 self-start">
                {conv.time}
              </div>
              {conv.unread && (
                <span className="ml-2 w-2 h-2 bg-accent rounded-full" />
              )}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
