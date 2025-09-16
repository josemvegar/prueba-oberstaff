"use client"

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
  const { id } = useParams()
  const [task, setTask] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showEditForm, setShowEditForm] = useState(false)
  const { user } = useAuth()
  const nav = useNavigate()

  useEffect(() => {
    ;(async function load() {
      setLoading(true)
      try {
        const res = await api.get(`/tasks/${id}/`)
        setTask(res.data)
        // Load comments for task
        const cRes = await api.get(`/comments/?task=${id}`)
        setComments(cRes.data)
      } catch (e) {
        console.error("Error loading task details:", e)
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  const refreshTask = async () => {
    try {
      const res = await api.get(`/tasks/${id}/`)
      setTask(res.data)
    } catch (e) {
      console.error("Error refreshing task:", e)
    }
  }

  const deleteTask = async () => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta tarea?")) {
      try {
        await api.delete(`/tasks/${id}/`)
        nav(-1) // Go back to previous page
      } catch (e) {
        console.error("Error deleting task:", e)
        alert("Error al eliminar la tarea")
      }
    }
  }

  if (loading) return <Loading />
  if (!task) return <Typography>Tarea no encontrada</Typography>

  // frontend permission: collabs cannot view detail per your rule
  if (user.role === "collab" && !canViewTaskDetail(user, task)) {
    return <Typography color="error">No tienes permiso para ver el detalle de esta tarea.</Typography>
  }

  return (
    <Box>
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
              Asignado a:{" "}
              {task.assigned_to ? `${task.assigned_to.first_name} ${task.assigned_to.last_name}` : "Sin asignar"}
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

      <CommentsList
        task={task}
        comments={comments}
        onChange={() => {
          /* optional refresh */
        }}
      />

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
