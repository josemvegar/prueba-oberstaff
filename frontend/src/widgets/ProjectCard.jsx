import React from "react";
import { Card, CardContent, Typography, CardActions, Button, AvatarGroup, Avatar } from "@mui/material";
import { formatDate } from "../utils/format";

export default function ProjectCard({ project, onOpen }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{project.name}</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>{project.description}</Typography>
        <Typography variant="caption">Inicio: {formatDate(project.start_date)} — Fin: {formatDate(project.end_date)}</Typography>
        <AvatarGroup max={4} sx={{ mt: 1 }}>
          {(project.members || []).map(m => <Avatar key={m.id}>{(m.first_name || m.username || "").charAt(0)}</Avatar>)}
        </AvatarGroup>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => onOpen(project.id)}>Abrir</Button>
      </CardActions>
    </Card>
  );
}
