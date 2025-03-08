"use client"

import { createTheme } from "@mui/material/styles"

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: "#4ADE80",
      dark: "#3EB76F",
    },
    secondary: {
      main: "#F3E8FF",
    },
    error: {
      main: "#EF4444",
      light: "#FEE2E2",
    },
    warning: {
      main: "#F59E0B",
      light: "#FEF9C3",
    },
    info: {
      main: "#3B82F6",
    },
    success: {
      main: "#10B981",
    },
    background: {
      default: "#FFFFFF",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#111827",
      secondary: "#6B7280",
      disabled: "#9CA3AF",
    },
    divider: "#E5E7EB",
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    button: {
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "none",
        },
      },
    },
  },
})

export default theme

