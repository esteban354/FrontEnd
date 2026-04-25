import { useState } from "react";
import { Bell, Check, Trash2, CheckCircle2, Clock } from "lucide-react";

// Mock de notificaciones más extenso
const INITIAL_NOTIFICATIONS = [
  { id: 1, type: "info", text: "Valentina Torres se inscribió en Feria de Emprendimiento", time: "Hace 5 minutos", unread: true },
  { id: 2, type: "success", text: "Tu evento 'Hackathon 2025' ha sido aprobado", time: "Hace 2 horas", unread: true },
  { id: 3, type: "warning", text: "Se ha abierto un nuevo caso de bienestar (Prioridad Alta)", time: "Hace 1 día", unread: false },
  { id: 4, type: "info", text: "Tienes un nuevo mensaje en el seguimiento del caso CB-002", time: "Hace 2 días", unread: false },
  { id: 5, type: "success", text: "Asistencia registrada exitosamente: 45 aprendices", time: "Hace 3 días", unread: false },
];

export default function Notificaciones() {
  const [notifs, setNotifs] = useState(INITIAL_NOTIFICATIONS);

  const markAllRead = () => {
    setNotifs(notifs.map(n => ({ ...n, unread: false })));
  };

  const clearAll = () => {
    setNotifs([]);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Notificaciones</h1>
          <p className="text-gray-500 text-sm mt-1">
            Gestiona tus alertas y avisos del sistema
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={markAllRead}
            className="flex items-center gap-2 text-sm text-[#007AC0] hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors font-medium"
          >
            <Check size={16} />
            Marcar leídas
          </button>
          <button 
            onClick={clearAll}
            className="flex items-center gap-2 text-sm text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors font-medium"
          >
            <Trash2 size={16} />
            Limpiar
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {notifs.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell size={24} className="text-gray-300" />
            </div>
            <h3 className="text-gray-800 font-medium">No tienes notificaciones</h3>
            <p className="text-gray-500 text-sm mt-1">Estás al día con todas tus alertas.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {notifs.map((n) => (
              <div 
                key={n.id} 
                className={`p-5 flex gap-4 hover:bg-gray-50 transition-colors ${n.unread ? "bg-[#f4fbf0]" : ""}`}
              >
                <div className={`mt-0.5 flex-shrink-0 w-2 h-2 rounded-full ${n.unread ? "bg-[#39A900]" : "bg-transparent"}`}></div>
                <div className="flex-1">
                  <p className={`text-sm ${n.unread ? "text-gray-900 font-medium" : "text-gray-600"}`}>
                    {n.text}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-400">
                    <Clock size={12} />
                    <span>{n.time}</span>
                  </div>
                </div>
                {!n.unread && (
                  <CheckCircle2 size={16} className="text-gray-300" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
