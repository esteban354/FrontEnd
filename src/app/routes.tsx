import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "./components/layout/Layout";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Eventos from "./pages/Eventos";
import EventoDetalle from "./pages/EventoDetalle";
import CrearEvento from "./pages/CrearEvento";
import Bienestar from "./pages/Bienestar";
import BienestarDetalle from "./pages/BienestarDetalle";
import Carnet from "./pages/Carnet";
import Asistencia from "./pages/Asistencia";
import Inscripciones from "./pages/Inscripciones";
import AdminPanel from "./pages/AdminPanel";
import Reportes from "./pages/Reportes";
import Aprendices from "./pages/Aprendices";
import PreRegistro from "./pages/PreRegistro";
import Perfil from "./pages/Perfil";
import Notificaciones from "./pages/Notificaciones";
import Configuracion from "./pages/Configuracion";
import NotFound from "./pages/NotFound";
import Forbidden from "./pages/Forbidden";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/403",
    element: <Forbidden />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      
      // Rutas públicas dentro del sistema (requieren login pero sin rol específico)
      {
        element: <ProtectedRoute />,
        children: [
          { path: "dashboard", element: <Dashboard /> },
          { path: "eventos", element: <Eventos /> },
          { path: "eventos/:id", element: <EventoDetalle /> },
          { path: "perfil", element: <Perfil /> },
          { path: "notificaciones", element: <Notificaciones /> },
        ]
      },

      // Rutas de Creación de Eventos (Solo Admin y Organizador)
      {
        element: <ProtectedRoute allowedRoles={["admin", "organizador"]} />,
        children: [
          { path: "eventos/crear", element: <CrearEvento /> },
        ]
      },

      // Rutas de Bienestar (Admin, Organizador, Aprendiz)
      {
        element: <ProtectedRoute allowedRoles={["admin", "organizador", "aprendiz"]} />,
        children: [
          { path: "bienestar", element: <Bienestar /> },
          { path: "bienestar/:id", element: <BienestarDetalle /> },
        ]
      },

      // Rutas de Reportes y Configuracion (Admin y Organizador)
      {
        element: <ProtectedRoute allowedRoles={["admin", "organizador"]} />,
        children: [          { path: "reportes", element: <Reportes /> },
          { path: "configuracion", element: <Configuracion /> },
        ]
      },

      // Rutas exclusivas de Aprendiz
      {
        element: <ProtectedRoute allowedRoles={["aprendiz"]} />,
        children: [
          { path: "carnet", element: <Carnet /> },          { path: "inscripciones", element: <Inscripciones /> },
        ]
      },

      // Rutas exclusivas de Instructor y Admin
      {
        element: <ProtectedRoute allowedRoles={["instructor", "admin"]} />,
        children: [
          { path: "asistencia", element: <Asistencia /> },
          { path: "aprendices", element: <Aprendices /> },
          { path: "pre-registro", element: <PreRegistro /> },
        ]
      },

      // Rutas exclusivas de Admin
      {
        element: <ProtectedRoute allowedRoles={["admin"]} />,
        children: [
          { path: "admin", element: <AdminPanel /> },
        ]
      },

      { path: "*", element: <NotFound /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
