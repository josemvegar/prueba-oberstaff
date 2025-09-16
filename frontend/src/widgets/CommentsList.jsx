import React, { useState } from "react";
import { Box, List, ListItem, ListItemText, TextField, Button } from "@mui/material";
import api from "../api/api";
import { useAuth } from "../hooks/useAuth";
import { canComment } from "../utils/permissions";

export default function CommentsList({ task, comments: initial = [], onChange }) {
  const [comments, setComments] = useState(initial);
  const [text, setText] = useState("");
  const { user } = useAuth();

  async function submit() {
    try {
      const res = await api.post("/comments/", { task: task.id, message: text });
      setComments(prev => [res.data, ...prev]);
      setText("");
      if (onChange) onChange();
    } catch (e) {
      alert("No puedes comentar en esta tarea.");
    }
  }

  return (
    <Box>
      <List>
        {comments.map(c => (
          <ListItem key={c.id}>
            <ListItemText primary={c.message} secondary={`${c.author?.username || "Anon"} • ${new Date(c.created_at).toLocaleString()}`} />
          </ListItem>
        ))}
      </List>

      {canComment(user, task) && (
        <>
          <TextField label="Nuevo comentario" fullWidth multiline rows={3} value={text} onChange={e => setText(e.target.value)} />
          <Button sx={{ mt: 1 }} variant="contained" onClick={submit}>Comentar</Button>
        </>
      )}
    </Box>
  );
}
