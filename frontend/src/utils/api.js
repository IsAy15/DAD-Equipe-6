import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 5000,
});

// —————————————
// Auth
// —————————————

// Inscription
export async function registerUser(email, username, password) {
  const { data } = await apiClient.post("/register", {
    email,
    username,
    password,
  });
  return data; // { msg, accessToken }
}

// Connexion
export const loginUser = async (identifier, password) => {
  try {
    const response = await apiClient.post("/login", {
      identifier,
      password,
    });
    return response.data;
  } catch (error) {
    //console.error("Erreur lors de la connexion :", error);
    throw error;
  }
};

export async function fetchUserProfile(identifier) {
  const res = await apiClient.get(`/api/users/${identifier}`);
  return res.data;
}

export async function fetchUserFollowing(userId) {
  const res = await apiClient.get(`/api/users/${userId}/following`);
  return res.data;
}

export async function fetchUserFollowers(userId) {
  const res = await apiClient.get(`/api/users/${userId}/followers`);
  return res.data;
}

export async function fetchUserFriends(userId, token) {
  const res = await apiClient.get(`/api/users/${userId}/friends`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export async function fetchUserPosts(userId, token) {
  const res = await apiClient.get(`/api/posts/byuser/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export async function fetchUserFeed(token) {
  const res = await apiClient.get(`/api/posts/feed`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log("fetchUserFeed res", res);
  return res.data;
}

export async function followUser(targetUserId, token) {
  const res = await apiClient.post(
    `api/friend-requests/follow/${targetUserId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}

export async function unfollowUser(targetUserId, token) {
  const res = await apiClient.post(
    `api/friend-requests/unfollow/${targetUserId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}
export async function postBreeze(text, image, token) {
  const res = await apiClient.post(
    "/api/posts/",
    {
      content: text,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}

export async function likeBreeze(setLiked, postID, token) {
  const res = await apiClient.post(
    setLiked
      ? "/api/posts/likes/posts/" + postID + "/like"
      : "/api/posts/likes/posts/" + postID + "/unlike",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}

export async function fetchTaggedPosts(tag, token) {
  const res = await apiClient.get(`/api/posts/search/popular?tag=${tag}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export async function fetchPosts(postId, token) {
  const res = await apiClient.get(`/api/posts/${postId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export async function fetchUsersByUsername(query, token) {
  const res = await apiClient.get(`/api/users/search?query=${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export async function fetchUserMessages(token) {
  const res = await apiClient.get("/messages/inbox", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function fetchMessageById(messageId, token) {
  const res = await apiClient.get(`/messages/${messageId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function fetchPostComments(postId, token) {
  const res = await apiClient.get(`/api/posts/${postId}/comments`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export async function addCommentToPost(postId, comment_content, token) {
  const res = await apiClient.post(
    `/api/posts/${postId}/comments`,
    {
      content: comment_content,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res;
}

export async function updateComment(postId, commentId, new_content, token) {
  const res = await apiClient.put(
    `/api/posts/${postId}/comments/${commentId}`,
    {
      content: new_content,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res;
}

export async function deleteComment(postId, commentId, token) {
  const res = await apiClient.delete(
    `/api/posts/${postId}/comments/${commentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res;
}

export async function getCommentReplies(postId, commentId, token) {
  const res = await apiClient.get(
    `/api/posts/${postId}/comments/${commentId}/replies`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}

export async function getCommentRepliesCount(postId, commentId, token) {
  const res = await apiClient.get(
    `/api/posts/${postId}/comments/${commentId}/repliesCount`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res;
}

export async function addReplyToComment(
  postId,
  commentId,
  reply_content,
  reply_username,
  token
) {
  const res = await apiClient.post(
    `/api/posts/${postId}/comments/${commentId}/replies`,
    {
      content: reply_content,
      replyUsername: reply_username,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res;
}

export async function likeComment(commentId, token) {
  const res = await apiClient.post(
    `/api/posts/likes/comments/${commentId}/like`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}

export async function unlikeComment(commentId, token) {
  const res = await apiClient.post(
    `/api/posts/likes/comments/${commentId}/unlike`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}

export async function sendMessage(receiverId, content, token) {
  const res = await apiClient.post(
    "/messages/send",
    {
      receiver: receiverId,
      content: content,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}

export async function getConversations(userId, token) {
  const res = await apiClient.get(`/messages/conversations/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function deleteMessage(messageId, token) {
  const res = await apiClient.delete(`/messages/${messageId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function editMessage(messageId, content, token) {
  const res = await apiClient.patch(
    `/messages/${messageId}`,
    { content: content },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
}
