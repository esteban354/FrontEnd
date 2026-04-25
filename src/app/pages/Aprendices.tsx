import { useState } from "react";
import { APRENDICES_FICHA, CASOS_BIENESTAR, INSCRIPCIONES } from "../data/mockData";
import { Search, Heart, CalendarDays, User, UserCheck, Filter } from "lucide-react";

export default function Aprendices() {
  const [search, setSearch] = useState("");
  const [fichaFilter, setFichaFilter] = useState("todas");

  const fichas = [...new Set(APRENDICES_FICHA.map(a => a.ficha))];

  const filtered = APRENDICES_FICHA.filter(a =>
    (a.nombre.toLowerCase().includes(search.toLowerCase()) ||
     a.ficha.includes(search) ||
     a.documento.includes(search)) &&
    (fichaFilter === "todas" || a.ficha === fichaFilter)
  );

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total aprendices", value: APRENDICES_FICHA.length, color: "bg-[#39A900]", icon: <User size={20} className="text-white" /> },
          { label: "Fichas activas", value: fichas.length, color: "bg-[#007AC0]", icon: <UserCheck size={20} className="text-white" /> },
          { label: "Con casos bienestar", value: CASOS_BIENESTAR.length, color: "bg-[#d4183d]", icon: <Heart size={20} className="text-white" /> },
        ].map(s => (
          <div key={s.label} className={`${s.color} text-white rounded-xl p-4 flex items-center gap-3`}>
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">{s.icon}</div>
            <div>
              <div className="font-bold text-2xl">{s.value}</div>
              <div className="text-white/80 text-xs">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, ficha o documento..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39A900]/30"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={15} className="text-gray-400" />
          <select
            value={fichaFilter}
            onChange={(e) => setFichaFilter(e.target.value)}
            className="text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none text-gray-700"
          >
            <option value="todas">Todas las fichas</option>
            {fichas.map(f => <option key={f} value={f}>Ficha {f}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left text-gray-500 py-3.5 px-4 font-medium">Aprendiz</th>
                <th className="text-left text-gray-500 py-3.5 px-4 font-medium">Ficha</th>
                <th className="text-left text-gray-500 py-3.5 px-4 font-medium">Programa</th>
                <th className="text-left text-gray-500 py-3.5 px-4 font-medium">Documento</th>
                <th className="text-left text-gray-500 py-3.5 px-4 font-medium">Inscripciones</th>
                <th className="text-left text-gray-500 py-3.5 px-4 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((aprendiz) => {
                const inscripciones = INSCRIPCIONES.filter(i => i.aprendizId === aprendiz.id);
                const casosBienestar = CASOS_BIENESTAR.filter(c => c.aprendizId === aprendiz.id);
                const tienePAEDP = casosBienestar.some(c => c.paedpActivado);
                const tieneAlert = casosBienestar.some(c => c.prioridad === "urgente" || c.prioridad === "alta");

                return (
                  <tr key={aprendiz.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#39A900] rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                          {aprendiz.nombre.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <div className="text-gray-800 font-medium">{aprendiz.nombre}</div>
                          <div className="text-gray-400 text-xs">ID: {aprendiz.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="bg-[#e8f5e2] text-[#39A900] text-xs px-2.5 py-1 rounded-full font-medium">
                        {aprendiz.ficha}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-600 text-xs max-w-40 truncate">{aprendiz.programa}</td>
                    <td className="py-3.5 px-4 text-gray-500 font-mono text-xs">{aprendiz.documento}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <CalendarDays size={13} className="text-[#007AC0]" />
                        <span className="text-gray-700">{inscripciones.length}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex gap-2 flex-wrap">
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Activo</span>
                        {casosBienestar.length > 0 && (
                          <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${tieneAlert ? "bg-red-100 text-red-600" : "bg-purple-100 text-purple-700"}`}>
                            <Heart size={11} /> Bienestar
                          </span>
                        )}
                        {tienePAEDP && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">PAEDP</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-gray-500 text-sm">{filtered.length} aprendices</span>
          <button className="text-xs bg-[#007AC0] text-white px-3 py-1.5 rounded-lg hover:bg-[#006bb0] transition-colors flex items-center gap-1.5">
            Exportar lista
          </button>
        </div>
      </div>
    </div>
  );
}
