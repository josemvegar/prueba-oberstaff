import React, { useState } from "react";
import { Box, TextField, Button, Paper, Typography, Link } from "@mui/material";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(username, password);
    } catch (err) {
      alert("Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center">
      <Paper sx={{ p: 4, width: 420 }}>
        <Typography variant="h5" mb={2}>Iniciar sesión</Typography>
        <form onSubmit={submit}>
          <TextField label="Usuario" fullWidth margin="normal" value={username} onChange={e => setUsername(e.target.value)} />
          <TextField label="Contraseña" type="password" fullWidth margin="normal" value={password} onChange={e => setPassword(e.target.value)} />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }} disabled={loading}>
            Ingresar
          </Button>
        </form>
        <Box mt={2}>
          <Link href="/register">¿No tienes cuenta? Regístrate</Link>
        </Box>
      </Paper>
    </Box>
  );
}
