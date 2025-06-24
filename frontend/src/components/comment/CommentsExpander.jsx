import { useEffect, useState } from "react";
import Comment from "./Comment";
import { useAuth } from "@/contexts/authcontext";
import { fetchPostComments, updateComment, deleteComment } from "@/utils/api";
import CommentInput from "@/components/comment/CommentInput";

export default function CommentExpander({ postId }) {
  const { accessToken } = useAuth();
  const [comments, setComments] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(5);

  // État global du commentaire en édition
  const [editingCommentId, setEditingCommentId] = useState(null);

  const loadingContent = (
    <div className="flex gap-3 p-2 animate-pulse items-start">
      <div className="skeleton h-10 w-10 rounded-full bg-gray-300" />
      <div className="flex flex-col gap-2">
        <div className="skeleton h-3 w-24 rounded bg-gray-300" />
        <div className="skeleton h-3 w-64 rounded bg-gray-300" />
        <div className="skeleton h-3 w-48 rounded bg-gray-300" />
        <div className="flex gap-2 mt-1">
          <div className="skeleton h-4 w-4 rounded bg-gray-300" />
          <div className="skeleton h-4 w-4 rounded bg-gray-300" />
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    async function FetchPostComments() {
      try {
        if (!postId) {
          const comments = await fetchPostComments('685998752925fb31103216de', accessToken);
          setComments(comments);
        }
      } catch (error) {
        console.error("Failed to fetch comments for post", error);
      } finally {
        setLoading(false);
      }
    }

    FetchPostComments();
  }, [postId, accessToken]);

  const handleAddReply = (comment_id, reply) => {
    setComments((prevComments) =>
      prevComments.map(comment => {
        if (comment._id === comment_id) {
          return {
            ...comment,
            repliesCount: (comment.repliesCount || 0) + 1
          };
        }
        return comment;
      }).concat(reply) 
    );
  };

  const handleAddComment = (newComment) => {
    setComments((prev) => [newComment, ...(prev || [])]);
    setVisibleCount((prev) => prev + 1); // Affiche aussi le nouveau si on est à la limite
  };

  // Fonction pour mettre à jour un commentaire après édition
  const handleUpdateComment = async (commentId, newContent) => {
    setComments((prev) =>
      prev.map((c) => (c._id === commentId ? { ...c, content: newContent } : c))
    );
    await updateComment('685998752925fb31103216de', commentId, newContent, accessToken);
    setEditingCommentId(null);
  };

  // Nouvelle fonction pour supprimer un commentaire
  const handleDeleteComment = async (commentId) => {
    // Optionnel : confirmation ici ou dans le composant Comment
    try {
      await deleteComment('685998752925fb31103216de', commentId, accessToken);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      if (editingCommentId === commentId) {
        setEditingCommentId(null);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du commentaire", error);
    }
  };

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  if (loading) return loadingContent;

  if (!comments || comments.length === 0) {
    return (
      <div>
        <CommentInput post_id={postId} onAddComment={handleAddComment} />
        <div className="p-4 text-sm text-gray-500 italic">
          Aucun commentaire pour ce post
        </div>  
      </div>
    );
  }

  const visibleComments = comments.slice(0, visibleCount);
  const hasMore = comments.length > visibleCount;

  return (
    <div>
      <CommentInput post_id={postId} onAddComment={handleAddComment} />
      <div className="flex flex-col p-2">
        {visibleComments.map((comment) => (
          <Comment
            postId='685998752925fb31103216de'
            key={comment._id}
            comment={comment}
            editingCommentId={editingCommentId}
            setEditingCommentId={setEditingCommentId}
            onUpdateComment={handleUpdateComment}
            onDeleteComment={handleDeleteComment}
            onAddReply={handleAddReply}
          />
        ))}
      </div>
      {hasMore && (
        <div className="text-center my-2">
          <button
            onClick={handleShowMore}
            className="text-sm text-blue-600 hover:underline"
          >
            Afficher plus de commentaires
          </button>
        </div>
      )}
    </div>
  );
}
