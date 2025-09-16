"use client"

import { useState } from "react"
import { Box, List, ListItem, ListItemText, TextField, Button, IconButton, Menu, MenuItem } from "@mui/material"
import { MoreVert as MoreVertIcon } from "@mui/icons-material"
import api from "../api/api"
import { useAuth } from "../hooks/useAuth"
import { canComment } from "../utils/permissions"
import { useNavigate } from 'react-router-dom';

export default function CommentsList({ task, comments: initial = [], onChange }) {
  const navigate = useNavigate();
  const onBack = () => {
    navigate(-1); // Navega a la página anterior
  };
  const [comments, setComments] = useState(initial)
  const [text, setText] = useState("")
  const [editingComment, setEditingComment] = useState(null)
  const [editText, setEditText] = useState("")
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedComment, setSelectedComment] = useState(null)
  const { user } = useAuth()

  async function submit() {
    try {
      const res = await api.post("/comments/", {
        task: task.id,
        message: text,
      })
      setComments((prev) => [res.data, ...prev])
      setText("")
      if (onChange) onChange()
    } catch (e) {
      console.error("Error creating comment:", e)
      alert("No puedes comentar en esta tarea.")
    }
  }

  const editComment = async (commentId) => {
    try {
      const res = await api.patch(`/comments/${commentId}/`, {
        message: editText,
      })
      setComments((prev) => prev.map((c) => (c.id === commentId ? res.data : c)))
      setEditingComment(null)
      setEditText("")
      if (onChange) onChange()
    } catch (e) {
      console.error("Error editing comment:", e)
      alert("Error al editar el comentario")
    }
  }

  const deleteComment = async (commentId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este comentario?")) {
      try {
        await api.delete(`/comments/${commentId}/`)
        setComments((prev) => prev.filter((c) => c.id !== commentId))
        if (onChange) onChange()
      } catch (e) {
        console.error("Error deleting comment:", e)
        alert("Error al eliminar el comentario")
      }
    }
  }

  const canEditDeleteComment = (comment) => {
    return user.role === "admin" || comment.author?.id === user.id
  }

  const handleMenuClick = (event, comment) => {
    setAnchorEl(event.currentTarget)
    setSelectedComment(comment)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedComment(null)
  }

  const startEdit = (comment) => {
    setEditingComment(comment.id)
    setEditText(comment.message)
    handleMenuClose()
  }

  return (
    <Box>
      <List>
        {comments.map((c) => (
          <ListItem key={c.id}>
            {editingComment === c.id ? (
              <Box sx={{ width: "100%" }}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                  <Button size="small" onClick={() => editComment(c.id)}>
                    Guardar
                  </Button>
                  <Button size="small" onClick={() => setEditingComment(null)}>
                    Cancelar
                  </Button>
                </Box>
              </Box>
            ) : (
              <>
                <ListItemText
                  primary={c.message}
                  secondary={`${c.author?.username || "Anon"} • ${new Date(c.created_at).toLocaleString()}`}
                />
                {canEditDeleteComment(c) && (
                  <IconButton onClick={(e) => handleMenuClick(e, c)}>
                    <MoreVertIcon />
                  </IconButton>
                )}
              </>
            )}
          </ListItem>
        ))}
      </List>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => startEdit(selectedComment)}>Editar</MenuItem>
        <MenuItem
          onClick={() => {
            deleteComment(selectedComment.id)
            handleMenuClose()
          }}
        >
          Eliminar
        </MenuItem>
      </Menu>

      <>
        {/* Si puede comentar, muestra TODO */}
        {canComment(user, task) ? (
          <>
            <TextField
              label="Nuevo comentario"
              fullWidth
              multiline
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            {/* Botones en línea */}
            <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
              <Button variant="contained" onClick={submit}>
                Comentar
              </Button>
              <Button variant="outlined" onClick={onBack}>
                Volver
              </Button>
            </Box>
          </>
        ) : (
          /* Si NO puede comentar, muestra SOLO el botón Volver */
          <Box sx={{ mt: 2 }}>
            <Button variant="outlined" onClick={onBack} fullWidth>
              Volver
            </Button>
          </Box>
        )}
      </>
    </Box>
  )
}
