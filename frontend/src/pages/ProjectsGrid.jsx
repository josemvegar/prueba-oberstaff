"use client"

import { useEffect, useState } from "react"
import api from "../api/api"
import { Grid, Box, Button, Typography, Container } from "@mui/material"
import { Add as AddIcon } from "@mui/icons-material"
import ProjectCard from "../widgets/ProjectCard"
import Loading from "../components/Loading"
import { useAuth } from "../hooks/useAuth"
import { useNavigate } from "react-router-dom"
import { isAdmin, isCollab } from "../utils/permissions"

export default function ProjectsGrid() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const nav = useNavigate()


  useEffect(() => {
    ; (async function load() {
      setLoading(true)
      try {
        const res = await api.get("/projects/")

        // Filtrar proyectos según el rol del usuario
        let filteredProjects = res.data

        if (!isAdmin(user) && !isCollab(user)) {
          // Si NO es admin NI collab, filtrar solo proyectos donde el usuario es miembro
          filteredProjects = res.data.filter(project =>
            project.members.some(member => member.id === user?.id)
          )
        }

        setProjects(filteredProjects)
      } catch (e) {
        console.error("Error loading projects:", e)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) return <Loading />

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            color: "#1f2937",
            mb: 2,
            letterSpacing: "-0.025em",
          }}
        >
          Mis Proyectos
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: "#6b7280",
            fontWeight: 400,
            mb: 4,
          }}
        >
          Gestiona y supervisa todos tus proyectos desde un solo lugar
        </Typography>

        {user && (user.role === "admin" || user.role === "collab") && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => nav("/projects/new")}
            size="large"
            sx={{
              bgcolor: "#6366f1",
              borderRadius: 2,
              px: 3,
              py: 1.5,
              fontWeight: 600,
              textTransform: "none",
              boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
              "&:hover": {
                bgcolor: "#4f46e5",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
              },
            }}
          >
            Crear Nuevo Proyecto
          </Button>
        )}
      </Box>

      {projects.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            bgcolor: "#f8fafc",
            borderRadius: 3,
            border: "2px dashed #d1d5db",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: "#6b7280",
              mb: 2,
              fontWeight: 600,
            }}
          >
            No hay proyectos disponibles
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#9ca3af",
              mb: 3,
            }}
          >
            Comienza creando tu primer proyecto
          </Typography>
          {user && (user.role === "admin" || user.role === "collab") && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => nav("/projects/new")}
              sx={{
                bgcolor: "#6366f1",
                "&:hover": {
                  bgcolor: "#4f46e5",
                },
              }}
            >
              Crear Proyecto
            </Button>
          )}
        </Box>
      ) : (
        <Grid container spacing={3}>
          {projects.map((p) => {
            let gridProps = {}

            if (projects.length === 1) {
              // 1 project takes full width
              gridProps = { xs: 12 }
            } else if (projects.length === 2) {
              // 2 projects take 50% each
              gridProps = { xs: 12, sm: 6 }
            } else {
              // 3+ projects: responsive grid with max 3 per row
              gridProps = { xs: 12, sm: 6, md: 4 }
            }

            return (
              <Grid item key={p.id} {...gridProps}>
                <ProjectCard project={p} onOpen={(id) => nav(`/projects/${id}`)} />
              </Grid>
            )
          })}
        </Grid>
      )}
    </Container>
  )
}
