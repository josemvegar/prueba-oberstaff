"use client"

import { useAuth } from "../hooks/useAuth"
import { isAdmin } from "../utils/permissions"
import { Navigate } from "react-router-dom"
import { Alert, Container } from "@mui/material"

export default function AdminRoute({ children }) {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!isAdmin(user)) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          No tienes permisos para acceder a esta sección. Solo los administradores pueden acceder.
        </Alert>
      </Container>
    )
  }

  return children
}
