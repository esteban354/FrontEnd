import { useState, useEffect } from "react";
import { User } from "../data/domain";
import { Search, Heart, CalendarDays, User as UserIcon, UserCheck, Filter, PlusCircle, X, Loader2 } from "lucide-react";
import { usersApi } from "../services/api";
import { useApp } from "../context/AppContext";

export default function Aprendices() {
  const { currentUser } = useApp();
  const [search, setSearch] = useState("");
  const [fichaFilter, setFichaFilter] = useState("todas");
  const [aprendices, setAprendices] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nombres: "", apellidos: "", documento: "", email: "" });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const loadAprendices = async () => {
    setLoading(true);
    try {
      const users = await usersApi.findAll();
      setAprendices(users.filter(u => u.role === "aprendiz"));
    } catch (err) {
      setError("Error al cargar los aprendices.");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAprendices();
  }, []);

  const fichas = [...new Set(aprendices.map(a => a.ficha).filter(Boolean) as string[])];

  const filtered = aprendices.filter(a =>
    (`${a.nombre || ""} ${a.apellido || ""}`.toLowerCase().includes(search.toLowerCase()) ||
     (a.ficha && a.ficha.includes(search)) ||
     (a.documento && a.documento.includes(search))) &&
    (fichaFilter === "todas" || a.ficha === fichaFilter)
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCreating(true);

    if (!form.nombres || !form.apellidos || !form.documento) {
      setError("Nombres, apellidos y documento son obligatorios.");
      setCreating(false);
      return;
    }

    try {
      await usersApi.create({
        nombres: form.nombres,
        apellidos: form.apellidos,
        documento: form.documento,
        email: form.email || undefined,
        rol: "APRENDIZ"
      });
      setShowModal(false);
      setForm({ nombres: "", apellidos: "", documento: "", email: "" });
      loadAprendices();
    } catch (err: any) {
      setError(err.message || "No se pudo registrar el aprendiz.");
    } finally {
      setCreating(false);
    }
  };

  const canCreate = currentUser?.role === "instructor" || currentUser?.role === "admin";

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total aprendices", value: aprendices.length, color: "bg-[#39A900]", icon: <UserIcon size={20} className="text-white" /> },
          { label: "Fichas activas", value: fichas.length || 1, color: "bg-[#007AC0]", icon: <UserCheck size={20} className="text-white" /> },
          { label: "Con casos bienestar", value: 0, color: "bg-[#d4183d]", icon: <Heart size={20} className="text-white" /> },
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

      {/* Filters and Actions */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-3 items-center flex-1">
          <div className="relative flex-1 min-w-48 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, ficha o documento..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39A900]/30"
            />
          </div>
          {fichas.length > 0 && (
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
          )}
        </div>

        {canCreate && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-[#39A900] hover:bg-[#2d8a00] text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            <PlusCircle size={16} /> Registrar Aprendiz
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left text-gray-500 py-3.5 px-4 font-medium">Aprendiz</th>
                <th className="text-left text-gray-500 py-3.5 px-4 font-medium">Documento</th>
                <th className="text-left text-gray-500 py-3.5 px-4 font-medium">Email</th>
                <th className="text-left text-gray-500 py-3.5 px-4 font-medium">Ficha</th>
                <th className="text-left text-gray-500 py-3.5 px-4 font-medium">Inscripciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">
                    <Loader2 size={24} className="animate-spin mx-auto mb-2" />
                    Cargando aprendices...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    No se encontraron aprendices.
                  </td>
                </tr>
              ) : filtered.map((aprendiz) => (
                <tr key={aprendiz.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-[#39A900] rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                        {aprendiz.nombre?.[0] || ""}{aprendiz.apellido?.[0] || ""}
                      </div>
                      <div>
                        <div className="text-gray-800 font-medium">{aprendiz.nombre || ""} {aprendiz.apellido || ""}</div>
                        <div className="text-gray-400 text-xs">ID: {aprendiz.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-gray-500 font-mono text-xs">{aprendiz.documento}</td>
                  <td className="py-3.5 px-4 text-gray-500 text-xs">{aprendiz.email || "—"}</td>
                  <td className="py-3.5 px-4">
                    {aprendiz.ficha ? (
                      <span className="bg-[#e8f5e2] text-[#39A900] text-xs px-2.5 py-1 rounded-full font-medium">
                        {aprendiz.ficha}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">—</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <CalendarDays size={13} className="text-[#007AC0]" />
                      <span className="text-gray-700">0</span>
                    </div>
                  </td>
                </tr>
              ))}
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

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-800">Registrar Nuevo Aprendiz</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="p-5 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Nombres *</label>
                  <input
                    type="text"
                    value={form.nombres}
                    onChange={(e) => setForm({ ...form, nombres: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#39A900]/30 outline-none"
                    placeholder="Ej. Juan"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Apellidos *</label>
                  <input
                    type="text"
                    value={form.apellidos}
                    onChange={(e) => setForm({ ...form, apellidos: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#39A900]/30 outline-none"
                    placeholder="Ej. Perez"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Documento (10 dígitos) *</label>
                <input
                  type="text"
                  value={form.documento}
                  onChange={(e) => setForm({ ...form, documento: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#39A900]/30 outline-none"
                  placeholder="Ej. 1000000004"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#39A900]/30 outline-none"
                  placeholder="juan@sena.edu.co"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg flex items-start gap-2">
                <UserIcon size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700 leading-relaxed">
                  La contraseña inicial será el mismo número de documento. El aprendiz podrá cambiarla en su perfil. El aprendiz será asignado automáticamente a tu ficha actual.
                </p>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 py-2 bg-[#39A900] text-white rounded-lg text-sm font-medium hover:bg-[#2d8a00] transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
                >
                  {creating && <Loader2 size={16} className="animate-spin" />}
                  {creating ? "Registrando..." : "Registrar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
