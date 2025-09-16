"use client"

import { useState, useEffect } from "react"
import {
  Container,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
} from "@mui/material"
import { Edit, Delete, Add, Person } from "@mui/icons-material"
import { useAuth } from "../hooks/useAuth"
import { isAdmin } from "../utils/permissions"
import api from "../api/api"

export default function UserManagement() {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [openDialog, setOpenDialog] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    role: "viewer",
    password: "",
  })

  useEffect(() => {
    if (!isAdmin(user)) {
      setError("No tienes permisos para acceder a esta sección.")
      setLoading(false)
    } else {
      fetchUsers()
    }
  }, [user])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await api.get("/users/")
      setUsers(response.data)
    } catch (error) {
      setError("Error al cargar usuarios: " + (error.response?.data?.message || error.message))
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (userToEdit = null) => {
    if (userToEdit) {
      setEditingUser(userToEdit)
      setFormData({
        username: userToEdit.username,
        email: userToEdit.email,
        first_name: userToEdit.first_name || "",
        last_name: userToEdit.last_name || "",
        role: userToEdit.role,
        password: "",
      })
    } else {
      setEditingUser(null)
      setFormData({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        role: "viewer",
        password: "",
      })
    }
    setOpenDialog(true)
    setError("")
    setSuccess("")
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingUser(null)
    setFormData({
      username: "",
      email: "",
      first_name: "",
      last_name: "",
      role: "viewer",
      password: "",
    })
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingUser) {
        // Update user
        const updateData = { ...formData }
        if (!updateData.password) {
          delete updateData.password // Don't send empty password
        }
        await api.put(`/users/${editingUser.id}/`, updateData)
        setSuccess("Usuario actualizado exitosamente")
      } else {
        // Create user
        await api.post("/users/", formData)
        setSuccess("Usuario creado exitosamente")
      }
      handleCloseDialog()
      fetchUsers()
    } catch (error) {
      setError("Error al guardar usuario: " + (error.response?.data?.message || error.message))
    }
  }

  const handleDelete = async (userId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
      try {
        await api.delete(`/users/${userId}/`)
        setSuccess("Usuario eliminado exitosamente")
        fetchUsers()
      } catch (error) {
        setError("Error al eliminar usuario: " + (error.response?.data?.message || error.message))
      }
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "error"
      case "collab":
        return "warning"
      case "viewer":
        return "info"
      default:
        return "default"
    }
  }

  const getRoleLabel = (role) => {
    switch (role) {
      case "admin":
        return "Administrador"
      case "collab":
        return "Colaborador"
      case "viewer":
        return "Visualizador"
      default:
        return role
    }
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Cargando usuarios...
        </Typography>
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Person sx={{ fontSize: 32, color: "#6366f1" }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: "#1f2937" }}>
            Gestión de Usuarios
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{
            bgcolor: "#6366f1",
            "&:hover": { bgcolor: "#4f46e5" },
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Crear Usuario
        </Button>
      </Box>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}

      <TableContainer component={Paper} sx={{ boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f9fafb" }}>
              <TableCell sx={{ fontWeight: 600, color: "#374151" }}>Usuario</TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#374151" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#374151" }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#374151" }}>Rol</TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#374151" }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((userItem) => (
              <TableRow key={userItem.id} sx={{ "&:hover": { bgcolor: "#f9fafb" } }}>
                <TableCell sx={{ fontWeight: 500 }}>{userItem.username}</TableCell>
                <TableCell>{userItem.email}</TableCell>
                <TableCell>
                  {userItem.first_name || userItem.last_name
                    ? `${userItem.first_name || ""} ${userItem.last_name || ""}`.trim()
                    : "-"}
                </TableCell>
                <TableCell>
                  <Chip
                    label={getRoleLabel(userItem.role)}
                    color={getRoleColor(userItem.role)}
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton size="small" onClick={() => handleOpenDialog(userItem)} sx={{ color: "#6366f1" }}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(userItem.id)}
                      sx={{ color: "#dc2626" }}
                      disabled={userItem.id === user.id} // Can't delete self
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create/Edit User Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{editingUser ? "Editar Usuario" : "Crear Nuevo Usuario"}</DialogTitle>
          <DialogContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
              <TextField
                name="username"
                label="Nombre de Usuario"
                value={formData.username}
                onChange={handleInputChange}
                required
                fullWidth
              />
              <TextField
                name="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                fullWidth
              />
              <TextField
                name="first_name"
                label="Nombre"
                value={formData.first_name}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                name="last_name"
                label="Apellido"
                value={formData.last_name}
                onChange={handleInputChange}
                fullWidth
              />
              <FormControl fullWidth required>
                <InputLabel>Rol</InputLabel>
                <Select name="role" value={formData.role} onChange={handleInputChange} label="Rol">
                  <MenuItem value="admin">Administrador</MenuItem>
                  <MenuItem value="collab">Colaborador</MenuItem>
                  <MenuItem value="viewer">Visualizador</MenuItem>
                </Select>
              </FormControl>
              <TextField
                name="password"
                label={editingUser ? "Nueva Contraseña (opcional)" : "Contraseña"}
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required={!editingUser}
                fullWidth
                helperText={editingUser ? "Deja en blanco para mantener la contraseña actual" : ""}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                bgcolor: "#6366f1",
                "&:hover": { bgcolor: "#4f46e5" },
              }}
            >
              {editingUser ? "Actualizar" : "Crear"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  )
}
