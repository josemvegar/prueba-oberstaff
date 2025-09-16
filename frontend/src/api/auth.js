import api, { setAuthHeader } from "./api"

export async function loginRequest(username, password) {
  const res = await api.post("/auth/token/", { username, password })
  return res.data // {access, refresh}
}

export async function registerRequest(payload) {
  // Transform payload to match Django backend expected fields
  const transformedPayload = {
    username: payload.username,
    email: payload.email,
    first_name: payload.firstName || payload.first_name,
    last_name: payload.lastName || payload.last_name,
    role: payload.role || "viewer",
    password: payload.password,
  }
  const res = await api.post("/users/", transformedPayload)
  return res.data
}

export async function getMe() {
  const res = await api.get("/users/me/")
  return res.data
}

export function logoutLocal() {
  localStorage.removeItem("access")
  localStorage.removeItem("refresh")
  setAuthHeader(null)
}
