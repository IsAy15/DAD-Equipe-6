import React, { useEffect,useState } from "react";
import { useAuth } from "@/contexts/authcontext";

export default  function LikeButton({isLiked, count, onLike, idToLike}) {
  const [liked, setLiked] = useState( isLiked ?? false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
    const [likeCount, setlikeCount] = useState(count ??0);

  const { identifier, accessToken } = useAuth();
  
  const handleLike = async () => {if(loading){return}
    
    setLoading(true);
    setError(null);
    try {
    onLike(!liked, idToLike, accessToken);
    setlikeCount(liked ? likeCount - 1 : likeCount + 1)
    setLiked(!liked);
    } catch (err) {
        console.error(err);
   
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
      {liked &&
<svg  className="icon icon-tabler icons-tabler-filled icon-tabler-heart text-red-500" xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="currentColor"  ><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6.979 3.074a6 6 0 0 1 4.988 1.425l.037 .033l.034 -.03a6 6 0 0 1 4.733 -1.44l.246 .036a6 6 0 0 1 3.364 10.008l-.18 .185l-.048 .041l-7.45 7.379a1 1 0 0 1 -1.313 .082l-.094 -.082l-7.493 -7.422a6 6 0 0 1 3.176 -10.215z" /></svg>    }
          {!liked &&
<svg className="icon icon-tabler icons-tabler-outline icons-tabler-filled icon-tabler-heart text-gray-500"  xmlns="http://www.w3.org/2000/svg"   width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  ><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" /></svg>  
    }
      </button>
      <span className="text-gray-500">  { likeCount}</span>

    </div>
  );
};
