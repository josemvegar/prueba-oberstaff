"use client"

import { useState } from "react"
import { Box, TextField, Button, Paper, Typography, Link, CircularProgress } from "@mui/material"
import { useAuth } from "../hooks/useAuth"

export default function Login() {
  const { login } = useAuth()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await login(username, password)
    } catch (err) {
      setError("Credenciales incorrectas")
      console.error("Login error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ bgcolor: "background.default" }}
    >
      <Paper sx={{ p: 4, width: 420, maxWidth: "90%" }}>
        <Typography variant="h5" mb={2} textAlign="center">
          Iniciar sesión
        </Typography>

        <form onSubmit={submit}>
          <TextField
            label="Usuario"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
          />
          <TextField
            label="Contraseña"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />

          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </Button>
        </form>

        <Box mt={2} textAlign="center">
          <Link href="/register" underline="hover">
            ¿No tienes cuenta? Regístrate
          </Link>
        </Box>
      </Paper>
    </Box>
  )
}
