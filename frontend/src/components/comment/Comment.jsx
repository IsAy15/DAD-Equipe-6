import { useEffect, useState } from "react";
import Image from "next/image";
import { MessageCircle, Heart, Pencil, Check, X, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/authcontext";
import { fetchUserProfile } from "@/utils/api"

const fetchWithTimeout = (url, timeout = 3000) =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), timeout);
    fetch(url)
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });

export default function Comment({
  comment,
  editingCommentId,
  setEditingCommentId,
  onUpdateComment,
  onDeleteComment,
}) {
  const { identifier } = useAuth();
  const [username, setUsername] = useState(null);
  const [usernameLoading, setUsernameLoading] = useState(true);

  const [avatarUrl, setAvatarUrl] = useState(null);
  const [avatarLoading, setAvatarLoading] = useState(true);
  const [avatarFallback, setAvatarFallback] = useState(null);

  const isEditing = editingCommentId === comment._id;
  const [editedContent, setEditedContent] = useState(comment.content);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);


  useEffect(() => {
    if (isEditing) {
      setEditedContent(comment.content);
    }
  }, [isEditing, comment.content]);

  useEffect(() => {
    if (!comment?.author) return;

    setAvatarLoading(true);
    fetchWithTimeout(`/api/avatar?author=${comment.author}`, 3000)
      .then((res) => res.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        setAvatarUrl(url);
      })
      .catch(() => {
        setAvatarFallback(comment.author[0]?.toUpperCase() || "?");
      })
      .finally(() => setAvatarLoading(false));
  }, [comment.author]);

   useEffect(() => {
    if (!comment?.author) return;

    setUsernameLoading(true);
    fetchUserProfile(comment.author)
      .then((data) => {
        if (data?.username) {
          setUsername(data.username);
        } else {
          setUsername(comment.author); // fallback
        }
      })
      .catch(() => {
        setUsername(comment.author); // fallback en cas d'erreur
      })
      .finally(() => {
        setUsernameLoading(false);
      });
  }, [comment.author]);

  const handleSave = async () => {
    if (editedContent.trim() === "") return;
    setSaving(true);
    try {
      await onUpdateComment(comment._id, editedContent);
      setEditingCommentId(null);
    } catch (error) {
      console.error("Erreur lors de la mise à jour", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingCommentId(null);
    setEditedContent(comment.content);
  };

  const handleDelete = async () => {
    if (!confirm("Voulez-vous vraiment supprimer ce commentaire ?")) return;
    setDeleting(true);
    try {
      await onDeleteComment(comment._id);
      if (editingCommentId === comment._id) {
        setEditingCommentId(null);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression", error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="relative flex gap-3 p-2 items-start">
      {comment.author === identifier && !isEditing && (
        <>
          <button
            onClick={() => setEditingCommentId(comment._id)}
            className="absolute top-2 right-8 text-base-content hover:text-accent"
            aria-label="Edit comment"
            disabled={deleting}
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={handleDelete}
            className="absolute top-2 right-2 text-base-content hover:text-error"
            aria-label="Delete comment"
            disabled={deleting}
          >
            <Trash2 size={16} />
          </button>
        </>
      )}

      <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-gray-200 text-gray-600 font-bold text-sm shrink-0">
        {avatarLoading ? (
          <div className="w-6 h-6 rounded-full bg-base-content animate-pulse" />
        ) : avatarUrl ? (
          <Image
            src={avatarUrl}
            alt="Avatar"
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
        ) : (
          avatarFallback
        )}
      </div>

      <div className="flex flex-col flex-grow">
        <div className="text-sm font-semibold flex items-center gap-1">
          {usernameLoading ? (
            <div className="w-24 h-4 bg-gray-300 rounded animate-pulse" />
          ) : (
            <>
              {username}
              <span className="text-xs text-base-content font-normal">
                · {new Date(comment.createdAt).toDateString()}
              </span>
            </>
          )}
        </div>

        {isEditing ? (
          <>
            <textarea
              className="w-full border border-base-content rounded p-2 text-sm resize-y"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              rows={3}
              disabled={saving || deleting}
            />
            <div className="mt-1 flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving || editedContent.trim() === "" || deleting}
                className="text-primary hover:text-accent flex items-center gap-1"
                aria-label="Save comment"
              >
                <Check size={16} /> Sauvegarder
              </button>
              <button
                onClick={handleCancel}
                disabled={saving || deleting}
                className="text-secondary hover:text-error flex items-center gap-1"
                aria-label="Cancel editing"
              >
                <X size={16} /> Annuler
              </button>
            </div>
          </>
        ) : (
          <div className="text-sm whitespace-pre-wrap">
            {comment.content.split(" ").map((word, i) =>
              word.startsWith("#") ? (
                <span key={i} className="text-accent">
                  {word}{" "}
                </span>
              ) : (
                word + " "
              )
            )}
          </div>
        )}

        <div className="flex gap-4 text-base-content mt-1 text-sm">
          <div className="flex items-center gap-1">
            <MessageCircle size={14} /> 1
          </div>
          <div className="flex items-center gap-1">
            <Heart size={14} /> {comment.likes.length}
          </div>
        </div>
      </div>
    </div>
  );
}
