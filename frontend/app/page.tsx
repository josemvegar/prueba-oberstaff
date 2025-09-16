"use client"

import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "../src/contexts/AuthProvider"
import App from "../src/App"
import "../src/index.css"

export default function Page() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  )
}
