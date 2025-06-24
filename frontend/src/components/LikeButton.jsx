import React, { useState } from "react";
import { useAuth } from "@/contexts/authcontext";

export default  function LikeButton({isLiked, count, onLike, idToLike}) {
  const [liked, setLiked] = useState(Boolean(isLiked));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { identifier, accessToken } = useAuth();
  const handleLike = async () => {if(loading){return}
    
    setLoading(true);
    setError(null);
    try {
    console.log("handleLike called with:", !liked, idToLike, accessToken);
    onLike(!liked, idToLike, accessToken);
    setLiked(!liked);

    } catch (err) {
        console.log(err);
   
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
<svg className={"icon icon-tabler icon-tabler-heart" +  (liked ?"icons-tabler-outline " : "icons-tabler-filled ") +  (liked ? "text-red-700" : "text-gray-500")}   xmlns="http://www.w3.org/2000/svg"   width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  ><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" /></svg>    </button>
    {count}
    </div>
  );
};
