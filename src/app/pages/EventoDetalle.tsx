import { useParams, useNavigate } from "react-router";
import { useApp } from "../context/AppContext";
import { useState, useEffect } from "react";
import { eventosApi } from "../services/api";
import { Evento, CATEGORIAS_LABELS, ESTADO_EVENTO_LABELS, LOCACIONES_EVENTO_LABELS } from "../data/domain";
import {
  ArrowLeft, CalendarDays, MapPin, Clock, Users, QrCode, Download,
  CheckCircle2, Share2, AlertCircle, Loader2
} from "lucide-react";

const CATEGORIA_COLORS: Record<string, string> = {
  academico: "bg-[#e8f5e2] text-[#39A900]",
  deportivo: "bg-[#e0f0fa] text-[#007AC0]",
  cultural: "bg-[#f3eeff] text-[#7c3aed]",
  bienestar: "bg-[#fff7e0] text-[#f59e0b]",
  institucional: "bg-[#ffe0e0] text-[#d4183d]",
};

const ESTADO_COLORS: Record<string, string> = {
  pendiente: "bg-yellow-100 text-yellow-700",
  iniciado: "bg-green-100 text-green-700",
  cancelado: "bg-red-100 text-red-600",
  terminado: "bg-gray-100 text-gray-600",
};

export default function EventoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useApp();
  const [evento, setEvento] = useState<Evento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    if (!id) return;
    eventosApi.findById(id)
      .then(setEvento)
      .catch(() => setError("Evento no encontrado o error al conectarse con el servidor."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 gap-3 text-gray-400">
        <Loader2 size={24} className="animate-spin" />
        <span className="text-sm">Cargando evento...</span>
      </div>
    );
  }

  if (error || !evento) {
    return (
      <div className="text-center py-20">
        <AlertCircle size={40} className="text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">{error || "Evento no encontrado"}</p>
        <button onClick={() => navigate("/eventos")} className="mt-3 text-[#39A900] hover:underline text-sm">
          Volver a eventos
        </button>
      </div>
    );
  }

  const isLleno = evento.inscritos >= evento.capacidad;
  const capacidadPct = Math.min((evento.inscritos / evento.capacidad) * 100, 100);
  const canManage = currentUser?.role === "admin" || currentUser?.role === "organizador";
  const canInscribe = currentUser?.role === "aprendiz" || currentUser?.role === "estudiante";

  const lugarLabel = LOCACIONES_EVENTO_LABELS[evento.lugar] ?? evento.lugar;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Back button */}
      <button
        onClick={() => navigate("/eventos")}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm transition-colors"
      >
        <ArrowLeft size={16} /> Volver a eventos
      </button>

      {/* Hero */}
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
        {/* Banner / header */}
        <div className="relative h-48 sm:h-64 bg-gradient-to-br from-[#1C2B1A] via-[#2d4a2b] to-[#39A900] overflow-hidden">
          {evento.imagen && (
            <img src={evento.imagen} alt={evento.titulo} className="absolute inset-0 w-full h-full object-cover opacity-40" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${CATEGORIA_COLORS[evento.categoria] ?? "bg-gray-100 text-gray-600"}`}>
                {CATEGORIAS_LABELS[evento.categoria] ?? evento.categoria}
              </span>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${ESTADO_COLORS[evento.estado] ?? "bg-gray-100 text-gray-600"}`}>
                {ESTADO_EVENTO_LABELS[evento.estado] ?? evento.estado}
              </span>
            </div>
            <h1 className="text-white font-bold text-xl sm:text-2xl leading-tight">{evento.titulo}</h1>
          </div>
        </div>

        <div className="p-6">
          {/* Info cards */}
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <div className="flex items-start gap-3 p-4 bg-[#f0f9e8] rounded-xl">
              <CalendarDays size={20} className="text-[#39A900] flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-gray-500 text-xs">Fecha</div>
                <div className="text-gray-800 font-medium text-sm">{evento.fecha}</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-[#e0f0fa] rounded-xl">
              <Clock size={20} className="text-[#007AC0] flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-gray-500 text-xs">Horario</div>
                <div className="text-gray-800 font-medium text-sm">{evento.horaInicio} – {evento.horaFin}</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-[#f3eeff] rounded-xl">
              <MapPin size={20} className="text-[#7c3aed] flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-gray-500 text-xs">Lugar</div>
                <div className="text-gray-800 font-medium text-sm">{lugarLabel}</div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-gray-800 font-semibold mb-2">Descripción</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{evento.descripcion}</p>
          </div>

          {/* Capacity */}
          <div className="mb-6 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-gray-500" />
                <span className="text-gray-700 text-sm font-medium">Capacidad</span>
              </div>
              <span className="text-gray-600 text-sm">{evento.inscritos} / {evento.capacidad} inscritos</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${capacidadPct >= 90 ? "bg-[#d4183d]" : capacidadPct >= 70 ? "bg-[#f59e0b]" : "bg-[#39A900]"}`}
                style={{ width: `${capacidadPct}%` }}
              />
            </div>
            {isLleno && (
              <p className="text-[#d4183d] text-xs mt-1.5 flex items-center gap-1">
                <AlertCircle size={12} /> Evento lleno
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            {canInscribe && !isLleno && (
              <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#39A900] hover:bg-[#2d8a00] text-white px-6 py-3 rounded-xl font-medium transition-colors">
                <CheckCircle2 size={18} /> Inscribirme
              </button>
            )}

            {canManage && (
              <>
                <button
                  onClick={() => setShowQR(!showQR)}
                  className="flex items-center gap-2 bg-[#007AC0] hover:bg-[#006bb0] text-white px-5 py-3 rounded-xl font-medium transition-colors"
                >
                  <QrCode size={18} /> {showQR ? "Ocultar QR" : "Ver QR"}
                </button>
                <button className="flex items-center gap-2 bg-white border border-gray-200 hover:border-[#39A900] text-gray-700 hover:text-[#39A900] px-5 py-3 rounded-xl font-medium transition-colors">
                  <Download size={18} /> Descargar lista
                </button>
              </>
            )}

            <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors">
              <Share2 size={18} />
            </button>
          </div>

          {/* QR Code */}
          {showQR && (
            <div className="mt-4 p-6 bg-gray-50 rounded-xl flex flex-col items-center gap-3">
              <div className="w-48 h-48 bg-white border-2 border-[#39A900] rounded-xl p-4 flex items-center justify-center">
                <svg width="160" height="160" viewBox="0 0 100 100" className="opacity-90">
                  <rect x="10" y="10" width="30" height="30" rx="3" fill="none" stroke="#1C2B1A" strokeWidth="3"/>
                  <rect x="15" y="15" width="20" height="20" rx="1" fill="#1C2B1A"/>
                  <rect x="60" y="10" width="30" height="30" rx="3" fill="none" stroke="#1C2B1A" strokeWidth="3"/>
                  <rect x="65" y="15" width="20" height="20" rx="1" fill="#1C2B1A"/>
                  <rect x="10" y="60" width="30" height="30" rx="3" fill="none" stroke="#1C2B1A" strokeWidth="3"/>
                  <rect x="15" y="65" width="20" height="20" rx="1" fill="#1C2B1A"/>
                  <rect x="44" y="44" width="4" height="4" fill="#1C2B1A"/>
                  <rect x="52" y="44" width="4" height="4" fill="#1C2B1A"/>
                  <rect x="60" y="44" width="4" height="4" fill="#1C2B1A"/>
                  <rect x="68" y="44" width="4" height="4" fill="#1C2B1A"/>
                  <rect x="44" y="52" width="4" height="4" fill="#1C2B1A"/>
                  <rect x="60" y="52" width="4" height="4" fill="#1C2B1A"/>
                  <rect x="44" y="60" width="4" height="4" fill="#1C2B1A"/>
                  <rect x="68" y="60" width="4" height="4" fill="#1C2B1A"/>
                </svg>
              </div>
              <div className="text-center">
                <p className="text-gray-700 font-medium text-sm">QR de asistencia</p>
                <p className="text-gray-500 text-xs mt-0.5">{evento.titulo}</p>
                <p className="text-gray-400 text-xs">ID: {evento.id.toUpperCase()}</p>
              </div>
              <button className="flex items-center gap-2 bg-[#39A900] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#2d8a00] transition-colors">
                <Download size={14} /> Descargar QR
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
