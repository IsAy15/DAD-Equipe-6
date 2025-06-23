"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { postBreeze, fetchUserProfile } from "@/utils/api";
import UserAvatar from "@/components/UserAvatar";
import { useAuth } from "@/contexts/authcontext";

export default function CreateBreathPage() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  const { identifier } = useAuth();
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await fetchUserProfile(identifier);
        setUserProfile(profile);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    }
    loadProfile();
  }, [identifier]);

  // Annuler et revenir en arrière
  const handleCancel = () => router.back();

  // Soumettre le “breath”
  const handleSubmit = () => {
    // TODO : appeler ton endpoint pour créer le “breath”
    console.log({ text, selectedImage });
    postBreeze(text, selectedImage)
      .then(() => {
        // Rediriger vers la page d’accueil ou une autre page après succès
        router.push("/home");
      })
      .catch((error) => {
        console.error("Error posting breath:", error);
        // Gérer l’erreur (afficher un message, etc.)
      });
  };

  // Ouvrir le picker d’image
  const handleImageClick = () => fileInputRef.current?.click();

  // Charger l’image sélectionnée
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setSelectedImage(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col bg-base-100">
      {/* Navigation bar */}
      <header className="flex items-center justify-between px-4 py-2">
        <button
          onClick={handleCancel}
          className="btn btn-outline btn-primary btn-sm font-semibold"
        >
          Cancel
        </button>

        <button
          onClick={handleSubmit}
          className="btn btn-primary btn-sm font-semibold"
        >
          Breath
          <span className="icon-[tabler--wind] size-6" />
        </button>
      </header>

      {/* Zone de saisie */}
      <main className="p-4">
        <div className="flex items-start space-x-3">
          {/* Avatar */}
          <UserAvatar user={userProfile} link={false} size="sm" />

          {/* Champ texte */}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What makes you breath today ?"
            rows={4}
            className="resize-none placeholder-base-content/80 text-base-content outline-none flex-1"
          />
        </div>
      </main>

      {/* Barre d’actions en bas */}
      <footer className="flex items-center justify-between px-4 py-2 border-t bg-base-100">
        {/* Optionnel : ajouter une image */}
        <div className="flex items-center space-x-2 text-base-content">
          <button onClick={handleImageClick} aria-label="Ajouter une image">
            {/* Icône “image” */}
            <span className="icon-[tabler--photo] size-6" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
      </footer>
    </div>
  );
}
