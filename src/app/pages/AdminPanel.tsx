import { useState } from "react";
import { USERS, EVENTOS, CASOS_BIENESTAR } from "../data/domain";
import {
  Users, CalendarDays, Heart, CheckCircle2, XCircle,
  Settings, PlusCircle, Search, Filter, Edit2, Trash2, Eye
} from "lucide-react";

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-red-100 text-red-600",
  organizador: "bg-blue-100 text-blue-700",
  instructor: "bg-purple-100 text-purple-700",
  aprendiz: "bg-green-100 text-green-700",};

const ROLE_LABELS: Record<string, string> = {
  admin: "Administrador",
  organizador: "Organizador",
  instructor: "Instructor",
  aprendiz: "Aprendiz",};

type Tab = "usuarios" | "eventos" | "bienestar" | "configuracion";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<Tab>("usuarios");
  const [search, setSearch] = useState("");
  const [showNewUser, setShowNewUser] = useState(false);

  const filteredUsers = USERS.filter(u =>
    `${u.nombre} ${u.apellido} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

  const pendingEvents = EVENTOS.filter(e => e.estado === "pendiente");

  const TABS: { key: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    { key: "usuarios", label: "Usuarios", icon: <Users size={16} />, count: USERS.length },
    { key: "eventos", label: "Eventos", icon: <CalendarDays size={16} />, count: EVENTOS.length },
    { key: "bienestar", label: "Bienestar", icon: <Heart size={16} />, count: CASOS_BIENESTAR.length },
    { key: "configuracion", label: "Configuración", icon: <Settings size={16} /> },
  ];

  return (
    <div className="space-y-6">
      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Usuarios registrados", value: USERS.length, icon: <Users size={20} className="text-white" />, color: "bg-[#007AC0]" },
          { label: "Eventos totales", value: EVENTOS.length, icon: <CalendarDays size={20} className="text-white" />, color: "bg-[#39A900]" },
          { label: "Pendientes aprob.", value: pendingEvents.length, icon: <CheckCircle2 size={20} className="text-white" />, color: "bg-[#f59e0b]" },
          { label: "Casos bienestar", value: CASOS_BIENESTAR.length, icon: <Heart size={20} className="text-white" />, color: "bg-[#d4183d]" },
        ].map(s => (
          <div key={s.label} className={`${s.color} text-white rounded-xl p-4 flex items-center gap-3`}>
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">{s.icon}</div>
            <div>
              <div className="font-bold text-xl">{s.value}</div>
              <div className="text-white/80 text-xs">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Tab headers */}
        <div className="flex border-b border-gray-100 bg-gray-50">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm transition-colors relative ${
                activeTab === tab.key
                  ? "text-[#39A900] bg-white font-medium"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.count !== undefined && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? "bg-[#e8f5e2] text-[#39A900]" : "bg-gray-200 text-gray-500"}`}>
                  {tab.count}
                </span>
              )}
              {activeTab === tab.key && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#39A900]"></div>}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="p-6">
          {/* USERS TAB */}
          {activeTab === "usuarios" && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3 items-center">
                <div className="relative flex-1 min-w-48">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar usuario..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39A900]/30"
                  />
                </div>
                <button
                  onClick={() => setShowNewUser(true)}
                  className="flex items-center gap-2 bg-[#39A900] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#2d8a00] transition-colors"
                >
                  <PlusCircle size={16} /> Registrar usuario
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left text-gray-500 py-3 px-3 font-medium">Usuario</th>
                      <th className="text-left text-gray-500 py-3 px-3 font-medium">Email</th>
                      <th className="text-left text-gray-500 py-3 px-3 font-medium">Rol</th>
                      <th className="text-left text-gray-500 py-3 px-3 font-medium">Documento</th>
                      <th className="text-right text-gray-500 py-3 px-3 font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredUsers.map(user => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold ${ROLE_COLORS[user.role].replace("text-", "bg-").replace("100", "500")}`}>
                              {user.nombre[0]}{user.apellido[0]}
                            </div>
                            <div>
                              <div className="text-gray-800 font-medium">{user.nombre} {user.apellido}</div>
                              {user.ficha && <div className="text-gray-400 text-xs">Ficha: {user.ficha}</div>}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-gray-600">{user.email}</td>
                        <td className="py-3 px-3">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${ROLE_COLORS[user.role]}`}>
                            {ROLE_LABELS[user.role]}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-gray-500 font-mono text-xs">{user.documento}</td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-1.5 text-gray-400 hover:text-[#007AC0] rounded-lg hover:bg-blue-50 transition-colors">
                              <Eye size={15} />
                            </button>
                            <button className="p-1.5 text-gray-400 hover:text-[#39A900] rounded-lg hover:bg-green-50 transition-colors">
                              <Edit2 size={15} />
                            </button>
                            <button className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors">
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* EVENTS TAB */}
          {activeTab === "eventos" && (
            <div className="space-y-4">
              {pendingEvents.length > 0 && (
                <div>
                  <h4 className="text-gray-700 font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#f59e0b]" />
                    Pendientes de aprobación
                    <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full">{pendingEvents.length}</span>
                  </h4>
                  <div className="space-y-3">
                    {pendingEvents.map(ev => (
                      <div key={ev.id} className="flex items-center gap-4 p-4 bg-yellow-50 border border-yellow-100 rounded-xl">
                        <img src={ev.imagen} alt={ev.titulo} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-gray-800 font-medium">{ev.titulo}</div>
                          <div className="text-gray-500 text-xs mt-0.5">{ev.fecha} · {ev.lugar}</div>
                          <div className="text-gray-400 text-xs">{ev.inscritos}/{ev.capacidad} inscritos</div>
                        </div>
                        <div className="flex gap-2">
                          <button className="flex items-center gap-1.5 bg-[#39A900] text-white px-3 py-1.5 rounded-lg text-xs hover:bg-[#2d8a00] transition-colors">
                            <CheckCircle2 size={13} /> Aprobar
                          </button>
                          <button className="flex items-center gap-1.5 bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs hover:bg-red-200 transition-colors">
                            <XCircle size={13} /> Rechazar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <h4 className="text-gray-700 font-semibold flex items-center gap-2 mt-4">
                <CalendarDays size={16} className="text-[#007AC0]" /> Todos los eventos
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left text-gray-500 py-3 px-3 font-medium">Evento</th>
                      <th className="text-left text-gray-500 py-3 px-3 font-medium">Fecha</th>
                      <th className="text-left text-gray-500 py-3 px-3 font-medium">Inscritos</th>
                      <th className="text-left text-gray-500 py-3 px-3 font-medium">Estado</th>
                      <th className="text-right text-gray-500 py-3 px-3 font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {EVENTOS.map(ev => {
                      const stateColors: Record<string, string> = {
                        pendiente: "bg-yellow-100 text-yellow-700",
                        iniciado: "bg-green-100 text-green-700",
                        cancelado: "bg-red-100 text-red-600",
                        terminado: "bg-gray-100 text-gray-600",
                      };
                      return (
                        <tr key={ev.id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-3">
                            <div className="font-medium text-gray-800">{ev.titulo}</div>
                            <div className="text-gray-400 text-xs">{ev.categoria}</div>
                          </td>
                          <td className="py-3 px-3 text-gray-600">{ev.fecha}</td>
                          <td className="py-3 px-3 text-gray-600">{ev.inscritos}/{ev.capacidad}</td>
                          <td className="py-3 px-3">
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${stateColors[ev.estado]}`}>
                              {ev.estado}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button className="p-1.5 text-gray-400 hover:text-[#007AC0] rounded-lg hover:bg-blue-50 transition-colors"><Eye size={15} /></button>
                              <button className="p-1.5 text-gray-400 hover:text-[#39A900] rounded-lg hover:bg-green-50 transition-colors"><Edit2 size={15} /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* BIENESTAR TAB */}
          {activeTab === "bienestar" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                {[
                  { label: "Total casos", value: CASOS_BIENESTAR.length, color: "text-[#007AC0]" },
                  { label: "Abiertos", value: CASOS_BIENESTAR.filter(c => c.estado === "abierto").length, color: "text-blue-600" },
                  { label: "Seguimiento", value: CASOS_BIENESTAR.filter(c => c.estado === "en_seguimiento").length, color: "text-purple-600" },                ].map(s => (
                  <div key={s.label} className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
                    <div className={`font-bold text-2xl ${s.color}`}>{s.value}</div>
                    <div className="text-gray-500 text-xs mt-1">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                {CASOS_BIENESTAR.map(caso => {
                  const aprendiz = USERS.find(u => u.id === caso.aprendizId);
                  const estadoColors: Record<string, string> = {
                    abierto: "bg-blue-100 text-blue-700",
                    en_seguimiento: "bg-purple-100 text-purple-700",
                    cerrado: "bg-gray-100 text-gray-600",
                    derivado_Seguimiento: "bg-red-100 text-red-700",
                  };
                  const prioColors: Record<string, string> = {
                    urgente: "text-red-600", alta: "text-orange-600", media: "text-yellow-600", baja: "text-green-600",
                  };
                  return (
                    <div key={caso.id} className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-lg">
                        {caso.tipo === "psicologico" ? "🧠" : caso.tipo === "social" ? "👥" : caso.tipo === "academico" ? "📚" : caso.tipo === "familiar" ? "👨‍👩‍👦" : caso.tipo === "economico" ? "💰" : "🏥"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-gray-800 font-medium text-sm">{caso.titulo}</div>
                        <div className="text-gray-500 text-xs mt-0.5">
                          {aprendiz?.nombre} {aprendiz?.apellido} · {caso.fechaApertura}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${estadoColors[caso.estado]}`}>
                          {caso.estado.replace("_", " ")}
                        </span>
                        <span className={`text-xs font-medium ${prioColors[caso.prioridad]}`}>
                          Prioridad: {caso.prioridad}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* CONFIG TAB */}
          {activeTab === "configuracion" && (
            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { title: "Información del Centro", desc: "Nombre, logo y datos institucionales", icon: "🏛️" },
                  { title: "Categorías de eventos", desc: "Gestiona los tipos de eventos disponibles", icon: "🏷️" },
                  { title: "Notificaciones", desc: "Configura alertas y recordatorios", icon: "🔔" },
                  { title: "Permisos y roles", desc: "Define los permisos por rol de usuario", icon: "🔐" },
                  { title: "Plantillas de reportes", desc: "Personaliza los reportes de asistencia", icon: "📊" },                ].map(c => (
                  <div key={c.title} className="flex items-start gap-4 p-4 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="text-2xl">{c.icon}</div>
                    <div className="flex-1">
                      <div className="text-gray-800 font-medium text-sm">{c.title}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{c.desc}</div>
                    </div>
                    <Settings size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New user modal */}
      {showNewUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-gray-800 font-semibold">Registrar nuevo usuario</h3>
              <button onClick={() => setShowNewUser(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-700 text-sm block mb-1">Nombre</label>
                  <input type="text" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#39A900]/30" />
                </div>
                <div>
                  <label className="text-gray-700 text-sm block mb-1">Apellido</label>
                  <input type="text" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="text-gray-700 text-sm block mb-1">Correo electrónico</label>
                <input type="email" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:outline-none" />
              </div>
              <div>
                <label className="text-gray-700 text-sm block mb-1">Documento de identidad</label>
                <input type="text" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:outline-none" />
              </div>
              <div>
                <label className="text-gray-700 text-sm block mb-1">Rol</label>
                <select className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:outline-none text-gray-700">
                  <option value="">Seleccionar rol</option>
                  {Object.entries(ROLE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
              <button onClick={() => setShowNewUser(false)} className="px-5 py-2.5 border border-gray-200 rounded-xl text-gray-700 text-sm">Cancelar</button>
              <button onClick={() => setShowNewUser(false)} className="px-5 py-2.5 bg-[#39A900] text-white rounded-xl text-sm hover:bg-[#2d8a00]">Registrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
