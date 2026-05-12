import { useParams, useNavigate } from "react-router";
import { CASOS_BIENESTAR, TIPO_BIENESTAR_LABELS, ESTADO_BIENESTAR_LABELS, USERS } from "../data/domain";
import { useApp } from "../context/AppContext";
import { useState } from "react";
import {
  ArrowLeft, Heart, User, Calendar, Clock, MessageSquare, PlusCircle,
  ShieldAlert, CheckCircle2, AlertCircle, X
} from "lucide-react";

const PRIORIDAD_COLORS: Record<string, string> = {
  urgente: "bg-red-100 text-red-600",
  alta: "bg-orange-100 text-orange-600",
  media: "bg-yellow-100 text-yellow-700",
  baja: "bg-green-100 text-green-700",
};

const ESTADO_COLORS: Record<string, string> = {
  abierto: "bg-blue-100 text-blue-700",
  en_seguimiento: "bg-purple-100 text-purple-700",
  cerrado: "bg-gray-100 text-gray-600",
  derivado_Seguimiento: "bg-red-100 text-red-700",
};

const TIPO_COLORS: Record<string, string> = {
  psicologico: "bg-[#f3eeff] text-[#7c3aed]",
  social: "bg-[#e0f0fa] text-[#007AC0]",
  academico: "bg-[#e8f5e2] text-[#39A900]",
  familiar: "bg-[#fff7e0] text-[#f59e0b]",
  economico: "bg-orange-50 text-orange-600",
  salud: "bg-red-50 text-red-600",
};

export default function BienestarDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useApp();
  const [showAddSeguimiento, setShowAddSeguimiento] = useState(false);
  const [showSeguimientoModal, setShowSeguimientoModal] = useState(false);
  const [newSeg, setNewSeg] = useState({ descripcion: "", accion: "", proxCita: "" });

  const caso = CASOS_BIENESTAR.find((c) => c.id === id);
  if (!caso) {
    return (
      <div className="text-center py-20">
        <AlertCircle size={40} className="text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">Caso no encontrado</p>
        <button onClick={() => navigate("/bienestar")} className="mt-3 text-[#39A900] hover:underline">Volver a bienestar</button>
      </div>
    );
  }

  const aprendiz = USERS.find((u) => u.id === caso.aprendizId);
  const psicologa = USERS.find((u) => u.id === caso.psicologaId);
  const canManage = currentUser?.role === "admin" || currentUser?.role === "organizador";

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back */}
      <button onClick={() => navigate("/bienestar")} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm transition-colors">
        <ArrowLeft size={16} /> Volver a Bienestar
      </button>

      {/* Header card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${TIPO_COLORS[caso.tipo]}`}>
            <Heart size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-2 mb-2">
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${TIPO_COLORS[caso.tipo]}`}>
                {TIPO_BIENESTAR_LABELS[caso.tipo]}
              </span>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${ESTADO_COLORS[caso.estado]}`}>
                {ESTADO_BIENESTAR_LABELS[caso.estado]}
              </span>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${PRIORIDAD_COLORS[caso.prioridad]}`}>
                Prioridad {caso.prioridad}
              </span>
              {caso.SeguimientoActivado && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-red-50 text-red-600 font-medium flex items-center gap-1">
                  <ShieldAlert size={11} /> Seguimiento activada
                </span>
              )}
            </div>
            <h2 className="text-gray-800 font-bold">{caso.titulo}</h2>
            <p className="text-gray-600 text-sm mt-2">{caso.descripcion}</p>
          </div>
        </div>

        {/* Info grid */}
        <div className="grid sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#39A900] rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {aprendiz?.nombre[0]}{aprendiz?.apellido[0]}
            </div>
            <div>
              <div className="text-gray-500 text-xs">Aprendiz</div>
              <div className="text-gray-800 font-medium text-sm">{aprendiz?.nombre} {aprendiz?.apellido}</div>
              <div className="text-gray-400 text-xs">Ficha: {aprendiz?.ficha}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#7c3aed] rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {psicologa?.nombre[0]}{psicologa?.apellido[0]}
            </div>
            <div>
              <div className="text-gray-500 text-xs">Profesional a cargo</div>
              <div className="text-gray-800 font-medium text-sm">{psicologa?.nombre} {psicologa?.apellido}</div>
              <div className="text-gray-400 text-xs">Psicóloga</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <Calendar size={18} className="text-gray-500" />
            </div>
            <div>
              <div className="text-gray-500 text-xs">Apertura del caso</div>
              <div className="text-gray-800 font-medium text-sm">{caso.fechaApertura}</div>
              <div className="text-gray-400 text-xs">Últ. seguimiento: {caso.fechaUltimoSeguimiento}</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        {canManage && (
          <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-100">
            <button
              onClick={() => setShowAddSeguimiento(true)}
              className="flex items-center gap-2 bg-[#39A900] hover:bg-[#2d8a00] text-white px-4 py-2 rounded-xl text-sm transition-colors"
            >
              <PlusCircle size={16} /> Agregar seguimiento
            </button>

            {!caso.SeguimientoActivado && caso.estado !== "cerrado" && (
              <button
                onClick={() => setShowSeguimientoModal(true)}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm transition-colors"
              >
                <ShieldAlert size={16} /> Activar Seguimiento
              </button>
            )}

            {caso.SeguimientoActivado && (
              <button
                onClick={() => navigate("/bienestar")}
                className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 px-4 py-2 rounded-xl text-sm transition-colors"
              >
                <ShieldAlert size={16} /> Ver Seguimiento
              </button>
            )}

            {caso.estado !== "cerrado" && (
              <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm transition-colors">
                <CheckCircle2 size={16} /> Cerrar caso
              </button>
            )}
          </div>
        )}
      </div>

      {/* Timeline de seguimientos */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-gray-800 font-semibold flex items-center gap-2">
            <MessageSquare size={18} className="text-[#39A900]" />
            Historial de seguimientos
            <span className="bg-[#e8f5e2] text-[#39A900] text-xs px-2 py-0.5 rounded-full">{caso.seguimientos.length}</span>
          </h3>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-100"></div>

          <div className="space-y-6">
            {caso.seguimientos.map((seg, idx) => (
              <div key={seg.id} className="relative flex gap-4">
                {/* Timeline dot */}
                <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  idx === 0 ? "bg-[#39A900]" : "bg-white border-2 border-[#39A900]"
                }`}>
                  <span className={`text-xs font-bold ${idx === 0 ? "text-white" : "text-[#39A900]"}`}>{idx + 1}</span>
                </div>

                {/* Content */}
                <div className="flex-1 bg-gray-50 rounded-xl p-4 mb-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-800 font-medium text-sm">{seg.profesional}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                      <Calendar size={12} />
                      <span>{seg.fecha}</span>
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm mb-3">{seg.descripcion}</p>

                  <div className="bg-white rounded-lg p-3 border border-gray-100">
                    <div className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">Acción tomada</div>
                    <p className="text-gray-700 text-sm">{seg.accion}</p>
                  </div>

                  {seg.proxCita && (
                    <div className="flex items-center gap-2 mt-3 text-[#007AC0] text-xs">
                      <Clock size={12} />
                      <span>Próxima cita: <span className="font-medium">{seg.proxCita}</span></span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add seguimiento modal */}
      {showAddSeguimiento && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-gray-800 font-semibold">Agregar seguimiento</h3>
                <p className="text-gray-500 text-sm mt-0.5">Registra una nueva intervención o nota de seguimiento</p>
              </div>
              <button onClick={() => setShowAddSeguimiento(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-gray-700 text-sm block mb-1.5">Descripción de la sesión *</label>
                <textarea
                  rows={3}
                  value={newSeg.descripcion}
                  onChange={(e) => setNewSeg(p => ({ ...p, descripcion: e.target.value }))}
                  placeholder="Describe lo observado o trabajado en esta sesión..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#39A900]/30 focus:border-[#39A900] resize-none"
                />
              </div>
              <div>
                <label className="text-gray-700 text-sm block mb-1.5">Acción tomada *</label>
                <textarea
                  rows={2}
                  value={newSeg.accion}
                  onChange={(e) => setNewSeg(p => ({ ...p, accion: e.target.value }))}
                  placeholder="Describe las acciones, remisiones o compromisos establecidos..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#39A900]/30 focus:border-[#39A900] resize-none"
                />
              </div>
              <div>
                <label className="text-gray-700 text-sm block mb-1.5">Próxima cita (opcional)</label>
                <input
                  type="date"
                  value={newSeg.proxCita}
                  onChange={(e) => setNewSeg(p => ({ ...p, proxCita: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#39A900]/30 focus:border-[#39A900] text-gray-700"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
              <button onClick={() => setShowAddSeguimiento(false)} className="px-5 py-2.5 border border-gray-200 rounded-xl text-gray-700 text-sm hover:bg-gray-50">Cancelar</button>
              <button onClick={() => setShowAddSeguimiento(false)} className="px-5 py-2.5 bg-[#39A900] text-white rounded-xl text-sm hover:bg-[#2d8a00]">Registrar seguimiento</button>
            </div>
          </div>
        </div>
      )}

      {/* Seguimiento Activation Modal */}
      {showSeguimientoModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-gray-800 font-semibold flex items-center gap-2">
                  <ShieldAlert size={18} className="text-red-500" /> Activar Seguimiento
                </h3>
                <p className="text-gray-500 text-sm mt-0.5">Atención con Enfoque Diferencial y Pluralista</p>
              </div>
              <button onClick={() => setShowSeguimientoModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
                <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm">
                  La activación de la Seguimiento implica la intervención del equipo interdisciplinario del Centro.
                  Esta acción quedará registrada en el historial del aprendiz.
                </p>
              </div>
              <div>
                <label className="text-gray-700 text-sm block mb-1.5">Motivo de activación *</label>
                <textarea rows={3} placeholder="Describe la razón por la cual se activa la Seguimiento..." className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 resize-none" />
              </div>
              <div>
                <label className="text-gray-700 text-sm block mb-1.5">Enfoques diferenciales identificados</label>
                <div className="grid grid-cols-2 gap-2">
                  {["Género", "Etnia/Raza", "Discapacidad", "Orientación sexual", "Conflicto armado", "Convivencia"].map((e) => (
                    <label key={e} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                      <input type="checkbox" className="w-4 h-4 text-red-500 rounded" />
                      <span className="text-gray-700 text-sm">{e}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
              <button onClick={() => setShowSeguimientoModal(false)} className="px-5 py-2.5 border border-gray-200 rounded-xl text-gray-700 text-sm hover:bg-gray-50">Cancelar</button>
              <button onClick={() => { setShowSeguimientoModal(false); navigate("/bienestar"); }} className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm transition-colors flex items-center gap-2">
                <ShieldAlert size={16} /> Activar Seguimiento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
