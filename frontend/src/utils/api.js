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
    setLiked?
    "/api/posts/"+postID+"/likes/like":
    "/api/posts/"+postID+"/likes/unlike",
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
