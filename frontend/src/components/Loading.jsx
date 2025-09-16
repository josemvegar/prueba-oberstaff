import { Box, CircularProgress, Typography } from "@mui/material"

export default function Loading() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 8,
        gap: 2,
      }}
    >
      <CircularProgress
        size={48}
        thickness={4}
        sx={{
          color: "#6366f1",
        }}
      />
      <Typography
        variant="body1"
        sx={{
          color: "#6b7280",
          fontWeight: 500,
        }}
      >
        Cargando...
      </Typography>
    </Box>
  )
}
