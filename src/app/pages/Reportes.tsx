import { useState } from "react";
import { EVENTOS, INSCRIPCIONES, CASOS_BIENESTAR } from "../data/mockData";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, Legend
} from "recharts";
import { Download, Filter, CalendarDays, BarChart3, PieChart as PieIcon, TrendingUp } from "lucide-react";

const MONTHLY_DATA = [
  { mes: "Ene", eventos: 3, inscritos: 85, asistencia: 68 },
  { mes: "Feb", eventos: 5, inscritos: 142, asistencia: 118 },
  { mes: "Mar", eventos: 4, inscritos: 98, asistencia: 87 },
  { mes: "Abr", eventos: 6, inscritos: 201, asistencia: 165 },
  { mes: "May", eventos: 5, inscritos: 178, asistencia: 142 },
  { mes: "Jun", eventos: 7, inscritos: 245, asistencia: 198 },
];

const CAT_DATA = [
  { name: "Académico", value: 12, color: "#39A900" },
  { name: "Deportivo", value: 8, color: "#007AC0" },
  { name: "Cultural", value: 6, color: "#7c3aed" },
  { name: "Bienestar", value: 9, color: "#f59e0b" },
  { name: "Institucional", value: 4, color: "#d4183d" },
];

const BIENESTAR_MONTHLY = [
  { mes: "Ene", nuevos: 2, cerrados: 1 },
  { mes: "Feb", nuevos: 3, cerrados: 2 },
  { mes: "Mar", nuevos: 5, cerrados: 3 },
  { mes: "Abr", nuevos: 4, cerrados: 4 },
  { mes: "May", nuevos: 2, cerrados: 2 },
  { mes: "Jun", nuevos: 6, cerrados: 3 },
];

const TIPO_BIENESTAR_DATA = [
  { tipo: "Psicológico", value: 8, color: "#7c3aed" },
  { tipo: "Social", value: 5, color: "#007AC0" },
  { tipo: "Académico", value: 6, color: "#39A900" },
  { tipo: "Familiar", value: 4, color: "#f59e0b" },
  { tipo: "Económico", value: 3, color: "#f97316" },
  { tipo: "Salud", value: 2, color: "#d4183d" },
];

type ReportType = "eventos" | "asistencia" | "bienestar" | "paedp";

export default function Reportes() {
  const [activeReport, setActiveReport] = useState<ReportType>("eventos");
  const [dateFilter, setDateFilter] = useState("2025");

  const REPORT_TABS = [
    { key: "eventos" as ReportType, label: "Eventos", icon: <CalendarDays size={15} /> },
    { key: "asistencia" as ReportType, label: "Asistencia", icon: <TrendingUp size={15} /> },
    { key: "bienestar" as ReportType, label: "Bienestar", icon: <BarChart3 size={15} /> },
    { key: "paedp" as ReportType, label: "PAEDP", icon: <PieIcon size={15} /> },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-gray-500 text-sm">Análisis de datos y generación de reportes del Centro</p>
        </div>
        <div className="flex gap-3">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="text-sm bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none text-gray-700"
          >
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>
          <button className="flex items-center gap-2 bg-[#007AC0] hover:bg-[#006bb0] text-white px-4 py-2 rounded-lg text-sm transition-colors">
            <Download size={16} /> Exportar Excel
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total eventos", value: EVENTOS.length, sub: "+3 este mes", color: "text-[#39A900]" },
          { label: "Total inscripciones", value: INSCRIPCIONES.length, sub: "+12 esta semana", color: "text-[#007AC0]" },
          { label: "Tasa de asistencia", value: "81%", sub: "promedio anual", color: "text-[#7c3aed]" },
          { label: "Casos bienestar", value: CASOS_BIENESTAR.filter(c => c.estado !== "cerrado").length, sub: "activos", color: "text-[#d4183d]" },
        ].map(kpi => (
          <div key={kpi.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className={`font-bold ${kpi.color}`} style={{ fontSize: "1.8rem" }}>{kpi.value}</div>
            <div className="text-gray-700 text-sm font-medium mt-0.5">{kpi.label}</div>
            <div className="text-gray-400 text-xs mt-1">{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* Report type tabs */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-100 bg-gray-50">
          {REPORT_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveReport(tab.key)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm transition-colors relative ${
                activeReport === tab.key ? "text-[#39A900] bg-white font-medium" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.icon} {tab.label}
              {activeReport === tab.key && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#39A900]"></div>}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* EVENTOS */}
          {activeReport === "eventos" && (
            <div className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-gray-800 font-semibold mb-4">Eventos por mes</h4>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={MONTHLY_DATA}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "#9ca3af" }} />
                      <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} />
                      <Tooltip />
                      <Bar dataKey="eventos" name="Eventos" fill="#39A900" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h4 className="text-gray-800 font-semibold mb-4">Distribución por categoría</h4>
                  <div className="flex items-center gap-6">
                    <ResponsiveContainer width="60%" height={200}>
                      <PieChart>
                        <Pie data={CAT_DATA} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                          {CAT_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                        </Pie>
                        <Tooltip formatter={(v) => [`${v} eventos`, ""]} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-2 flex-1">
                      {CAT_DATA.map(c => (
                        <div key={c.name} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }}></div>
                            <span className="text-gray-600">{c.name}</span>
                          </div>
                          <span className="text-gray-800 font-medium">{c.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div>
                <h4 className="text-gray-800 font-semibold mb-3">Resumen de eventos</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50">
                        <th className="text-left text-gray-500 py-3 px-4 font-medium rounded-tl-lg">Evento</th>
                        <th className="text-left text-gray-500 py-3 px-4 font-medium">Fecha</th>
                        <th className="text-left text-gray-500 py-3 px-4 font-medium">Inscritos</th>
                        <th className="text-left text-gray-500 py-3 px-4 font-medium">Capacidad</th>
                        <th className="text-left text-gray-500 py-3 px-4 font-medium rounded-tr-lg">Ocupación</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {EVENTOS.map(ev => {
                        const pct = Math.round((ev.inscritos / ev.capacidad) * 100);
                        return (
                          <tr key={ev.id} className="hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-4">
                              <div className="text-gray-800 font-medium text-sm">{ev.titulo}</div>
                              <div className="text-gray-400 text-xs capitalize">{ev.categoria}</div>
                            </td>
                            <td className="py-3 px-4 text-gray-600">{ev.fecha}</td>
                            <td className="py-3 px-4 text-gray-800 font-medium">{ev.inscritos}</td>
                            <td className="py-3 px-4 text-gray-600">{ev.capacidad}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <div className="w-20 bg-gray-100 rounded-full h-1.5">
                                  <div className={`h-1.5 rounded-full ${pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-yellow-500" : "bg-[#39A900]"}`} style={{ width: `${pct}%` }}></div>
                                </div>
                                <span className="text-xs text-gray-600">{pct}%</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ASISTENCIA */}
          {activeReport === "asistencia" && (
            <div className="space-y-6">
              <h4 className="text-gray-800 font-semibold mb-4">Inscritos vs Asistentes por mes</h4>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={MONTHLY_DATA}>
                  <defs>
                    <linearGradient id="gradIns" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#007AC0" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#007AC0" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradAs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#39A900" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#39A900" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "#9ca3af" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="inscritos" stroke="#007AC0" fill="url(#gradIns)" strokeWidth={2} name="Inscritos" />
                  <Area type="monotone" dataKey="asistencia" stroke="#39A900" fill="url(#gradAs)" strokeWidth={2} name="Asistentes" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* BIENESTAR */}
          {activeReport === "bienestar" && (
            <div className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-gray-800 font-semibold mb-4">Casos nuevos vs cerrados por mes</h4>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={BIENESTAR_MONTHLY}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "#9ca3af" }} />
                      <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="nuevos" name="Nuevos" fill="#d4183d" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="cerrados" name="Cerrados" fill="#39A900" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h4 className="text-gray-800 font-semibold mb-4">Tipos de casos</h4>
                  <div className="space-y-3">
                    {TIPO_BIENESTAR_DATA.map(t => (
                      <div key={t.tipo}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-700">{t.tipo}</span>
                          <span className="text-gray-600 font-medium">{t.value}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div className="h-2 rounded-full" style={{ width: `${(t.value / 28) * 100}%`, background: t.color }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PAEDP */}
          {activeReport === "paedp" && (
            <div className="space-y-6">
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { label: "Total activaciones", value: 1, color: "text-red-600" },
                  { label: "En proceso", value: 1, color: "text-orange-600" },
                  { label: "Cerrados", value: 0, color: "text-gray-600" },
                ].map(s => (
                  <div key={s.label} className="bg-gray-50 border border-gray-100 rounded-xl p-5 text-center">
                    <div className={`font-bold text-3xl ${s.color}`}>{s.value}</div>
                    <div className="text-gray-500 text-sm mt-1">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <h4 className="text-gray-800 font-semibold mb-3">Enfoques diferenciales más frecuentes</h4>
                <div className="space-y-3">
                  {[
                    { name: "Convivencia", count: 3, color: "#007AC0" },
                    { name: "Género", count: 2, color: "#d4183d" },
                    { name: "Inclusión", count: 2, color: "#7c3aed" },
                    { name: "Discapacidad", count: 1, color: "#f59e0b" },
                  ].map(e => (
                    <div key={e.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700">{e.name}</span>
                        <span className="font-medium">{e.count}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="h-2 rounded-full" style={{ width: `${(e.count / 3) * 100}%`, background: e.color }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 flex gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <div className="text-yellow-800 font-medium text-sm">Nota sobre el módulo PAEDP</div>
                  <p className="text-yellow-700 text-xs mt-1">Los reportes de casos PAEDP son de carácter confidencial y solo deben ser consultados por personal autorizado del equipo de bienestar y coordinación del Centro.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
