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
  const res = await apiClient.get(`/api/posts/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export async function fetchUserFeed(userId, token) {
  const res = await apiClient.get(`/api/posts/${userId}/feed`, {
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
export async function fetchUserMessages(token) {
  // On suppose que ton service tourne à /api/messages/inbox
  const res = await apiClient.get("/messages/inbox", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data; // { inbox: [ { sender, messages: [...] } ] }
}

export async function fetchMessageById(messageId, token) {
  // On passe aussi par apiClient pour utiliser le même baseURL
  const res = await apiClient.get(`/messages/${messageId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data; // { content, createdAt, read, ... }
}
