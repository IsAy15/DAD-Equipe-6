import { useEffect, useState } from "react";
import Image from "next/image";
import { MessageCircle, Heart, Pencil, Check, X, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/authcontext";
import { fetchUserProfile, getCommentRepliesCount, addReplyToComment } from "@/utils/api"
import Link from "next/link";

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
  postId,
  comment,
  editingCommentId,
  setEditingCommentId,
  onUpdateComment,
  onDeleteComment,
  onAddReply,
}) {
  const { identifier, accessToken } = useAuth();
  const [username, setUsername] = useState(null);
  const [usernameLoading, setUsernameLoading] = useState(true);

  const [avatarUrl, setAvatarUrl] = useState(null);
  const [avatarLoading, setAvatarLoading] = useState(true);
  const [avatarFallback, setAvatarFallback] = useState(null);
  
  const isEditing = editingCommentId === comment._id;
  const [editedContent, setEditedContent] = useState(comment.content);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  const [repliesCount, setRepliesCount] = useState(null);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  
 useEffect(() => {
    if (isEditing) {
      setEditedContent(comment.content);
    }
  }, [isEditing, comment.content]);

  useEffect(() => {
    if (comment._id && postId) {
      const FetchCommentRepliesCount = async () => {
        const result = await getCommentRepliesCount(postId, comment._id, accessToken);

        if(result.status == 200){
          const repliesCount = result.data.repliesCount;
          setRepliesCount(repliesCount)
        }
      } 
      FetchCommentRepliesCount();
    }
  }, [comment, postId, accessToken]);

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

  const handleCommentReply = async () => {
    if (!replyContent.trim()) return;

    try {
      const response = await addReplyToComment(postId, comment._id, replyContent, username, accessToken);
      
      if (response.status !== 201) {
        throw new Error(`Échec de l'envoi de la réponse. Statut: ${response.status}`);
      }

      const reply = response.data;
      onAddReply(comment._id, reply);

      setReplyContent("");
      setShowReplyBox(false);
    } catch (error) {
      // Tu peux afficher un message d’erreur ici si besoin
    }
  };

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
    <>
  <div className="relative flex flex-col gap-2 p-2">
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

    <div className="flex items-center gap-3">
      {/* Avatar */}
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

      {/* Username + date */}
      <div className="text-sm font-semibold flex items-center gap-1">
        {usernameLoading ? (
          <div className="w-24 h-4 bg-gray-300 rounded animate-pulse" />
        ) : (
          <div className="flex flex-col">
            <div>
              {username}
              <span className="text-xs text-base-content font-normal">
                · {new Date(comment.createdAt).toDateString()}
              </span>
            </div>
            {comment.isReply && (
           <span className="text-primary italic text-xs">
              Réponse à{" "}
              <Link
                href={`/profile/${comment.replyUsername}`}
                className="hover:underline text-blue-600"
              >
                @{comment.replyUsername}
              </Link>
            </span>
          )}
          </div>
        )}
      </div>
    </div>

    <div className="group ml-5 border-l-2 border-gray-300 pl-3 flex flex-col gap-1 text-sm pt-2.5 -mt-2">
      <div className="pl-4 -mt-4">
        <div className="whitespace-pre-wrap">
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
            comment.content.split(" ").map((word, i) =>
              word.startsWith("#") ? (
                <span key={i} className="text-accent">
                  {word}{" "}
                </span>
              ) : (
                word + " "
              )
            )
          )}
        </div>
        <div className="flex gap-4 text-base-content mt-1 text-sm">
          <button
            className="flex items-center gap-1 hover:text-accent transition"
            aria-label="Afficher les réponses"
          >
            <MessageCircle size={14} />
            {repliesCount}
          </button>

          <div className="flex items-center gap-1">
            <Heart size={14} /> {comment.likes.length}
          </div>
          <button
            onClick={() => setShowReplyBox((prev) => !prev)}
            className="text-sm text-primary hover:underline opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            Répondre
          </button>
        </div>

        {showReplyBox && (
          <div className="mt-2">
            <textarea
              className="w-full border rounded p-2 text-sm resize-y"
              rows={3}
              placeholder="Votre réponse..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
            />
            <div className="flex gap-2 mt-1">
              <button
                onClick={handleCommentReply}
                className="text-primary hover:text-accent"
              >
                Envoyer
              </button>
              <button
                onClick={() => {
                  setReplyContent("");
                  setShowReplyBox(false);
                }}
                className="text-secondary hover:text-error"
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
</>

  );
}
