
// Vista de detalle de una tarea. Permite ver información, editar y eliminar la tarea, así como ver y agregar comentarios.

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../api/api"
import Loading from "../components/Loading"
import { Box, Paper, Typography, Button } from "@mui/material"
import CommentsList from "../widgets/CommentsList"
import TaskForm from "../components/TaskForm"
import { useAuth } from "../hooks/useAuth"
import { canViewTaskDetail, canEditTask } from "../utils/permissions"

export default function TaskDetail() {
  // Obtiene el ID de la tarea desde la URL
  const { id } = useParams()
  const [task, setTask] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showEditForm, setShowEditForm] = useState(false)
  const { user } = useAuth()
  const nav = useNavigate()

  // Carga los datos de la tarea y sus comentarios al montar el componente o cambiar el ID
  useEffect(() => {
    (async function load() {
      setLoading(true)
      try {
        const res = await api.get(`/tasks/${id}/`)
        setTask(res.data)
        // Cargar comentarios de la tarea
        const cRes = await api.get(`/comments/?task=${id}`)
        setComments(cRes.data)
      } catch (e) {
        console.error("Error al cargar detalles de la tarea:", e)
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  // Refresca los datos de la tarea desde la API
  const refreshTask = async () => {
    try {
      const res = await api.get(`/tasks/${id}/`)
      setTask(res.data)
    } catch (e) {
      console.error("Error al refrescar la tarea:", e)
    }
  }

  // Elimina la tarea actual si el usuario confirma
  const deleteTask = async () => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta tarea?")) {
      try {
        await api.delete(`/tasks/${id}/`)
        nav(-1) // Regresa a la página anterior
      } catch (e) {
        console.error("Error al eliminar la tarea:", e)
        alert("Error al eliminar la tarea")
      }
    }
  }

  // Muestra un indicador de carga o mensaje si la tarea no existe
  if (loading) return <Loading />
  if (!task) return <Typography>Tarea no encontrada</Typography>

  // Permiso: los colaboradores no pueden ver el detalle de la tarea según la regla
  if (user.role === "collab" && !canViewTaskDetail(user, task)) {
    return <Typography color="error">No tienes permiso para ver el detalle de esta tarea.</Typography>
  }

  // Renderiza la información de la tarea, botones de edición/eliminación, comentarios y formulario de edición
  return (
    <Box>
      {/* Información principal de la tarea */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Box>
            <Typography variant="h5">{task.name}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {task.description}
            </Typography>
            <Typography variant="caption" sx={{ display: "block" }}>
              Estado: {task.status}
            </Typography>
            <Typography variant="caption" sx={{ display: "block" }}>
              Asignado a: {task.assigned_to ? `${task.assigned_to.first_name} ${task.assigned_to.last_name}` : "Sin asignar"}
            </Typography>
            <Typography variant="caption" sx={{ display: "block" }}>
              Fecha límite: {task.due_date || "Sin fecha límite"}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            {canEditTask(user, task) && (
              <Button variant="outlined" onClick={() => setShowEditForm(true)}>
                Editar
              </Button>
            )}
            {canEditTask(user, task) && (
              <Button variant="outlined" color="error" onClick={deleteTask}>
                Eliminar
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Lista de comentarios de la tarea */}
      <CommentsList
        task={task}
        comments={comments}
        onChange={() => {
          // Se puede refrescar la lista si es necesario
        }}
      />

      {/* Formulario para editar la tarea */}
      <TaskForm
        open={showEditForm}
        onClose={() => setShowEditForm(false)}
        onSuccess={refreshTask}
        task={task}
        projectId={task?.project?.id}
      />
    </Box>
  )
}
