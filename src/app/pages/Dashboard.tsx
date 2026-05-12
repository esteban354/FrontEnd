import { useApp } from "../context/AppContext";
import { EVENTOS, CASOS_BIENESTAR, INSCRIPCIONES, APRENDICES_FICHA } from "../data/domain";
import { useNavigate } from "react-router";
import {
  CalendarDays, Users, Heart, TrendingUp, CheckCircle2, Clock, AlertCircle,
  ArrowRight, QrCode, CreditCard, BookOpen, BarChart3, PlusCircle
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend,
} from "recharts";

const ATTENDANCE_DATA = [
  { mes: "Ene", asistencia: 65, eventos: 3 },
  { mes: "Feb", asistencia: 78, eventos: 5 },
  { mes: "Mar", asistencia: 82, eventos: 4 },
  { mes: "Abr", asistencia: 91, eventos: 6 },
  { mes: "May", asistencia: 74, eventos: 5 },
  { mes: "Jun", asistencia: 88, eventos: 7 },
];

const PIE_CATS = [
  { name: "Académico", value: 35, color: "#39A900" },
  { name: "Deportivo", value: 20, color: "#007AC0" },
  { name: "Cultural", value: 15, color: "#7c3aed" },
  { name: "Bienestar", value: 20, color: "#f59e0b" },
  { name: "Institucional", value: 10, color: "#d4183d" },
];

const BIENESTAR_DATA = [
  { tipo: "Psic.", cantidad: 8 },
  { tipo: "Social", cantidad: 5 },
  { tipo: "Acad.", cantidad: 6 },
  { tipo: "Familiar", cantidad: 4 },
  { tipo: "Económ.", cantidad: 3 },
];

function StatCard({ icon, label, value, change, color, onClick }: {
  icon: React.ReactNode; label: string; value: string | number; change?: string; color: string; onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex items-start gap-4 ${onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""}`}
    >
      <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <div>
        <div className="text-gray-500 text-sm">{label}</div>
        <div className="text-gray-900 font-bold mt-0.5" style={{ fontSize: "1.5rem" }}>{value}</div>
        {change && <div className="text-[#39A900] text-xs mt-1 flex items-center gap-1"><TrendingUp size={12} /> {change}</div>}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { currentUser } = useApp();
  const navigate = useNavigate();

  const upcomingEvents = EVENTOS.filter(e => e.estado === "iniciado" || e.estado === "pendiente").slice(0, 3);
  const pendingEvents = EVENTOS.filter(e => e.estado === "pendiente");
  const activeCases = CASOS_BIENESTAR.filter(c => c.estado !== "cerrado");

  const role = currentUser?.role;

  const CATEGORIA_COLORS: Record<string, string> = {
    academico: "bg-[#e8f5e2] text-[#39A900]",
    deportivo: "bg-[#e0f0fa] text-[#007AC0]",
    cultural: "bg-[#f3eeff] text-[#7c3aed]",
    bienestar: "bg-[#fff7e0] text-[#f59e0b]",
    institucional: "bg-[#ffe0e0] text-[#d4183d]",
  };

  const ESTADO_BADGE: Record<string, string> = {
    pendiente: "bg-yellow-100 text-yellow-700",
    iniciado: "bg-green-100 text-green-700",
    cancelado: "bg-red-100 text-red-700",
    terminado: "bg-gray-100 text-gray-600",
  };

  // ─── ADMIN DASHBOARD ─────────────────────────────────────────────
  if (role === "admin") {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-gray-800 font-bold">Buenos días, {currentUser?.nombre} 👋</h2>
          <p className="text-gray-500 text-sm mt-1">Panel de administración · {new Date().toLocaleDateString("es-CO", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={<CalendarDays size={20} className="text-white" />} label="Total Eventos" value={EVENTOS.length} change="+3 este mes" color="bg-[#39A900]" onClick={() => navigate("/eventos")} />
          <StatCard icon={<Clock size={20} className="text-white" />} label="Pendientes Aprob." value={pendingEvents.length} color="bg-[#f59e0b]" onClick={() => navigate("/eventos")} />
          <StatCard icon={<Heart size={20} className="text-white" />} label="Casos Bienestar" value={activeCases.length} change="activos" color="bg-[#d4183d]" onClick={() => navigate("/bienestar")} />        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-gray-800 font-semibold mb-4">Asistencia mensual a eventos</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={ATTENDANCE_DATA}>
                <defs>
                  <linearGradient id="colorAs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#39A900" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#39A900" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "#9ca3af" }} />
                <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} />
                <Tooltip />
                <Area type="monotone" dataKey="asistencia" stroke="#39A900" fill="url(#colorAs)" strokeWidth={2} name="% Asistencia" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-gray-800 font-semibold mb-4">Eventos por categoría</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={PIE_CATS} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={3}>
                  {PIE_CATS.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`${v}%`, ""]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {PIE_CATS.map((c) => (
                <div key={c.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }}></div>
                    <span className="text-gray-600">{c.name}</span>
                  </div>
                  <span className="text-gray-800 font-medium">{c.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pending approvals & Recent activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Pending */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-800 font-semibold">Eventos pendientes de aprobación</h3>
              <span className="text-xs bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-full font-medium">{pendingEvents.length} pendientes</span>
            </div>
            <div className="space-y-3">
              {pendingEvents.length === 0 ? (
                <div className="text-gray-400 text-sm text-center py-6">No hay eventos pendientes</div>
              ) : (
                pendingEvents.map((ev) => (
                  <div key={ev.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <div className="text-gray-800 text-sm font-medium truncate">{ev.titulo}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{ev.fecha} · {ev.lugar}</div>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-xs bg-[#39A900] text-white px-3 py-1 rounded-lg hover:bg-[#2d8a00] transition-colors">Aprobar</button>
                      <button className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded-lg hover:bg-red-200 transition-colors">Rechazar</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Bienestar casos */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-800 font-semibold">Casos de bienestar activos</h3>
              <button onClick={() => navigate("/bienestar")} className="text-xs text-[#007AC0] hover:underline flex items-center gap-1">Ver todos <ArrowRight size={12} /></button>
            </div>
            <div className="space-y-3">
              {activeCases.slice(0, 3).map((c) => {
                const prioColors: Record<string, string> = {
                  urgente: "bg-red-100 text-red-600",
                  alta: "bg-orange-100 text-orange-600",
                  media: "bg-yellow-100 text-yellow-700",
                  baja: "bg-green-100 text-green-700",
                };
                return (
                  <div key={c.id} onClick={() => navigate(`/bienestar/${c.id}`)} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="text-gray-800 text-sm font-medium truncate">{c.titulo}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{c.fechaApertura}</div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${prioColors[c.prioridad]}`}>
                      {c.prioridad}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── ORGANIZADOR DASHBOARD ────────────────────────────────────────
  if (role === "organizador") {
    const myEvents = EVENTOS.filter(e => e.organizadorId === currentUser?.id);
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-gray-800 font-bold">Hola, {currentUser?.nombre} 👋</h2>
            <p className="text-gray-500 text-sm mt-1">Panel del Organizador</p>
          </div>
          <button onClick={() => navigate("/eventos/crear")} className="flex items-center gap-2 bg-[#39A900] hover:bg-[#2d8a00] text-white px-4 py-2 rounded-lg text-sm transition-colors">
            <PlusCircle size={16} /> Crear Evento
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={<CalendarDays size={20} className="text-white" />} label="Mis Eventos" value={myEvents.length} color="bg-[#007AC0]" />
          <StatCard icon={<Users size={20} className="text-white" />} label="Inscritos totales" value={myEvents.reduce((a, e) => a + e.inscritos, 0)} color="bg-[#39A900]" />
          <StatCard icon={<CheckCircle2 size={20} className="text-white" />} label="iniciados" value={myEvents.filter(e => e.estado === "iniciado").length} color="bg-[#7c3aed]" />
          <StatCard icon={<Clock size={20} className="text-white" />} label="Pendientes" value={myEvents.filter(e => e.estado === "pendiente").length} color="bg-[#f59e0b]" />
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-gray-800 font-semibold mb-4">Inscripciones por mes</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ATTENDANCE_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "#9ca3af" }} />
              <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} />
              <Tooltip />
              <Bar dataKey="asistencia" name="Inscritos" fill="#007AC0" radius={[4, 4, 0, 0]} />
              <Bar dataKey="eventos" name="Eventos" fill="#39A900" radius={[4, 4, 0, 0]} />
              <Legend />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-800 font-semibold">Mis eventos recientes</h3>
            <button onClick={() => navigate("/eventos")} className="text-xs text-[#007AC0] hover:underline flex items-center gap-1">Ver todos <ArrowRight size={12} /></button>
          </div>
          <div className="space-y-3">
            {EVENTOS.slice(0, 4).map((ev) => (
              <div key={ev.id} onClick={() => navigate(`/eventos/${ev.id}`)} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <img src={ev.imagen} alt={ev.titulo} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-gray-800 text-sm font-medium truncate">{ev.titulo}</div>
                  <div className="text-gray-500 text-xs mt-0.5">{ev.fecha} · {ev.inscritos}/{ev.capacidad} inscritos</div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1.5">
                    <div className="bg-[#39A900] h-1.5 rounded-full" style={{ width: `${(ev.inscritos / ev.capacidad) * 100}%` }}></div>
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                  ev.estado === "iniciado" ? "bg-green-100 text-green-700" :
                  ev.estado === "pendiente" ? "bg-yellow-100 text-yellow-700" :
                  ev.estado === "terminado" ? "bg-gray-100 text-gray-600" :
                  "bg-red-100 text-red-600"
                }`}>{ev.estado}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── INSTRUCTOR DASHBOARD ──────────────────────────────────────────
  if (role === "instructor") {
    const today = new Date().toISOString().split("T")[0];
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-gray-800 font-bold">Bienvenido, Instructor {currentUser?.nombre} 👋</h2>
          <p className="text-gray-500 text-sm mt-1">Panel del Instructor · Hoy {new Date().toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" })}</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={<Users size={20} className="text-white" />} label="Mis Aprendices" value={APRENDICES_FICHA.length} color="bg-[#39A900]" onClick={() => navigate("/aprendices")} />
          <StatCard icon={<CalendarDays size={20} className="text-white" />} label="Eventos Hoy" value={1} color="bg-[#007AC0]" onClick={() => navigate("/eventos")} />
          <StatCard icon={<CheckCircle2 size={20} className="text-white" />} label="Asistencia prom." value="78%" color="bg-[#7c3aed]" />
          <StatCard icon={<AlertCircle size={20} className="text-white" />} label="Ausencias" value={3} color="bg-[#f59e0b]" />
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: "Llamado de lista", icon: <CheckCircle2 size={24} />, path: "/asistencia", color: "bg-[#39A900]" },
            { label: "Ver aprendices", icon: <Users size={24} />, path: "/aprendices", color: "bg-[#007AC0]" },
            { label: "Pre-registro", icon: <CalendarDays size={24} />, path: "/pre-registro", color: "bg-[#7c3aed]" },
          ].map((a) => (
            <button key={a.label} onClick={() => navigate(a.path)} className={`${a.color} hover:opacity-90 text-white rounded-xl p-6 flex flex-col items-center gap-3 transition-opacity`}>
              {a.icon}
              <span className="text-sm font-medium">{a.label}</span>
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-gray-800 font-semibold mb-4">Próximos eventos</h3>
          <div className="space-y-3">
            {upcomingEvents.map((ev) => (
              <div key={ev.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-center bg-[#39A900] text-white rounded-lg p-2 w-12 flex-shrink-0">
                  <div className="text-xs">{ev.fecha.split("-")[1]}/{ev.fecha.split("-")[0].slice(2)}</div>
                  <div className="font-bold">{ev.fecha.split("-")[2]}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-gray-800 text-sm font-medium">{ev.titulo}</div>
                  <div className="text-gray-500 text-xs mt-0.5">{ev.horaInicio} – {ev.horaFin} · {ev.lugar}</div>
                </div>
                <button onClick={() => navigate("/asistencia")} className="text-xs bg-[#39A900] text-white px-3 py-1 rounded-lg hover:bg-[#2d8a00] transition-colors">Lista</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── APRENDIZ DASHBOARD ────────────────────────────────────────────
  if (role === "aprendiz") {
    const myInscripciones = INSCRIPCIONES.filter(i => i.aprendizId === currentUser?.id);
    const upcomingIns = myInscripciones.filter(i => i.estado === "inscrito");
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-[#1C2B1A] to-[#39A900] rounded-2xl p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {currentUser?.nombre[0]}{currentUser?.apellido[0]}
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">¡Hola, {currentUser?.nombre}!</h2>
              <p className="text-white/80 text-sm">{currentUser?.programa}</p>
              <p className="text-white/60 text-xs">Ficha: {currentUser?.ficha}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold">{myInscripciones.length}</div>
              <div className="text-xs text-white/70 mt-1">Inscripciones</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold">{myInscripciones.filter(i => i.estado === "asistio").length}</div>
              <div className="text-xs text-white/70 mt-1">Asistencias</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold">3</div>
              <div className="text-xs text-white/70 mt-1">Próx. eventos</div>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Ver Eventos", icon: <CalendarDays size={22} />, path: "/eventos", color: "bg-[#007AC0]" },
            { label: "Mi Carnet", icon: <CreditCard size={22} />, path: "/carnet", color: "bg-[#39A900]" },            { label: "Mis Insc.", icon: <BookOpen size={22} />, path: "/inscripciones", color: "bg-[#f59e0b]" },
          ].map((a) => (
            <button key={a.label} onClick={() => navigate(a.path)} className={`${a.color} hover:opacity-90 text-white rounded-xl p-5 flex flex-col items-center gap-2 transition-opacity`}>
              {a.icon}
              <span className="text-sm font-medium">{a.label}</span>
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-800 font-semibold">Mis próximas inscripciones</h3>
            <button onClick={() => navigate("/inscripciones")} className="text-xs text-[#007AC0] hover:underline">Ver todas</button>
          </div>
          {upcomingIns.length === 0 ? (
            <div className="text-center py-8">
              <CalendarDays size={32} className="text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No tienes inscripciones próximas</p>
              <button onClick={() => navigate("/eventos")} className="mt-3 text-[#39A900] text-sm hover:underline">Explorar eventos</button>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingIns.map((ins) => {
                const ev = EVENTOS.find(e => e.id === ins.eventoId);
                if (!ev) return null;
                return (
                  <div key={ins.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <img src={ev.imagen} alt={ev.titulo} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-gray-800 text-sm font-medium truncate">{ev.titulo}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{ev.fecha} · {ev.horaInicio}</div>
                    </div>
                    {ins.confirmado ? (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Confirmado</span>
                    ) : (
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Pendiente</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── USER DASHBOARD ────────────────────────────────────────
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-800 font-bold">Bienvenido a EBA 👋</h2>
        <p className="text-gray-500 text-sm mt-1">Explora los eventos del Centro de Comercio y Turismo</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatCard icon={<CalendarDays size={20} className="text-white" />} label="Eventos disponibles" value={EVENTOS.filter(e => e.estado === "iniciado").length} color="bg-[#39A900]" onClick={() => navigate("/eventos")} />
        <StatCard icon={<Users size={20} className="text-white" />} label="Plazas disponibles" value={EVENTOS.reduce((a, e) => a + (e.capacidad - e.inscritos), 0)} color="bg-[#007AC0]" />
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-gray-800 font-semibold mb-4">Eventos próximos</h3>
        <div className="space-y-4">
          {EVENTOS.filter(e => e.estado === "iniciado").map((ev) => (
            <div key={ev.id} onClick={() => navigate(`/eventos/${ev.id}`)} className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl cursor-pointer hover:border-[#39A900] hover:bg-[#f0f9e8] transition-all group">
              <img src={ev.imagen} alt={ev.titulo} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-gray-800 font-medium">{ev.titulo}</div>
                <div className="text-gray-500 text-sm mt-0.5">{ev.fecha} · {ev.horaInicio}</div>
                <div className="text-gray-400 text-xs mt-0.5">{ev.lugar}</div>
              </div>
              <ArrowRight size={16} className="text-gray-300 group-hover:text-[#39A900] transition-colors" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
