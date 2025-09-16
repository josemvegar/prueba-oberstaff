import React, { useEffect, useState } from "react";
import api from "../api/api";
import { Grid, Box, Button, Typography } from "@mui/material";
import ProjectCard from "../widgets/ProjectCard";
import Loading from "../components/Loading";
import { useAuth } from "../hooks/useAuth";
import { canCreateTask, canEditProject } from "../utils/permissions";
import { useNavigate } from "react-router-dom";

export default function ProjectsGrid() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    (async function load() {
      setLoading(true);
      try {
        const res = await api.get("/projects/");
        setProjects(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loading />;

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5">Proyectos</Typography>
        <Box>
          {user && (user.role === "admin" || user.role === "collab") && (
            <Button variant="contained" onClick={() => nav("/projects/new")}>Crear proyecto</Button>
          )}
        </Box>
      </Box>

      <Grid container spacing={2}>
        {projects.map(p => (
          <Grid item key={p.id} xs={12} sm={6} md={4}>
            <ProjectCard project={p} onOpen={(id) => nav(`/projects/${id}`)} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
