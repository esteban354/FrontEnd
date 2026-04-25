import { useNavigate } from "react-router";
import { useApp } from "../context/AppContext";
import { INSCRIPCIONES, EVENTOS } from "../data/mockData";
import { CalendarDays, MapPin, CheckCircle2, XCircle, Clock, ArrowRight, BookOpen } from "lucide-react";

const ESTADO_COLORS: Record<string, string> = {
  inscrito: "bg-blue-100 text-blue-700",
  asistio: "bg-green-100 text-green-700",
  no_asistio: "bg-red-100 text-red-600",
  cancelado: "bg-gray-100 text-gray-500",
};

const ESTADO_ICONS: Record<string, React.ReactNode> = {
  inscrito: <Clock size={14} />,
  asistio: <CheckCircle2 size={14} />,
  no_asistio: <XCircle size={14} />,
  cancelado: <XCircle size={14} />,
};

const ESTADO_LABELS: Record<string, string> = {
  inscrito: "Inscrito",
  asistio: "Asistió",
  no_asistio: "No asistió",
  cancelado: "Cancelado",
};

export default function Inscripciones() {
  const navigate = useNavigate();
  const { currentUser } = useApp();

  const misInscripciones = INSCRIPCIONES.filter(i => i.aprendizId === currentUser?.id);
  const proximas = misInscripciones.filter(i => i.estado === "inscrito");
  const pasadas = misInscripciones.filter(i => i.estado !== "inscrito");

  const stats = {
    total: misInscripciones.length,
    asistio: misInscripciones.filter(i => i.estado === "asistio").length,
    proximas: proximas.length,
  };

  const asistenciaRate = stats.total > 0 ? Math.round((stats.asistio / stats.total) * 100) : 0;

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total inscripciones", value: stats.total, color: "bg-[#007AC0]", textColor: "text-white" },
          { label: "Próximas", value: stats.proximas, color: "bg-[#f0f9e8]", textColor: "text-[#39A900]", border: "border border-[#39A900]/20" },
          { label: "Tasa de asistencia", value: `${asistenciaRate}%`, color: "bg-[#f3eeff]", textColor: "text-[#7c3aed]", border: "border border-purple-100" },
        ].map(s => (
          <div key={s.label} className={`${s.color} ${s.border || ""} rounded-xl p-4 text-center`}>
            <div className={`font-bold ${s.textColor}`} style={{ fontSize: "1.75rem" }}>{s.value}</div>
            <div className={`text-xs mt-1 ${s.textColor} opacity-80`}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Upcoming */}
      <div>
        <h3 className="text-gray-800 font-semibold mb-3 flex items-center gap-2">
          <Clock size={18} className="text-[#007AC0]" /> Próximas inscripciones
          <span className="bg-[#e0f0fa] text-[#007AC0] text-xs px-2 py-0.5 rounded-full">{proximas.length}</span>
        </h3>

        {proximas.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
            <BookOpen size={32} className="text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No tienes inscripciones próximas</p>
            <button onClick={() => navigate("/eventos")} className="mt-3 text-[#39A900] text-sm hover:underline">Explorar eventos disponibles</button>
          </div>
        ) : (
          <div className="space-y-3">
            {proximas.map(ins => {
              const ev = EVENTOS.find(e => e.id === ins.eventoId);
              if (!ev) return null;
              return (
                <div key={ins.id} onClick={() => navigate(`/eventos/${ev.id}`)} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 cursor-pointer hover:border-[#39A900]/30 hover:shadow-md transition-all flex items-center gap-4">
                  <img src={ev.imagen} alt={ev.titulo} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-gray-800 font-medium">{ev.titulo}</h4>
                      <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${ESTADO_COLORS[ins.estado]}`}>
                        {ESTADO_ICONS[ins.estado]} {ESTADO_LABELS[ins.estado]}
                      </span>
                      {ins.confirmado && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 size={11} /> Confirmado
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-3 mt-1.5">
                      <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                        <CalendarDays size={12} className="text-[#39A900]" />
                        <span>{ev.fecha} · {ev.horaInicio}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                        <MapPin size={12} className="text-[#007AC0]" />
                        <span>{ev.lugar}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <ArrowRight size={16} className="text-gray-300" />
                    <button
                      onClick={(e) => { e.stopPropagation(); }}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Past */}
      {pasadas.length > 0 && (
        <div>
          <h3 className="text-gray-800 font-semibold mb-3 flex items-center gap-2">
            <CheckCircle2 size={18} className="text-[#39A900]" /> Historial
            <span className="bg-[#e8f5e2] text-[#39A900] text-xs px-2 py-0.5 rounded-full">{pasadas.length}</span>
          </h3>

          <div className="space-y-3">
            {pasadas.map(ins => {
              const ev = EVENTOS.find(e => e.id === ins.eventoId);
              if (!ev) return null;
              return (
                <div key={ins.id} onClick={() => navigate(`/eventos/${ev.id}`)} className="bg-white rounded-xl border border-gray-100 p-4 cursor-pointer hover:bg-gray-50 transition-colors flex items-center gap-4 opacity-80">
                  <img src={ev.imagen} alt={ev.titulo} className="w-14 h-14 rounded-xl object-cover flex-shrink-0 grayscale" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-gray-700 font-medium text-sm">{ev.titulo}</span>
                      <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${ESTADO_COLORS[ins.estado]}`}>
                        {ESTADO_ICONS[ins.estado]} {ESTADO_LABELS[ins.estado]}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs mt-1">
                      <CalendarDays size={12} />
                      <span>{ev.fecha}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="text-center">
        <button onClick={() => navigate("/eventos")} className="flex items-center gap-2 mx-auto bg-[#39A900] hover:bg-[#2d8a00] text-white px-6 py-3 rounded-xl font-medium text-sm transition-colors">
          <CalendarDays size={18} /> Explorar más eventos
        </button>
      </div>
    </div>
  );
}
