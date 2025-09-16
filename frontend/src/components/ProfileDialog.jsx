import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import { useAuth } from "../hooks/useAuth";

export default function ProfileDialog({ open, onClose }) {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Perfil</DialogTitle>
      <DialogContent>
        <Typography><strong>Usuario:</strong> {user.username}</Typography>
        <Typography><strong>Nombre:</strong> {user.first_name} {user.last_name}</Typography>
        <Typography><strong>Email:</strong> {user.email}</Typography>
        <Typography><strong>Rol:</strong> {user.role}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}
