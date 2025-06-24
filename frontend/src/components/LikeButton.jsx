import React, { useState } from "react";

export default  (active, count, likeURL, dislikeURL ) => {
  const [liked, setLiked] = useState(active);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLike = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(liked? dislikeURL : likeURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ liked: !liked }),
      });

      if (!response.ok) {
        throw new Error("Échec de l'envoi du like");
      }

      setLiked(true);
    } catch (err) {
        console.error("Can't Like beacuase :" .err);
   
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="flex items-center gap-2">
      
         <button
      onClick={handleLike}
      className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-red-500 transition-all"
    >
      <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class={ "w-5 h-5 transition-all duration-200 icon icon-tabler icons-tabler-outline icon-tabler-heart"+ liked ? "fill-red-500 text-red-500 scale-110" : "text-gray-400"}><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" /></svg>
      <span>{count + liked }</span>
    </button>
    </div>
  );
};
