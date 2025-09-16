import React from "react";
import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box component="footer" sx={{ py: 3, textAlign: "center", bgcolor: "background.paper" }}>
      <Typography variant="body2">© {new Date().getFullYear()} Tu Empresa. Todos los derechos reservados.</Typography>
    </Box>
  );
}
