import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import Loading from "../components/Loading";
import { Box, Paper, Typography, Button } from "@mui/material";
import CommentsList from "../widgets/CommentsList";
import { useAuth } from "../hooks/useAuth";
import { canViewTaskDetail } from "../utils/permissions";

export default function TaskDetail() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    (async function load() {
      setLoading(true);
      try {
        const res = await api.get(`/tasks/${id}/`);
        setTask(res.data);
        // load comments for task
        const cRes = await api.get(`/comments/?task=${id}`);
        setComments(cRes.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <Loading />;
  if (!task) return <Typography>Tarea no encontrada</Typography>;

  // frontend permission: collabs cannot view detail per your rule
  if (user.role === "collab" && !canViewTaskDetail(user, task)) {
    return <Typography color="error">No tienes permiso para ver el detalle de esta tarea.</Typography>;
  }

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h5">{task.name}</Typography>
        <Typography variant="body2" color="text.secondary">{task.description}</Typography>
        <Typography variant="caption">Estado: {task.status}</Typography>
      </Paper>

      <CommentsList task={task} comments={comments} onChange={() => { /* optional refresh */ }} />
    </Box>
  );
}
