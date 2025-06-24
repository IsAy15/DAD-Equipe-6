import React, { useEffect, useState } from 'react';
import { addCommentToPost } from '@/utils/api';
import { useAuth } from "@/contexts/authcontext";


export default function CommentInput({ post_id, onAddComment }) {
  const { accessToken } = useAuth();
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSending(true);
    setError(null);

    try {
      const response = await addCommentToPost('685998752925fb31103216de', content, accessToken);

      if (response.status === 201 || response.status === 200) {
        const newComment = response.data;
        onAddComment?.(newComment);
        setContent('');
      } else {
        setError("Échec de l'ajout du commentaire.");
      }
    } catch (err) {
      console.error("Erreur lors de l'envoi du commentaire :", err);
      setError("Une erreur est survenue.");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row gap-2 w-full items-center"
      >
        <input
          type="text"
          placeholder="Poster votre réponse"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={sending}
          className="w-full md:flex-grow p-2 border text-neutral rounded text-base disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={!content.trim() || sending}
          className={`
            w-full md:w-auto px-4 py-2 rounded 
            font-bold 
            bg-primary text-base-content
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors duration-200
            ${content.trim() && !sending ? 'cursor-pointer hover:bg-primary-focus' : ''}
          `}
        >
          {sending ? 'Envoi...' : 'Répondre'}
        </button>
      </form>
      {error && (
        <div className="text-error text-sm mt-1 w-full">
          {error}
        </div>
      )}
    </>
  );
}
