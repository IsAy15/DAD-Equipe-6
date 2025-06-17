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
