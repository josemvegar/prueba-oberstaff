"use client"
import { Card, CardContent, Typography, CardActions, Button, AvatarGroup, Avatar, Box, Chip } from "@mui/material"
import { Visibility as ViewIcon, Group as GroupIcon, CalendarToday as CalendarIcon } from "@mui/icons-material"
import { formatDate } from "../utils/format"

export default function ProjectCard({ project, onOpen }) {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#ffffff",
        borderRadius: 3,
        border: "1px solid #e5e7eb",
        boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
          borderColor: "#6366f1",
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "#1f2937",
              lineHeight: 1.3,
              flex: 1,
            }}
          >
            {project.name}
          </Typography>
          <Chip
            label="Activo"
            size="small"
            sx={{
              bgcolor: "#dcfce7",
              color: "#166534",
              fontWeight: 600,
              fontSize: "0.75rem",
            }}
          />
        </Box>

        <Typography
          variant="body2"
          sx={{
            color: "#6b7280",
            mb: 3,
            lineHeight: 1.5,
            display: "-webkit-box",
            WebkitLineClamp: 3, // Increased from 2 to 3 lines for better description display
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: "4.5rem", // Added minimum height to ensure consistent card heights
          }}
        >
          {project.description}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <CalendarIcon sx={{ fontSize: 16, color: "#9ca3af" }} />
          <Typography
            variant="caption"
            sx={{
              color: "#6b7280",
              fontWeight: 500,
            }}
          >
            {formatDate(project.start_date)} — {formatDate(project.end_date)}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <GroupIcon sx={{ fontSize: 16, color: "#9ca3af" }} />
          <Typography
            variant="caption"
            sx={{
              color: "#6b7280",
              fontWeight: 500,
              mr: 1,
            }}
          >
            Equipo:
          </Typography>
          <AvatarGroup
            max={3}
            sx={{
              "& .MuiAvatar-root": {
                width: 24,
                height: 24,
                fontSize: "0.75rem",
                bgcolor: "#6366f1",
                border: "2px solid #ffffff",
              },
            }}
          >
            {(project.members || []).map((m) => (
              <Avatar key={m.id}>{(m.first_name || m.username || "").charAt(0).toUpperCase()}</Avatar>
            ))}
          </AvatarGroup>
        </Box>
      </CardContent>

      <CardActions sx={{ p: 3, pt: 0 }}>
        <Button
          size="medium"
          onClick={() => onOpen(project.id)}
          startIcon={<ViewIcon />}
          sx={{
            bgcolor: "#f8fafc",
            color: "#374151",
            borderRadius: 2,
            px: 2,
            py: 1,
            fontWeight: 600,
            textTransform: "none",
            border: "1px solid #e5e7eb",
            "&:hover": {
              bgcolor: "#6366f1",
              color: "#ffffff",
              borderColor: "#6366f1",
            },
          }}
        >
          Ver Proyecto
        </Button>
      </CardActions>
    </Card>
  )
}
