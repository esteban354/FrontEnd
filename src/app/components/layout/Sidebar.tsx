import { NavLink, useNavigate } from "react-router";
import {
  LayoutDashboard,
  CalendarDays,
  Calendar,
  PlusCircle,
  ClipboardList,
  BarChart3,
  Settings,
  CreditCard,
  BookOpen,
  LogOut,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  UserCheck,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useState } from "react";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  roles: string[];
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={18} />, roles: ["admin", "organizador", "instructor", "aprendiz", "estudiante"] },
  { label: "Eventos", path: "/eventos", icon: <CalendarDays size={18} />, roles: ["admin", "organizador", "instructor", "aprendiz", "estudiante"] },
  { label: "Calendario", path: "/calendario", icon: <Calendar size={18} />, roles: ["admin", "organizador", "instructor", "aprendiz", "estudiante"] },
  { label: "Crear Evento", path: "/eventos/crear", icon: <PlusCircle size={18} />, roles: ["admin", "organizador"] },
  { label: "Mis Inscripciones", path: "/inscripciones", icon: <BookOpen size={18} />, roles: ["aprendiz", "estudiante"] },
  { label: "Mi Carnet Digital", path: "/carnet", icon: <CreditCard size={18} />, roles: ["aprendiz", "estudiante"] },
  { label: "Control Asistencia", path: "/asistencia", icon: <CheckSquare size={18} />, roles: ["instructor", "admin"] },
  { label: "Aprendices", path: "/aprendices", icon: <UserCheck size={18} />, roles: ["instructor", "admin"] },
  { label: "Pre-registro", path: "/pre-registro", icon: <ClipboardList size={18} />, roles: ["instructor"] },
  { label: "Reportes", path: "/reportes", icon: <BarChart3 size={18} />, roles: ["admin", "organizador"] },
  { label: "Panel Admin", path: "/admin", icon: <Settings size={18} />, roles: ["admin"] },
  { label: "Configuración", path: "/configuracion", icon: <Settings size={18} />, roles: ["admin"] },
];

const ROLE_LABELS: Record<string, string> = {
  admin: "Administrador",
  organizador: "Organizador",
  instructor: "Instructor",
  aprendiz: "Aprendiz",
  estudiante: "Estudiante",
};

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-[#d4183d]",
  organizador: "bg-[#007AC0]",
  instructor: "bg-[#7c3aed]",
  aprendiz: "bg-[#39A900]",
  estudiante: "bg-[#39A900]",
};

export function Sidebar() {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const visibleNav = NAV_ITEMS.filter(
    (item) => currentUser && item.roles.includes(currentUser.role)
  );

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside
      className={`relative flex flex-col h-full bg-[#1C2B1A] text-white transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Toggle button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 z-10 bg-[#39A900] text-white rounded-full p-1 shadow-lg hover:bg-[#2d8a00] transition-colors"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Logo */}
      <div className={`flex items-center gap-3 p-4 border-b border-white/10 ${collapsed ? "justify-center" : ""}`}>
        <div className="flex-shrink-0 w-9 h-9 bg-[#39A900] rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">EBA</span>
        </div>
        {!collapsed && (
          <div>
            <div className="text-white font-semibold text-sm leading-tight">EBA</div>
            <div className="text-white/60 text-xs leading-tight">SENA Quindío</div>
          </div>
        )}
      </div>

      {/* User info */}
      {currentUser && (
        <div className={`p-3 border-b border-white/10 ${collapsed ? "flex justify-center" : ""}`}>
          {!collapsed ? (
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 ${ROLE_COLORS[currentUser.role] ?? "bg-gray-500"}`}>
                {currentUser.nombre[0]}{currentUser.apellido[0]}
              </div>
              <div className="min-w-0">
                <div className="text-white text-sm font-medium truncate">
                  {currentUser.nombre} {currentUser.apellido}
                </div>
                <span className={`inline-block text-white text-xs px-2 py-0.5 rounded-full mt-0.5 ${ROLE_COLORS[currentUser.role] ?? "bg-gray-500"}`}>
                  {ROLE_LABELS[currentUser.role] ?? currentUser.role}
                </span>
              </div>
            </div>
          ) : (
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold ${ROLE_COLORS[currentUser.role] ?? "bg-gray-500"}`}>
              {currentUser.nombre[0]}{currentUser.apellido[0]}
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {visibleNav.map((item) => (
          <NavLink
            key={item.path + item.label}
            to={item.path}
            end={item.path === "/eventos"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-all duration-150
              ${isActive
                ? "bg-[#39A900] text-white"
                : "text-white/70 hover:bg-white/10 hover:text-white"
              }
              ${collapsed ? "justify-center" : ""}
              `
            }
            title={collapsed ? item.label : undefined}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {!collapsed && <span className="text-sm truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className={`p-3 border-t border-white/10 ${collapsed ? "flex justify-center" : ""}`}>
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 text-white/70 hover:text-white hover:bg-white/10 rounded-lg px-3 py-2 transition-colors w-full ${collapsed ? "justify-center" : ""}`}
          title={collapsed ? "Cerrar sesión" : undefined}
        >
          <LogOut size={18} />
          {!collapsed && <span className="text-sm">Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  );
}
