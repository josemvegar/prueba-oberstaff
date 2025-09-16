import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Container, CssBaseline } from "@mui/material";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProjectsGrid from "./pages/ProjectsGrid";
import ProjectDetail from "./pages/ProjectDetail";
import TaskDetail from "./pages/TaskDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";

export default function App() {
  const { isInitialized } = useAuth(); // waits auth init (loads token->me)

  if (!isInitialized) return null; // or show a loader

  return (
    <>
      <CssBaseline />
      <NavBar />
      <Container sx={{ py: 3, minHeight: "70vh" }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <ProjectsGrid />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/:id"
            element={
              <ProtectedRoute>
                <ProjectDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks/:id"
            element={
              <ProtectedRoute>
                <TaskDetail />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Container>
      <Footer />
    </>
  );
}
