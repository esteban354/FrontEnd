import { useState } from "react";
import { useNavigate } from "react-router";
import { CASOS_PAEDP, CASOS_BIENESTAR, USERS } from "../data/mockData";
import {
  ShieldAlert, ArrowLeft, User, Calendar, CheckCircle2, Clock, AlertCircle,
  Users, FileText, PlusCircle, ArrowRight, X, ChevronDown, ChevronUp
} from "lucide-react";

const ESTADO_PAEDP_COLORS: Record<string, string> = {
  activo: "bg-red-100 text-red-600",
  en_proceso: "bg-orange-100 text-orange-600",
  cerrado: "bg-gray-100 text-gray-600",
};

const ENFOQUE_COLORS: Record<string, string> = {
  "Género": "bg-pink-100 text-pink-700",
  "Convivencia": "bg-blue-100 text-blue-700",
  "Inclusión": "bg-purple-100 text-purple-700",
  "Etnia/Raza": "bg-amber-100 text-amber-700",
  "Discapacidad": "bg-teal-100 text-teal-700",
};

export default function PAEDP() {
  const navigate = useNavigate();
  const [expandedCase, setExpandedCase] = useState<string | null>("p1");
  const [showNuevoCaso, setShowNuevoCaso] = useState(false);

  const stats = {
    total: CASOS_PAEDP.length,
    activos: CASOS_PAEDP.filter(p => p.estado === "activo").length,
    en_proceso: CASOS_PAEDP.filter(p => p.estado === "en_proceso").length,
    cerrados: CASOS_PAEDP.filter(p => p.estado === "cerrado").length,
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#7c1d2d] to-[#d4183d] rounded-2xl p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <ShieldAlert size={24} />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">Ruta PAEDP</h2>
            <p className="text-white/80 text-sm mt-1">
              Protocolo de Atención con Enfoque Diferencial y Pluralista — Equipo interdisciplinario para el acompañamiento integral de aprendices en situación de vulnerabilidad.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          {[
            { label: "Total casos", value: stats.total },
            { label: "Activos", value: stats.activos },
            { label: "En proceso", value: stats.en_proceso },
            { label: "Cerrados", value: stats.cerrados },
          ].map((s) => (
            <div key={s.label} className="bg-white/15 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-white/70 text-xs mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Info boxes */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          {
            title: "¿Qué es el PAEDP?",
            icon: "📋",
            desc: "Es el Protocolo de Atención con Enfoque Diferencial y Pluralista del SENA, diseñado para garantizar la atención integral a personas en condición de vulnerabilidad.",
          },
          {
            title: "Enfoques de atención",
            icon: "🌈",
            desc: "Género, orientación sexual, etnia, discapacidad, conflicto armado, diversidad cultural y otros factores que requieren atención diferenciada.",
          },
          {
            title: "Equipo PAEDP",
            icon: "👥",
            desc: "Psicólogos, trabajadores sociales, coordinadores académicos e instructores trabajan de forma interdisciplinaria para cada caso.",
          },
        ].map((box) => (
          <div key={box.title} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="text-2xl mb-3">{box.icon}</div>
            <h4 className="text-gray-800 font-semibold text-sm mb-1.5">{box.title}</h4>
            <p className="text-gray-500 text-xs leading-relaxed">{box.desc}</p>
          </div>
        ))}
      </div>

      {/* Cases */}
      <div className="flex items-center justify-between">
        <h3 className="text-gray-800 font-semibold">Casos PAEDP activos</h3>
        <button
          onClick={() => setShowNuevoCaso(true)}
          className="flex items-center gap-2 bg-[#d4183d] hover:bg-[#b01530] text-white px-4 py-2 rounded-lg text-sm transition-colors"
        >
          <PlusCircle size={16} /> Nuevo caso PAEDP
        </button>
      </div>

      <div className="space-y-4">
        {CASOS_PAEDP.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <ShieldAlert size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No hay casos PAEDP activos</p>
          </div>
        ) : (
          CASOS_PAEDP.map((caso) => {
            const aprendiz = USERS.find((u) => u.id === caso.aprendizId);
            const casoBase = CASOS_BIENESTAR.find((c) => c.id === caso.casosBienestarId);
            const isExpanded = expandedCase === caso.id;

            return (
              <div key={caso.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Case header */}
                <div
                  className="p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpandedCase(isExpanded ? null : caso.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <ShieldAlert size={20} className="text-red-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${ESTADO_PAEDP_COLORS[caso.estado]}`}>
                          {caso.estado.replace("_", " ")}
                        </span>
                        {caso.enfoque.map((e) => (
                          <span key={e} className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${ENFOQUE_COLORS[e] || "bg-gray-100 text-gray-600"}`}>
                            {e}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-gray-800 font-semibold">{casoBase?.titulo || "Caso PAEDP"}</h3>
                      <p className="text-gray-500 text-sm mt-1 line-clamp-2">{caso.motivoActivacion}</p>

                      <div className="flex flex-wrap gap-4 mt-2">
                        <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                          <User size={12} />
                          <span>{aprendiz?.nombre} {aprendiz?.apellido}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                          <Calendar size={12} />
                          <span>Activado: {caso.fechaActivacion}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                          <FileText size={12} />
                          <span>{caso.acciones.length} acciones</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isExpanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                    </div>
                  </div>
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="border-t border-gray-100">
                    {/* Responsible team */}
                    <div className="p-5 border-b border-gray-100">
                      <h4 className="text-gray-700 font-semibold text-sm mb-3 flex items-center gap-2">
                        <Users size={16} className="text-[#007AC0]" /> Equipo responsable
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {caso.responsables.map((r) => (
                          <div key={r} className="flex items-center gap-2 bg-[#e0f0fa] text-[#007AC0] px-3 py-1.5 rounded-full text-xs font-medium">
                            <User size={12} />
                            {r}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions timeline */}
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-gray-700 font-semibold text-sm flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-[#39A900]" /> Plan de acciones
                        </h4>
                        <button className="flex items-center gap-1.5 text-[#39A900] text-xs hover:underline">
                          <PlusCircle size={13} /> Agregar acción
                        </button>
                      </div>

                      <div className="space-y-4">
                        {caso.acciones.map((accion, idx) => (
                          <div key={accion.id} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className="w-8 h-8 bg-[#39A900] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                {idx + 1}
                              </div>
                              {idx < caso.acciones.length - 1 && <div className="w-0.5 bg-gray-100 flex-1 mt-1"></div>}
                            </div>
                            <div className="flex-1 pb-4">
                              <div className="bg-gray-50 rounded-xl p-4">
                                <div className="flex items-center justify-between gap-2 mb-2">
                                  <span className="text-gray-700 font-medium text-sm">{accion.responsable}</span>
                                  <span className="text-gray-400 text-xs">{accion.fecha}</span>
                                </div>
                                <p className="text-gray-600 text-sm mb-2">{accion.descripcion}</p>
                                <div className="bg-[#e8f5e2] rounded-lg p-2.5">
                                  <span className="text-[#39A900] text-xs font-medium">Resultado: </span>
                                  <span className="text-gray-700 text-xs">{accion.resultado}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                        <button
                          onClick={() => navigate(`/bienestar/${caso.casosBienestarId}`)}
                          className="flex items-center gap-2 text-[#007AC0] text-sm hover:underline"
                        >
                          <ArrowRight size={14} /> Ver caso de bienestar relacionado
                        </button>
                        <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs transition-colors ml-auto">
                          <CheckCircle2 size={14} /> Cerrar ruta PAEDP
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* New PAEDP case modal */}
      {showNuevoCaso && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-gray-800 font-semibold flex items-center gap-2">
                  <ShieldAlert size={18} className="text-red-500" /> Activar nueva Ruta PAEDP
                </h3>
              </div>
              <button onClick={() => setShowNuevoCaso(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-gray-700 text-sm block mb-1.5">Aprendiz *</label>
                <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:outline-none text-gray-700">
                  <option value="">Seleccionar aprendiz</option>
                  {USERS.filter(u => u.role === "aprendiz").map(u => (
                    <option key={u.id} value={u.id}>{u.nombre} {u.apellido}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-gray-700 text-sm block mb-1.5">Caso de bienestar asociado</label>
                <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:outline-none text-gray-700">
                  <option value="">Seleccionar caso</option>
                  {CASOS_BIENESTAR.map(c => (
                    <option key={c.id} value={c.id}>{c.titulo}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-gray-700 text-sm block mb-1.5">Motivo de activación *</label>
                <textarea rows={3} placeholder="Describe la razón por la cual se activa la ruta PAEDP..." className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:outline-none resize-none" />
              </div>
              <div>
                <label className="text-gray-700 text-sm block mb-2">Enfoques diferenciales</label>
                <div className="grid grid-cols-2 gap-2">
                  {["Género", "Etnia/Raza", "Discapacidad", "Orientación sexual", "Conflicto armado", "Convivencia", "Diversidad cultural", "NNA"].map((e) => (
                    <label key={e} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 border border-gray-100">
                      <input type="checkbox" className="w-4 h-4 accent-red-500 rounded" />
                      <span className="text-gray-700 text-sm">{e}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-gray-700 text-sm block mb-1.5">Responsables del equipo</label>
                <input type="text" placeholder="Ej: Sofía Herrera - Psicóloga" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:outline-none" />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
              <button onClick={() => setShowNuevoCaso(false)} className="px-5 py-2.5 border border-gray-200 rounded-xl text-gray-700 text-sm hover:bg-gray-50">Cancelar</button>
              <button onClick={() => setShowNuevoCaso(false)} className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm transition-colors flex items-center gap-2">
                <ShieldAlert size={16} /> Activar Ruta PAEDP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}