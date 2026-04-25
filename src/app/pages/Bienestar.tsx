import { useState } from "react";
import { useNavigate } from "react-router";
import { CASOS_BIENESTAR, TIPO_BIENESTAR_LABELS, ESTADO_BIENESTAR_LABELS, USERS } from "../data/mockData";
import { useApp } from "../context/AppContext";
import {
  Heart, Search, Filter, PlusCircle, ArrowRight, AlertCircle, Clock,
  CheckCircle2, ShieldAlert, User, Calendar, MessageSquare
} from "lucide-react";

const PRIORIDAD_COLORS: Record<string, string> = {
  urgente: "bg-red-100 text-red-600 border-red-200",
  alta: "bg-orange-100 text-orange-600 border-orange-200",
  media: "bg-yellow-100 text-yellow-700 border-yellow-200",
  baja: "bg-green-100 text-green-700 border-green-200",
};

const ESTADO_COLORS: Record<string, string> = {
  abierto: "bg-blue-100 text-blue-700",
  en_seguimiento: "bg-purple-100 text-purple-700",
  cerrado: "bg-gray-100 text-gray-600",
  derivado_paedp: "bg-red-100 text-red-700",
};

const TIPO_COLORS: Record<string, string> = {
  psicologico: "bg-[#f3eeff] text-[#7c3aed]",
  social: "bg-[#e0f0fa] text-[#007AC0]",
  academico: "bg-[#e8f5e2] text-[#39A900]",
  familiar: "bg-[#fff7e0] text-[#f59e0b]",
  economico: "bg-orange-50 text-orange-600",
  salud: "bg-red-50 text-red-600",
};

const TIPO_ICONS: Record<string, React.ReactNode> = {
  psicologico: "🧠",
  social: "👥",
  academico: "📚",
  familiar: "👨‍👩‍👦",
  economico: "💰",
  salud: "🏥",
};

export default function Bienestar() {
  const navigate = useNavigate();
  const { currentUser } = useApp();
  const [search, setSearch] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("todos");
  const [tipoFilter, setTipoFilter] = useState("todos");
  const [showForm, setShowForm] = useState(false);

  const canManage = currentUser?.role === "admin" || currentUser?.role === "organizador";
  const isAprendiz = currentUser?.role === "aprendiz";

  const casos = isAprendiz
    ? CASOS_BIENESTAR.filter((c) => c.aprendizId === currentUser?.id)
    : CASOS_BIENESTAR;

  const filtered = casos.filter((c) => {
    const aprendiz = USERS.find((u) => u.id === c.aprendizId);
    const matchSearch = c.titulo.toLowerCase().includes(search.toLowerCase()) ||
      (aprendiz && `${aprendiz.nombre} ${aprendiz.apellido}`.toLowerCase().includes(search.toLowerCase()));
    const matchEstado = estadoFilter === "todos" || c.estado === estadoFilter;
    const matchTipo = tipoFilter === "todos" || c.tipo === tipoFilter;
    return matchSearch && matchEstado && matchTipo;
  });

  const stats = {
    total: casos.length,
    abiertos: casos.filter(c => c.estado === "abierto").length,
    seguimiento: casos.filter(c => c.estado === "en_seguimiento").length,
    paedp: casos.filter(c => c.paedpActivado).length,
    cerrados: casos.filter(c => c.estado === "cerrado").length,
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      {canManage && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total casos", value: stats.total, color: "bg-[#007AC0]", text: "text-white" },
            { label: "Abiertos", value: stats.abiertos, color: "bg-blue-50", text: "text-blue-700", badge: "border border-blue-200" },
            { label: "En seguimiento", value: stats.seguimiento, color: "bg-purple-50", text: "text-purple-700", badge: "border border-purple-200" },
            { label: "Activos PAEDP", value: stats.paedp, color: "bg-red-50", text: "text-red-700", badge: "border border-red-200" },
          ].map((s) => (
            <div key={s.label} className={`${s.color} ${s.badge || ""} rounded-xl p-4 flex items-center justify-between`}>
              <div>
                <div className={`${s.text} text-xs opacity-80`}>{s.label}</div>
                <div className={`${s.text} font-bold mt-0.5`} style={{ fontSize: "1.75rem" }}>{s.value}</div>
              </div>
              <Heart size={24} className={`${s.text} opacity-30`} />
            </div>
          ))}
        </div>
      )}

      {/* Header actions */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="flex-1">
          {isAprendiz && (
            <p className="text-gray-500 text-sm">
              {filtered.length === 0 ? "No tienes casos de bienestar registrados" : `${filtered.length} caso(s) registrado(s)`}
            </p>
          )}
        </div>
        {canManage && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-[#39A900] hover:bg-[#2d8a00] text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            <PlusCircle size={16} /> Nuevo caso
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={canManage ? "Buscar por aprendiz o descripción..." : "Buscar..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39A900]/30 focus:border-[#39A900]"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <select value={estadoFilter} onChange={(e) => setEstadoFilter(e.target.value)} className="text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none text-gray-700">
            <option value="todos">Todos los estados</option>
            {Object.entries(ESTADO_BIENESTAR_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <select value={tipoFilter} onChange={(e) => setTipoFilter(e.target.value)} className="text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none text-gray-700">
            <option value="todos">Todos los tipos</option>
            {Object.entries(TIPO_BIENESTAR_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
      </div>

      {/* Cases */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <Heart size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No se encontraron casos de bienestar</p>
          {isAprendiz && (
            <p className="text-gray-400 text-sm mt-2">Si necesitas apoyo, acércate al área de Bienestar del Centro</p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((caso) => {
            const aprendiz = USERS.find((u) => u.id === caso.aprendizId);
            return (
              <div
                key={caso.id}
                onClick={() => navigate(`/bienestar/${caso.id}`)}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 cursor-pointer hover:shadow-md hover:border-[#39A900]/30 transition-all"
              >
                <div className="flex items-start gap-4">
                  {/* Type icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${TIPO_COLORS[caso.tipo]}`}>
                    {TIPO_ICONS[caso.tipo]}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${TIPO_COLORS[caso.tipo]}`}>
                        {TIPO_BIENESTAR_LABELS[caso.tipo]}
                      </span>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${ESTADO_COLORS[caso.estado]}`}>
                        {ESTADO_BIENESTAR_LABELS[caso.estado]}
                      </span>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${PRIORIDAD_COLORS[caso.prioridad]}`}>
                        Prioridad: {caso.prioridad}
                      </span>
                      {caso.paedpActivado && (
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 font-medium flex items-center gap-1">
                          <ShieldAlert size={11} /> PAEDP
                        </span>
                      )}
                    </div>

                    <h3 className="text-gray-800 font-semibold line-clamp-1">{caso.titulo}</h3>
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">{caso.descripcion}</p>

                    <div className="flex flex-wrap items-center gap-4 mt-3">
                      {canManage && aprendiz && (
                        <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                          <User size={12} />
                          <span>{aprendiz.nombre} {aprendiz.apellido}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                        <Calendar size={12} />
                        <span>Apertura: {caso.fechaApertura}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                        <MessageSquare size={12} />
                        <span>{caso.seguimientos.length} seguimiento(s)</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                        <Clock size={12} />
                        <span>Último: {caso.fechaUltimoSeguimiento}</span>
                      </div>
                    </div>
                  </div>

                  <ArrowRight size={18} className="text-gray-300 flex-shrink-0 mt-1" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* New case form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-gray-800 font-semibold">Nuevo caso de bienestar</h3>
              <p className="text-gray-500 text-sm mt-1">Registra un nuevo caso de acompañamiento</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-gray-700 text-sm block mb-1.5">Aprendiz</label>
                <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#39A900]/30 focus:border-[#39A900] text-gray-700">
                  <option value="">Seleccionar aprendiz</option>
                  {USERS.filter(u => u.role === "aprendiz").map(u => (
                    <option key={u.id} value={u.id}>{u.nombre} {u.apellido} – Ficha {u.ficha}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-gray-700 text-sm block mb-1.5">Tipo de caso</label>
                <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#39A900]/30 focus:border-[#39A900] text-gray-700">
                  <option value="">Seleccionar tipo</option>
                  {Object.entries(TIPO_BIENESTAR_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="text-gray-700 text-sm block mb-1.5">Prioridad</label>
                <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#39A900]/30 focus:border-[#39A900] text-gray-700">
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                  <option value="urgente">Urgente</option>
                </select>
              </div>
              <div>
                <label className="text-gray-700 text-sm block mb-1.5">Título del caso</label>
                <input type="text" placeholder="Ej: Dificultades académicas..." className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#39A900]/30 focus:border-[#39A900]" />
              </div>
              <div>
                <label className="text-gray-700 text-sm block mb-1.5">Descripción inicial</label>
                <textarea rows={3} placeholder="Describe brevemente la situación..." className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#39A900]/30 focus:border-[#39A900] resize-none" />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
              <button onClick={() => setShowForm(false)} className="px-5 py-2.5 border border-gray-200 rounded-xl text-gray-700 text-sm hover:bg-gray-50">Cancelar</button>
              <button onClick={() => setShowForm(false)} className="px-5 py-2.5 bg-[#39A900] text-white rounded-xl text-sm hover:bg-[#2d8a00]">Crear caso</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
