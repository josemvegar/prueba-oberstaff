"use client"

import { Routes, Route, Navigate } from "react-router-dom"
import { Box, Container } from "@mui/material"
import { useAuth } from "./hooks/useAuth"
import NavBar from "./components/NavBar"
import Loading from "./components/Loading"
import Login from "./pages/Login"
import Register from "./pages/Register"
import ProjectsGrid from "./pages/ProjectsGrid"
import ProjectDetail from "./pages/ProjectDetail"
import TaskDetail from "./pages/TaskDetail"
import CreateProject from "./pages/CreateProject"
import EditProject from "./pages/EditProject" // Added EditProject import
import UserManagement from "./pages/UserManagement"
import ProtectedRoute from "./components/ProtectedRoute"
import AdminRoute from "./components/AdminRoute"
import "./App.css"

function App() {
  const { isAuthenticated, isInitialized } = useAuth()

  if (!isInitialized) {
    return <Loading />
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {isAuthenticated && <NavBar />}

      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/" replace /> : <Register />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <ProjectsGrid />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/new"
            element={
              <ProtectedRoute>
                <CreateProject />
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
            path="/projects/:id/edit"
            element={
              <ProtectedRoute>
                <EditProject />
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

          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <UserManagement />
              </AdminRoute>
            }
          />

          <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
        </Routes>
      </Container>
    </Box>
  )
}

export default App
