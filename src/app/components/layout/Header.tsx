import { Bell, Search, Menu } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useState } from "react";
import { Link } from "react-router";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/eventos": "Calendario de Eventos",
  "/eventos/crear": "Crear Evento",
  "/inscripciones": "Mis Inscripciones",
  "/carnet": "Mi Carnet Digital",
  "/escanear-qr": "Escanear QR",
  "/asistencia": "Control de Asistencia",
  "/aprendices": "Aprendices",
  "/pre-registro": "Pre-registro",
  "/bienestar": "Bienestar al Aprendiz",
  "/paedp": "Ruta PAEDP",
  "/reportes": "Reportes y Estadísticas",
  "/admin": "Panel de Administración",
};

interface HeaderProps {
  currentPath: string;
}

const NOTIFICATIONS = [
  { id: 1, text: "Nuevo evento pendiente de aprobación", time: "hace 5 min", unread: true },
  { id: 2, text: "Valentina Torres se inscribió en Feria de Emprendimiento", time: "hace 20 min", unread: true },
  { id: 3, text: "Caso de bienestar #cb2 actualizado", time: "hace 1 hora", unread: false },
];

export function Header({ currentPath }: HeaderProps) {
  const { currentUser } = useApp();
  const [showNotifs, setShowNotifs] = useState(false);
  const title = Object.entries(PAGE_TITLES).find(([path]) => currentPath.startsWith(path))?.[1] || "EBA";

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between relative">
      <div className="flex items-center gap-4">
        <h1 className="text-gray-800 font-semibold">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:flex items-center">
          <Search size={16} className="absolute left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar..."
            className="bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#39A900]/30 focus:border-[#39A900] w-56 transition-all"
          />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#d4183d] rounded-full"></span>
          </button>

          {showNotifs && (
            <div className="absolute right-0 top-12 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <span className="font-semibold text-gray-800">Notificaciones</span>
                <span className="text-xs text-[#39A900] font-medium cursor-pointer">Marcar todas como leídas</span>
              </div>
              <div className="divide-y divide-gray-50">
                {NOTIFICATIONS.map((n) => (
                  <div key={n.id} className={`p-4 hover:bg-gray-50 cursor-pointer ${n.unread ? "bg-[#f0f9e8]" : ""}`}>
                    <p className="text-sm text-gray-700">{n.text}</p>
                    <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                  </div>
                ))}
              </div>
              <div className="p-3 text-center border-t border-gray-100">
                <Link to="/notificaciones" onClick={() => setShowNotifs(false)} className="text-sm text-[#007AC0] hover:underline font-medium">
                  Ver todas las notificaciones
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User avatar */}
        {currentUser && (
          <Link to="/perfil" className="flex items-center gap-2 hover:bg-gray-50 p-1.5 rounded-xl transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-[#39A900] flex items-center justify-center text-white text-xs font-semibold">
              {currentUser.nombre[0]}{currentUser.apellido[0]}
            </div>
            <span className="text-sm text-gray-700 hidden md:block font-medium">
              {currentUser.nombre}
            </span>
          </Link>
        )}
      </div>

      {/* Overlay for notifications */}
      {showNotifs && (
        <div className="fixed inset-0 z-40" onClick={() => setShowNotifs(false)} />
      )}
    </header>
  );
}
