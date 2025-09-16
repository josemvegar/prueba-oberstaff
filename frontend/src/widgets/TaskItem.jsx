import React from "react";
import { ListItem, ListItemText, Chip, IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { formatDate } from "../utils/format";

export default function TaskItem({ task, onView, allowView }) {
  return (
    <ListItem
      secondaryAction={
        <>
          <Chip label={task.status} size="small" sx={{ mr: 1 }} />
          {allowView && <IconButton edge="end" onClick={() => onView(task.id)}><VisibilityIcon /></IconButton>}
        </>
      }
    >
      <ListItemText primary={task.name} secondary={`Asignado: ${task.assigned_to ? task.assigned_to.username : "—"} • Vence: ${formatDate(task.due_date)}`} />
    </ListItem>
  );
}
