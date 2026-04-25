import { useState } from "react";
import { useNavigate } from "react-router";
import { EVENTOS, CATEGORIAS_LABELS, ESTADO_EVENTO_LABELS } from "../data/mockData";
import { useApp } from "../context/AppContext";
import {
  CalendarDays, List, MapPin, Clock, Users, Filter, Search, PlusCircle, ArrowRight, Tag
} from "lucide-react";

type ViewMode = "grid" | "list" | "calendar";

const CATEGORIA_COLORS: Record<string, string> = {
  academico: "bg-[#e8f5e2] text-[#39A900]",
  deportivo: "bg-[#e0f0fa] text-[#007AC0]",
  cultural: "bg-[#f3eeff] text-[#7c3aed]",
  bienestar: "bg-[#fff7e0] text-[#f59e0b]",
  institucional: "bg-[#ffe0e0] text-[#d4183d]",
};

const ESTADO_COLORS: Record<string, string> = {
  pendiente: "bg-yellow-100 text-yellow-700 border-yellow-200",
  aprobado: "bg-green-100 text-green-700 border-green-200",
  rechazado: "bg-red-100 text-red-600 border-red-200",
  finalizado: "bg-gray-100 text-gray-600 border-gray-200",
};

export default function Eventos() {
  const navigate = useNavigate();
  const { currentUser } = useApp();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("todos");
  const [estadoFilter, setEstadoFilter] = useState("todos");

  const canCreate = currentUser?.role === "admin" || currentUser?.role === "organizador";

  const filtered = EVENTOS.filter((ev) => {
    const matchSearch = ev.titulo.toLowerCase().includes(search.toLowerCase()) ||
      ev.lugar.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "todos" || ev.categoria === catFilter;
    const matchEstado = estadoFilter === "todos" || ev.estado === estadoFilter;
    return matchSearch && matchCat && matchEstado;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <p className="text-gray-500 text-sm">{filtered.length} eventos encontrados</p>
        </div>
        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-2 text-sm transition-colors ${viewMode === "grid" ? "bg-[#39A900] text-white" : "text-gray-500 hover:bg-gray-50"}`}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <rect x="0" y="0" width="7" height="7" rx="1" /><rect x="9" y="0" width="7" height="7" rx="1" />
                <rect x="0" y="9" width="7" height="7" rx="1" /><rect x="9" y="9" width="7" height="7" rx="1" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-2 text-sm transition-colors ${viewMode === "list" ? "bg-[#39A900] text-white" : "text-gray-500 hover:bg-gray-50"}`}
            >
              <List size={16} />
            </button>
          </div>

          {canCreate && (
            <button
              onClick={() => navigate("/eventos/crear")}
              className="flex items-center gap-2 bg-[#39A900] hover:bg-[#2d8a00] text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              <PlusCircle size={16} /> Crear evento
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar evento o lugar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39A900]/30 focus:border-[#39A900]"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={16} className="text-gray-400" />
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            className="text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#39A900]/30 focus:border-[#39A900] text-gray-700"
          >
            <option value="todos">Todas las categorías</option>
            {Object.entries(CATEGORIAS_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>

          <select
            value={estadoFilter}
            onChange={(e) => setEstadoFilter(e.target.value)}
            className="text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#39A900]/30 focus:border-[#39A900] text-gray-700"
          >
            <option value="todos">Todos los estados</option>
            {Object.entries(ESTADO_EVENTO_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Category quick filters */}
      <div className="flex gap-2 flex-wrap">
        {[{ key: "todos", label: "Todos" }, ...Object.entries(CATEGORIAS_LABELS).map(([k, v]) => ({ key: k, label: v }))].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setCatFilter(key)}
            className={`px-3 py-1.5 rounded-full text-sm transition-all ${
              catFilter === key
                ? "bg-[#39A900] text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-[#39A900] hover:text-[#39A900]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Events grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <CalendarDays size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No se encontraron eventos con estos filtros</p>
          <button onClick={() => { setSearch(""); setCatFilter("todos"); setEstadoFilter("todos"); }} className="mt-3 text-[#39A900] text-sm hover:underline">Limpiar filtros</button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((ev) => (
            <div
              key={ev.id}
              onClick={() => navigate(`/eventos/${ev.id}`)}
              className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group"
            >
              <div className="relative h-44 overflow-hidden">
                <img src={ev.imagen} alt={ev.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${CATEGORIA_COLORS[ev.categoria]}`}>
                    {CATEGORIAS_LABELS[ev.categoria]}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${ESTADO_COLORS[ev.estado]}`}>
                    {ESTADO_EVENTO_LABELS[ev.estado]}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-gray-800 font-semibold line-clamp-2 leading-snug">{ev.titulo}</h3>
                <p className="text-gray-500 text-xs mt-2 line-clamp-2">{ev.descripcion}</p>

                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center gap-2 text-gray-500 text-xs">
                    <CalendarDays size={13} className="text-[#39A900] flex-shrink-0" />
                    <span>{ev.fecha} · {ev.horaInicio} – {ev.horaFin}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-xs">
                    <MapPin size={13} className="text-[#007AC0] flex-shrink-0" />
                    <span className="truncate">{ev.lugar}</span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Users size={13} className="text-gray-400" />
                    <span className="text-xs text-gray-500">{ev.inscritos}/{ev.capacidad}</span>
                    <div className="w-16 bg-gray-100 rounded-full h-1.5 ml-1">
                      <div
                        className="bg-[#39A900] h-1.5 rounded-full"
                        style={{ width: `${Math.min((ev.inscritos / ev.capacidad) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-xs text-[#39A900] font-medium group-hover:underline">Ver más →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((ev) => (
            <div
              key={ev.id}
              onClick={() => navigate(`/eventos/${ev.id}`)}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 cursor-pointer hover:shadow-md hover:border-[#39A900]/30 transition-all flex items-center gap-4"
            >
              <img src={ev.imagen} alt={ev.titulo} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORIA_COLORS[ev.categoria]}`}>
                    {CATEGORIAS_LABELS[ev.categoria]}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${ESTADO_COLORS[ev.estado]}`}>
                    {ESTADO_EVENTO_LABELS[ev.estado]}
                  </span>
                </div>
                <h3 className="text-gray-800 font-semibold mt-1">{ev.titulo}</h3>
                <div className="flex flex-wrap gap-4 mt-1.5">
                  <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                    <CalendarDays size={12} className="text-[#39A900]" />
                    <span>{ev.fecha} · {ev.horaInicio}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                    <MapPin size={12} className="text-[#007AC0]" />
                    <span>{ev.lugar}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                    <Users size={12} />
                    <span>{ev.inscritos}/{ev.capacidad} inscritos</span>
                  </div>
                </div>
              </div>
              <ArrowRight size={18} className="text-gray-300 flex-shrink-0" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
