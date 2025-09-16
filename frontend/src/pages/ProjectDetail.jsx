"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../api/api"
import Loading from "../components/Loading"
import { Box, Typography, Paper, List, Button } from "@mui/material"
import TaskItem from "../widgets/TaskItem"
import { useAuth } from "../hooks/useAuth"
import { canCreateTask, canEditProject, canDeleteProject } from "../utils/permissions"
import TaskForm from "../components/TaskForm"

export default function ProjectDetail() {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const { user } = useAuth()
  const nav = useNavigate()

  useEffect(() => {
    ; (async function load() {
      setLoading(true)
      try {
        const [pRes, tRes] = await Promise.all([api.get(`/projects/${id}/`), api.get(`/tasks/?project=${id}`)])
        setProject(pRes.data)
        setTasks(tRes.data)
      } catch (e) {
        console.error("Error loading project details:", e)
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  const refreshTasks = async () => {
    try {
      const tRes = await api.get(`/tasks/?project=${id}`)
      setTasks(tRes.data)
    } catch (e) {
      console.error("Error refreshing tasks:", e)
    }
  }

  if (loading) return <Loading />
  if (!project) return <Typography>Proyecto no encontrado</Typography>

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            <Typography variant="h5">{project.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {project.description}
            </Typography>
          </Box>
          <Box>
            {canEditProject(user, project) && <Button onClick={() => nav(`/projects/${id}/edit`)}>Editar</Button>}
            {canDeleteProject(user, project) && (
              <Button
                color="error"
                onClick={async () => {
                  try {
                    await api.delete(`/projects/${id}/`)
                    nav("/")
                  } catch (e) {
                    console.error("Error deleting project:", e)
                    alert("Error al eliminar el proyecto")
                  }
                }}
              >
                Eliminar
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Tareas</Typography>
        <List>
          {tasks.map((t) => (
            <TaskItem key={t.id} task={t} onView={(taskId) => nav(`/tasks/${taskId}`)} allowView={true} />
          ))}
        </List>
        {canCreateTask(user, project) ? (
          <>
            <Button
              variant="contained"
              sx={{ mt: 2, mr: 2 }}
              onClick={() => setShowTaskForm(true)}
            >
              Crear tarea
            </Button>
            <Button
              variant="outlined"
              sx={{ mt: 2 }}
              onClick={() => nav("/")}
            >
              Volver
            </Button>
          </>
        ) : (
          <Button
            variant="outlined"
            sx={{ mt: 2 }}
            onClick={() => nav("/")}
            fullWidth
          >
            Volver
          </Button>
        )}
      </Paper>

      <TaskForm open={showTaskForm} onClose={() => setShowTaskForm(false)} onSuccess={refreshTasks} projectId={id} />
    </Box>
  )
}
