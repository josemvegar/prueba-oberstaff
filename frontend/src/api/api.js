import axios from "axios"
import { logoutLocal } from "./auth"

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/api"
console.log("API URL being used:", apiUrl)

const api = axios.create({
  baseURL: apiUrl,
  timeout: 15000,
})

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error)
    else prom.resolve(token)
  })
  failedQueue = []
}

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config
    if (!originalRequest) return Promise.reject(err)
    if (err.response && err.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const refresh = localStorage.getItem("refresh")
      if (!refresh) {
        logoutLocal()
        return Promise.reject(err)
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token
            return api(originalRequest)
          })
          .catch((e) => Promise.reject(e))
      }

      isRefreshing = true
      try {
        const response = await axios.post(`${api.defaults.baseURL}/auth/token/refresh/`, {
          refresh,
        })
        const { access } = response.data
        localStorage.setItem("access", access)
        api.defaults.headers.common["Authorization"] = `Bearer ${access}`
        processQueue(null, access)
        return api(originalRequest)
      } catch (e) {
        processQueue(e, null)
        logoutLocal()
        return Promise.reject(e)
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(err)
  },
)

export function setAuthHeader(token) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common["Authorization"]
  }
}

export default api
