import React, { useState } from "react";
import { Box, TextField, Button, Paper, Typography, MenuItem } from "@mui/material";
import { registerRequest } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", first_name: "", last_name: "", password: "", role: "viewer" });
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerRequest(form);
      alert("Registrado correctamente. Inicia sesión.");
      nav("/login");
    } catch (err) {
      alert("Error al registrar: " + (err.response?.data || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center">
      <Paper sx={{ p: 4, width: 480 }}>
        <Typography variant="h5" mb={2}>Registro</Typography>
        <form onSubmit={submit}>
          <TextField label="Usuario" fullWidth margin="normal" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
          <TextField label="Email" fullWidth margin="normal" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <TextField label="Nombre" fullWidth margin="normal" value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} />
          <TextField label="Apellido" fullWidth margin="normal" value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} />
          <TextField label="Contraseña" type="password" fullWidth margin="normal" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          <TextField select label="Rol" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} margin="normal" fullWidth>
            <MenuItem value="viewer">Viewer</MenuItem>
            <MenuItem value="collab">Collaborator</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </TextField>

          <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={loading}>Registrar</Button>
        </form>
      </Paper>
    </Box>
  );
}
