"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import UserAvatar from "@/components/UserAvatar";
import { fetchUserMessages, fetchMessageById, sendMessage } from "@/utils/api";
import { useAuth } from "@/contexts/authcontext";
import { FiSend } from "react-icons/fi";

export default function ConversationPage() {
  const { userId: conversationId } = useParams();
  const router = useRouter();
  const { user, accessToken } = useAuth();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!accessToken || !conversationId) return;

    (async () => {
      try {
        // 1) on récupère le tableau
        const inbox = await fetchUserMessages(accessToken);
        console.log("inbox raw:", inbox);

        // 2) on cherche la conversation par `user`
        const conv = inbox.find((c) => c.user === conversationId);
        console.log("conv:", conv);

        if (!conv) {
          setMessages([]);
          return;
        }

        // 3a) si le backend renvoie juste un aperçu lastMessage
        if (conv.lastMessage) {
          const m = conv.lastMessage;
          setMessages([
            {
              id: m._id || m.id,
              sender: m.sender,
              content: m.content,
              timestamp: new Date(m.createdAt || m.timestamp),
            },
          ]);
        }
        // 3b) sinon s’il y a un tableau conv.messages
        else if (Array.isArray(conv.messages)) {
          const full = await Promise.all(
            conv.messages.map((mid) => fetchMessageById(mid, accessToken))
          );
          const sorted = full
            .map((m) => ({
              id: m._id || m.id,
              sender: m.sender,
              content: m.content,
              timestamp: new Date(m.createdAt || m.timestamp),
            }))
            .sort((a, b) => a.timestamp - b.timestamp);
          setMessages(sorted);
        }
      } catch (err) {
        console.error("Failed to load conversation:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [accessToken, conversationId]);

  // scroll en bas à chaque changement
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    const text = newMessage.trim();
    if (!text) return;
    try {
      // on récupère { message, messageId }
      const { messageId } = await sendMessage(
        conversationId,
        text,
        accessToken
      );
      // on ajoute la bulle optimiste
      setMessages((prev) => [
        ...prev,
        {
          id: messageId,
          sender: user.id,
          content: text,
          timestamp: new Date(),
        },
      ]);
      setNewMessage("");
    } catch (err) {
      console.error("Envoi échoué :", err);
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-base-200">
      {/* Header */}
      <header className="flex items-center border-b bg-base-100 px-4 py-3">
        <button
          onClick={() => router.back()}
          className="btn btn-text btn-square mr-3"
        >
          <span className="icon-[tabler--arrow-left] size-6" />
        </button>
        <h2 className="text-lg font-semibold">Conversation</h2>
      </header>

      {/* Bulles de chat */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isMe = msg.sender === user.id;
          return (
            <div
              key={msg.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              {!isMe && (
                <UserAvatar
                  user={msg.sender}
                  size="sm"
                  className="mr-2 self-end"
                />
              )}
              <div
                className={[
                  "max-w-[70%] px-4 py-2 rounded-2xl shadow-sm",
                  isMe
                    ? "bg-primary text-primary-content rounded-br-none"
                    : "bg-base-100 text-base-content rounded-bl-none",
                ].join(" ")}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
                <div className="mt-1 text-right text-xs text-gray-400">
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Barre de saisie */}
      <div className="flex items-center border-t bg-base-100 px-4 py-2 gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message…"
          className="flex-1 rounded-full border px-4 py-2 focus:border-accent focus:outline-none"
        />
        <button
          onClick={handleSend}
          className="btn btn-square bg-primary p-2 text-base-content border-none"
        >
          <span className="icon-[tabler--send] size-5" />
        </button>
      </div>
    </div>
  );
}
