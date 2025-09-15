import api from "./api";

export async function login(username, password) {
  const res = await api.post("/auth/token/", { username, password });
  return res.data; // contains access + refresh
}

export async function register(data) {
  // For simplicity, create user via endpoint you expose (not included above)
  const res = await api.post("/auth/register/", data);
  return res.data;
}
