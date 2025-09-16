"use client"

import { useState } from "react"
import { Box, TextField, Button, Paper, Typography, Link, CircularProgress, Alert } from "@mui/material"
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
      sx={{
        bgcolor: "#f8fafc",
        backgroundImage: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 6,
          width: 480,
          maxWidth: "90%",
          bgcolor: "#ffffff",
          borderRadius: 3,
          border: "1px solid #e2e8f0",
          boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        }}
      >
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#1f2937",
              mb: 1,
              letterSpacing: "-0.025em",
            }}
          >
            Bienvenido
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#6b7280",
              fontWeight: 400,
            }}
          >
            Inicia sesión en tu cuenta
          </Typography>
        </Box>

        <form onSubmit={submit}>
          <TextField
            label="Usuario"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: "#f8fafc",
                "&:hover": {
                  bgcolor: "#f1f5f9",
                },
                "&.Mui-focused": {
                  bgcolor: "#ffffff",
                },
              },
            }}
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
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: "#f8fafc",
                "&:hover": {
                  bgcolor: "#f1f5f9",
                },
                "&.Mui-focused": {
                  bgcolor: "#ffffff",
                },
              },
            }}
          />

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 2,
                borderRadius: 2,
                bgcolor: "#fef2f2",
                color: "#dc2626",
                border: "1px solid #fecaca",
              }}
            >
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{
              py: 1.5,
              bgcolor: "#374151",
              borderRadius: 2,
              fontWeight: 600,
              textTransform: "none",
              fontSize: "1rem",
              boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
              "&:hover": {
                bgcolor: "#1f2937",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
              },
              "&:disabled": {
                bgcolor: "#9ca3af",
              },
            }}
          >
            {loading ? "Ingresando..." : "Iniciar Sesión"}
          </Button>
        </form>

        <Box mt={4} textAlign="center">
          <Typography variant="body2" sx={{ color: "#6b7280" }}>
            ¿No tienes cuenta?{" "}
            <Link
              href="/register"
              underline="none"
              sx={{
                color: "#6366f1",
                fontWeight: 600,
                "&:hover": {
                  color: "#4f46e5",
                },
              }}
            >
              Regístrate aquí
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  )
}
