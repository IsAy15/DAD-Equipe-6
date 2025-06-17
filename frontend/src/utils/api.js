import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://51.44.6.79: 8080",
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
export const loginUser = async (username, password) => {
  try {
    const response = await apiClient.post("/login", {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    //console.error("Erreur lors de la connexion :", error);
    throw error;
  }
};
