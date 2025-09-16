"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Alert,
  CircularProgress,
} from "@mui/material"
import { ArrowBack as ArrowBackIcon, Save as SaveIcon } from "@mui/icons-material"
import api from "../api/api"

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

const PROJECT_STATUS_OPTIONS = [
  { value: "pending", label: "Pendiente" },
  { value: "in_progress", label: "En proceso" },
  { value: "completed", label: "Completado" },
  { value: "cancelled", label: "Cancelado" },
]

export default function CreateProject() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState([])
  const [error, setError] = useState("")
  const [currentUser, setCurrentUser] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    members_ids: [],
    start_date: "",
    end_date: "",
    status: "pending",
  })

  useEffect(() => {
    console.log("[v0] CreateProject useEffect triggered")
    const loadData = async () => {
      console.log("[v0] Starting to load users and current user...")
      try {
        const currentUserResponse = await api.get("/users/me/")
        console.log("[v0] Current user from API:", currentUserResponse.data)
        setCurrentUser(currentUserResponse.data)

        const usersResponse = await api.get("/users/")
        console.log("[v0] All users from API:", usersResponse.data)

        const filteredUsers = usersResponse.data.filter((user) => {
          const isNotCurrentUser = user.id !== currentUserResponse.data.id
          console.log(
            `[v0] Checking user ${user.email}: ID ${user.id} vs current ${currentUserResponse.data.id} - Include: ${isNotCurrentUser}`,
          )
          return isNotCurrentUser
        })

        console.log("[v0] Filtered users (excluding current user):", filteredUsers)
        setUsers(filteredUsers)
      } catch (err) {
        console.error("[v0] Error loading data:", err)
        setError("Error al cargar usuarios")
      }
    }
    loadData()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleMembersChange = (event) => {
    const value = event.target.value
    setFormData((prev) => ({
      ...prev,
      members_ids: typeof value === "string" ? value.split(",") : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await api.post("/projects/", {
        name: formData.name,
        description: formData.description,
        members_ids: formData.members_ids.map((id) => Number.parseInt(id)),
        start_date: formData.start_date,
        end_date: formData.end_date,
        status: formData.status,
      })

      navigate(`/projects/${response.data.id}`)
    } catch (err) {
      console.error("Error creating project:", err)
      setError(err.response?.data?.message || "Error al crear el proyecto")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/")}
          sx={{
            mb: 2,
            color: "#6b7280",
            "&:hover": { bgcolor: "#f3f4f6" },
          }}
        >
          Volver a Proyectos
        </Button>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "#1f2937",
            mb: 1,
            letterSpacing: "-0.025em",
          }}
        >
          Crear Nuevo Proyecto
        </Typography>

        <Typography variant="body1" sx={{ color: "#6b7280" }}>
          Completa la información para crear un nuevo proyecto
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 4,
          border: "1px solid #e5e7eb",
          borderRadius: 3,
          bgcolor: "#ffffff",
        }}
      >
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              name="name"
              label="Nombre del Proyecto"
              value={formData.name}
              onChange={handleInputChange}
              required
              fullWidth
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />

            <TextField
              name="description"
              label="Descripción"
              value={formData.description}
              onChange={handleInputChange}
              required
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />

            <FormControl fullWidth>
              <InputLabel>Miembros del Proyecto</InputLabel>
              <Select
                multiple
                value={formData.members_ids}
                onChange={handleMembersChange}
                input={<OutlinedInput label="Miembros del Proyecto" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => {
                      const user = users.find((u) => u.id === Number.parseInt(value))
                      return (
                        <Chip
                          key={value}
                          label={user ? `${user.first_name} ${user.last_name}` : value}
                          size="small"
                          sx={{
                            bgcolor: "#e0e7ff",
                            color: "#3730a3",
                          }}
                        />
                      )
                    })}
                  </Box>
                )}
                MenuProps={MenuProps}
                sx={{
                  borderRadius: 2,
                }}
              >
                {users.length === 0 ? (
                  <MenuItem disabled>
                    <Typography variant="body2" sx={{ color: "#6b7280", fontStyle: "italic" }}>
                      No hay usuarios adicionales para agregar al proyecto, por defecto serás tú.
                    </Typography>
                  </MenuItem>
                ) : (
                  users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.first_name} {user.last_name} ({user.email})
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                name="start_date"
                label="Fecha de Inicio"
                type="date"
                value={formData.start_date}
                onChange={handleInputChange}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />

              <TextField
                name="end_date"
                label="Fecha de Finalización"
                type="date"
                value={formData.end_date}
                onChange={handleInputChange}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Box>

            <FormControl fullWidth>
              <InputLabel>Estado del Proyecto</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                label="Estado del Proyecto"
                sx={{ borderRadius: 2 }}
              >
                {PROJECT_STATUS_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 2 }}>
              <Button
                type="button"
                variant="outlined"
                onClick={() => navigate("/")}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1.5,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                sx={{
                  bgcolor: "#6366f1",
                  borderRadius: 2,
                  px: 3,
                  py: 1.5,
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": {
                    bgcolor: "#4f46e5",
                  },
                }}
              >
                {loading ? "Creando..." : "Crear Proyecto"}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Container>
  )
}
