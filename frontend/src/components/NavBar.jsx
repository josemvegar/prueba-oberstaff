"use client"

import { useState } from "react"
import { AppBar, Toolbar, Typography, Box, IconButton, Avatar, Button } from "@mui/material"
import { useAuth } from "../hooks/useAuth"
import { useNavigate } from "react-router-dom"
import ProfileDialog from "./ProfileDialog"

export default function NavBar() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
  }

  const handleLogoClick = () => {
    navigate("/")
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, cursor: "pointer" }} onClick={handleLogoClick}>
            LOGO
          </Typography>

          {user ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="body2" sx={{ mr: 1 }}>
                Hola, {user.first_name || user.username}
              </Typography>
              <IconButton onClick={() => setOpen(true)} color="inherit">
                <Avatar sx={{ width: 32, height: 32 }}>
                  {(user.first_name || user.username || "U").charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
              <Button color="inherit" onClick={() => setOpen(true)}>
                Perfil
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Salir
              </Button>
            </Box>
          ) : (
            <Box>
              <Button color="inherit" onClick={() => navigate("/login")}>
                Login
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <ProfileDialog open={open} onClose={() => setOpen(false)} />
    </>
  )
}
