import API, { setToken, clearToken } from "./axiosInstance";

export const registerUser = async (userData) => {
  const res = await API.post("/users/register", userData);
  return res.data;
};

export const loginUser = async (credentials) => {
  // Clear old session first
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  clearToken();

  const res = await API.post("/users/login", credentials);

  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.data));
    setToken(res.data.token); // Update in-memory cache
  }

  return res.data;
};

export const getMe = async () => {
  const res = await API.get("/users/me");
  return res.data;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  clearToken(); // Clear in-memory cache
};