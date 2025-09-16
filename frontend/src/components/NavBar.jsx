"use client"

import { useState } from "react"
import { AppBar, Toolbar, Typography, Box, IconButton, Avatar, Button, Chip, Menu, MenuItem } from "@mui/material"
import { useAuth } from "../hooks/useAuth"
import { useNavigate } from "react-router-dom"
import { isAdmin } from "../utils/permissions"
import ProfileDialog from "./ProfileDialog"

export default function NavBar() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [adminMenuAnchor, setAdminMenuAnchor] = useState(null)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
  }

  const handleLogoClick = () => {
    navigate("/")
  }

  const handleAdminMenuOpen = (event) => {
    setAdminMenuAnchor(event.currentTarget)
  }

  const handleAdminMenuClose = () => {
    setAdminMenuAnchor(null)
  }

  const handleUserManagement = () => {
    navigate("/admin/users")
    handleAdminMenuClose()
  }

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "error"
      case "collab":
        return "warning"
      case "viewer":
        return "info"
      default:
        return "default"
    }
  }

  return (
    <>
      <AppBar
        position="static"
        sx={{
          bgcolor: "#374151",
          boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
          borderBottom: "1px solid #d1d5db",
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <Typography
            variant="h5"
            component="div"
            sx={{
              flexGrow: 1,
              cursor: "pointer",
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "-0.025em",
            }}
            onClick={handleLogoClick}
          >
            ProjectHub
          </Typography>

          {user ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body2" sx={{ color: "#f8fafc", fontWeight: 500 }}>
                  Hola, {user.first_name || user.username}
                </Typography>
                <Chip
                  label={user.role}
                  size="small"
                  color={getRoleColor(user.role)}
                  sx={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    textTransform: "capitalize",
                  }}
                />
              </Box>

              {isAdmin(user) && (
                <Button
                  color="inherit"
                  onClick={handleAdminMenuOpen}
                  sx={{
                    color: "#f8fafc",
                    fontWeight: 500,
                    textTransform: "none",
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                >
                  Admin
                </Button>
              )}

              <IconButton onClick={() => setOpen(true)} sx={{ p: 0.5 }}>
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: "#6366f1",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                  }}
                >
                  {(user.first_name || user.username || "U").charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>

              <Button
                color="inherit"
                onClick={() => setOpen(true)}
                sx={{
                  color: "#f8fafc",
                  fontWeight: 500,
                  textTransform: "none",
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                Perfil
              </Button>

              <Button
                color="inherit"
                onClick={handleLogout}
                sx={{
                  color: "#f8fafc",
                  fontWeight: 500,
                  textTransform: "none",
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                Salir
              </Button>
            </Box>
          ) : (
            <Box>
              <Button
                color="inherit"
                onClick={() => navigate("/login")}
                sx={{
                  color: "#f8fafc",
                  fontWeight: 500,
                  textTransform: "none",
                }}
              >
                Iniciar Sesión
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={adminMenuAnchor}
        open={Boolean(adminMenuAnchor)}
        onClose={handleAdminMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleUserManagement}>Gestión de Usuarios</MenuItem>
      </Menu>

      <ProfileDialog open={open} onClose={() => setOpen(false)} />
    </>
  )
}
