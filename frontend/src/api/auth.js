import api, { setAuthHeader } from "./api";

export async function loginRequest(username, password) {
  const res = await api.post("/auth/token/", { username, password });
  return res.data; // {access, refresh}
}

export async function registerRequest(payload) {
  const res = await api.post("/auth/register/", payload);
  return res.data;
}

export async function getMe() {
  const res = await api.get("/users/me/");
  return res.data;
}

export function logoutLocal() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  setAuthHeader(null);
}
