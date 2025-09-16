import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Box, IconButton, Avatar, Button } from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import ProfileDialog from "./ProfileDialog";

export default function NavBar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            LOGO
          </Typography>

          {user ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton onClick={() => setOpen(true)} color="inherit">
                <Avatar>{(user.first_name || user.username || "U").charAt(0)}</Avatar>
              </IconButton>
              <Button color="inherit" onClick={() => setOpen(true)}>
                Perfil
              </Button>
              <Button color="inherit" onClick={logout}>
                Salir
              </Button>
            </Box>
          ) : (
            <Box>
              <Button color="inherit" href="/login">Login</Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <ProfileDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
