"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Box,
} from "@mui/material"
import api from "../api/api"

const TASK_STATUS_OPTIONS = [
  { value: "pending", label: "Pendiente" },
  { value: "in_progress", label: "En progreso" },
  { value: "completed", label: "Completada" },
]

export default function TaskForm({ open, onClose, onSuccess, task = null, projectId }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [projectMembers, setProjectMembers] = useState([])
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "pending",
    assigned_to_id: "",
    due_date: "",
    project_id: projectId || "",
  })

  const isEditing = !!task

  useEffect(() => {
    if (task) {
      setFormData({
        name: task.name || "",
        description: task.description || "",
        status: task.status || "pending",
        assigned_to_id: task.assigned_to?.id || "",
        due_date: task.due_date || "",
        project_id: task.project?.id || projectId || "",
      })
    }
  }, [task, projectId])

  useEffect(() => {
    const loadProjectMembers = async () => {
      let projectIdToUse = projectId

      if (task && task.project) {
        projectIdToUse = task.project.id || task.project
      } else if (formData.project_id) {
        projectIdToUse = formData.project_id
      }

  // Cargando los miembros del proyecto para el ID proporcionado

      if (projectIdToUse) {
        try {
          const response = await api.get(`/projects/${projectIdToUse}/`)
          // Miembros del proyecto cargados correctamente
          // Datos del proyecto obtenidos
          setProjectMembers(response.data.members || [])

          if (isEditing && response.data.id) {
            setFormData((prev) => ({
              ...prev,
              project_id: response.data.id,
            }))
          }
        } catch (err) {
          console.error("Error loading project members:", err)
          setError("Error al cargar los miembros del proyecto")
        }
      }
          // Determina si se está editando una tarea existente
    }

    if (open) {
      loadProjectMembers()
    }
  }, [open, task, projectId, formData.project_id, isEditing])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        status: formData.status,
        assigned_to_id: formData.assigned_to_id ? Number.parseInt(formData.assigned_to_id) : null,
        due_date: formData.due_date,
        project: Number.parseInt(formData.project_id),
      }

      if (isEditing) {
        await api.patch(`/tasks/${task.id}/`, payload)
      } else {
        await api.post("/tasks/", payload)
      }

      onSuccess()
      onClose()
    } catch (err) {
      console.error("Error saving task:", err)
      setError(err.response?.data?.message || "Error al guardar la tarea")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEditing ? "Editar Tarea" : "Crear Nueva Tarea"}</DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              name="name"
              label="Nombre de la Tarea"
              value={formData.name}
              onChange={handleInputChange}
              required
              fullWidth
              variant="outlined"
            />

            <TextField
              name="description"
              label="Descripción"
              value={formData.description}
              onChange={handleInputChange}
              required
              fullWidth
              multiline
              rows={3}
              variant="outlined"
            />

            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select name="status" value={formData.status} onChange={handleInputChange} label="Estado">
                {TASK_STATUS_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Persona Asignada</InputLabel>
              <Select
                name="assigned_to_id"
                value={formData.assigned_to_id}
                onChange={handleInputChange}
                label="Persona Asignada"
              >
                <MenuItem value="">
                  <em>Sin asignar</em>
                </MenuItem>
                {projectMembers.map((member) => (
                  <MenuItem key={member.id} value={member.id}>
                    {member.first_name} {member.last_name} ({member.email})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              name="due_date"
              label="Fecha Límite"
              type="date"
              value={formData.due_date}
              onChange={handleInputChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? "Guardando..." : isEditing ? "Actualizar" : "Crear"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
