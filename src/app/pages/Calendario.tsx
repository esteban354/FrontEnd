import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { eventosApi } from "../services/api";
import { Evento, CATEGORIAS_LABELS, LOCACIONES_EVENTO_LABELS } from "../data/domain";
import { ChevronLeft, ChevronRight, CalendarDays, MapPin, Clock, Loader2 } from "lucide-react";

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];
const DAY_NAMES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

const CATEGORIA_COLORS: Record<string, string> = {
  academico: "bg-[#e8f5e2] text-[#39A900] border-[#39A900]/30",
  deportivo: "bg-[#e0f0fa] text-[#007AC0] border-[#007AC0]/30",
  cultural: "bg-[#f3eeff] text-[#7c3aed] border-[#7c3aed]/30",
  bienestar: "bg-[#fff7e0] text-[#f59e0b] border-[#f59e0b]/30",
  institucional: "bg-[#ffe0e0] text-[#d4183d] border-[#d4183d]/30",
};

const CATEGORIA_DOT: Record<string, string> = {
  academico: "bg-[#39A900]",
  deportivo: "bg-[#007AC0]",
  cultural: "bg-[#7c3aed]",
  bienestar: "bg-[#f59e0b]",
  institucional: "bg-[#d4183d]",
};

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function Calendario() {
  const navigate = useNavigate();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  useEffect(() => {
    eventosApi.findAll()
      .then(setEventos)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
    setSelectedDay(null);
  };

  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
    setSelectedDay(null);
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  // Map events to days
  const eventsByDay: Record<number, Evento[]> = {};
  eventos.forEach(ev => {
    if (!ev.fecha) return;
    const [evYear, evMonth, evDay] = ev.fecha.split("-").map(Number);
    if (evYear === year && evMonth - 1 === month) {
      if (!eventsByDay[evDay]) eventsByDay[evDay] = [];
      eventsByDay[evDay].push(ev);
    }
  });

  const selectedEvents = selectedDay ? (eventsByDay[selectedDay] ?? []) : [];

  // Build calendar cells
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Pad to complete the last row
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-800 font-bold text-xl">Calendario de Eventos</h2>
          <p className="text-gray-500 text-sm mt-0.5">Visualiza todos los eventos programados</p>
        </div>
        <button
          onClick={() => navigate("/eventos")}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#39A900] transition-colors border border-gray-200 px-4 py-2 rounded-lg hover:border-[#39A900]"
        >
          <CalendarDays size={16} /> Ver lista
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar grid */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-5">
            <button
              onClick={prevMonth}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
            >
              <ChevronLeft size={20} />
            </button>
            <h3 className="text-gray-800 font-semibold text-lg">
              {MONTH_NAMES[month]} {year}
            </h3>
            <button
              onClick={nextMonth}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Day names */}
          <div className="grid grid-cols-7 mb-2">
            {DAY_NAMES.map(d => (
              <div key={d} className="text-center text-xs font-semibold text-gray-400 py-2">{d}</div>
            ))}
          </div>

          {/* Cells */}
          {loading ? (
            <div className="flex items-center justify-center py-16 gap-2 text-gray-400">
              <Loader2 size={20} className="animate-spin" />
              <span className="text-sm">Cargando eventos...</span>
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-1">
              {cells.map((day, idx) => {
                if (day === null) return <div key={`empty-${idx}`} />;
                const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                const hasEvents = !!eventsByDay[day];
                const dayEvents = eventsByDay[day] ?? [];
                const isSelected = selectedDay === day;

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(isSelected ? null : day)}
                    className={`
                      relative flex flex-col items-center justify-start rounded-xl py-2 px-1 min-h-[56px] transition-all border
                      ${isSelected ? "bg-[#39A900] border-[#39A900] text-white shadow-md" :
                        isToday ? "border-[#39A900] bg-[#f0f9e8]" :
                        hasEvents ? "border-gray-200 hover:border-[#39A900]/50 hover:bg-gray-50 bg-white" :
                        "border-transparent hover:bg-gray-50"}
                    `}
                  >
                    <span className={`text-sm font-semibold ${isSelected ? "text-white" : isToday ? "text-[#39A900]" : "text-gray-700"}`}>
                      {day}
                    </span>
                    {hasEvents && !isSelected && (
                      <div className="flex gap-0.5 mt-1 flex-wrap justify-center">
                        {dayEvents.slice(0, 3).map((ev, i) => (
                          <div
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full ${CATEGORIA_DOT[ev.categoria] ?? "bg-gray-400"}`}
                          />
                        ))}
                      </div>
                    )}
                    {hasEvents && isSelected && (
                      <span className="text-[10px] text-white/90 mt-0.5">{dayEvents.length} ev.</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Legend */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-3">
            {Object.entries(CATEGORIAS_LABELS).map(([key, label]) => (
              <div key={key} className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${CATEGORIA_DOT[key]}`} />
                <span className="text-xs text-gray-500">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Events panel */}
        <div className="space-y-4">
          {/* Selected day events */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h4 className="text-gray-700 font-semibold text-sm mb-3">
              {selectedDay
                ? `Eventos el ${selectedDay} de ${MONTH_NAMES[month]}`
                : "Selecciona un día para ver eventos"}
            </h4>

            {selectedDay && selectedEvents.length === 0 && (
              <div className="text-center py-8">
                <CalendarDays size={32} className="text-gray-200 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">Sin eventos este día</p>
              </div>
            )}

            {selectedEvents.map(ev => (
              <div
                key={ev.id}
                onClick={() => navigate(`/eventos/${ev.id}`)}
                className={`mb-3 last:mb-0 p-3 rounded-xl border cursor-pointer hover:shadow-sm transition-all ${CATEGORIA_COLORS[ev.categoria] ?? "bg-gray-50 text-gray-700 border-gray-200"}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold leading-tight">{ev.titulo}</p>
                  <span className="text-[10px] font-medium bg-white/60 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                    {CATEGORIAS_LABELS[ev.categoria]}
                  </span>
                </div>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs opacity-80">
                    <Clock size={11} />
                    <span>{ev.horaInicio} – {ev.horaFin}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs opacity-80">
                    <MapPin size={11} />
                    <span className="truncate">{LOCACIONES_EVENTO_LABELS[ev.lugar] ?? ev.lugar}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Upcoming events (next 5) */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h4 className="text-gray-700 font-semibold text-sm mb-3">Próximos eventos</h4>
            {loading && <p className="text-gray-400 text-sm">Cargando...</p>}
            {!loading && eventos
              .filter(ev => ev.fecha >= today.toISOString().split("T")[0])
              .sort((a, b) => a.fecha.localeCompare(b.fecha))
              .slice(0, 5)
              .map(ev => (
                <div
                  key={ev.id}
                  onClick={() => navigate(`/eventos/${ev.id}`)}
                  className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0 cursor-pointer hover:bg-gray-50 rounded-lg px-2 transition-colors"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${CATEGORIA_DOT[ev.categoria] ?? "bg-gray-300"}`}>
                    <CalendarDays size={14} className="text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-gray-800 text-sm font-medium truncate">{ev.titulo}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{ev.fecha} · {ev.horaInicio}</p>
                  </div>
                </div>
              ))
            }
            {!loading && eventos.filter(ev => ev.fecha >= today.toISOString().split("T")[0]).length === 0 && (
              <p className="text-gray-400 text-sm text-center py-4">Sin próximos eventos</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
