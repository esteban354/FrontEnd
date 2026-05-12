import { useState } from "react";
import { EVENTOS, APRENDICES_FICHA } from "../data/domain";
import { ClipboardList, CheckCircle2, Users, PlusCircle, Search } from "lucide-react";

export default function PreRegistro() {
  const [selectedEvento, setSelectedEvento] = useState(EVENTOS[0]?.id ?? "");
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const upcoming = EVENTOS.filter(e => e.estado === "iniciado");
  const filtered = APRENDICES_FICHA.filter(a =>
    a.nombre.toLowerCase().includes(search.toLowerCase()) ||
    a.ficha.includes(search)
  );

  const toggleAprendiz = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="w-16 h-16 bg-[#e8f5e2] rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={32} className="text-[#39A900]" />
        </div>
        <h2 className="text-gray-800 font-bold mb-2">Pre-registro exitoso</h2>
        <p className="text-gray-500 text-sm">{selected.length} aprendices pre-registrados al evento</p>
        <button onClick={() => { setSubmitted(false); setSelected([]); }} className="mt-6 bg-[#39A900] text-white px-6 py-2.5 rounded-xl text-sm hover:bg-[#2d8a00]">
          Nuevo pre-registro
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <p className="text-gray-500 text-sm">Registra aprendices a eventos sin que ellos tengan que hacerlo individualmente</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <label className="block text-gray-700 text-sm mb-1.5">Selecciona el evento</label>
        <select
          value={selectedEvento}
          onChange={(e) => setSelectedEvento(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#39A900]/30 focus:border-[#39A900] text-gray-700"
        >
          {upcoming.map(ev => (
            <option key={ev.id} value={ev.id}>{ev.titulo} – {ev.fecha}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar aprendiz..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none"
            />
          </div>
          <button
            onClick={() => setSelected(APRENDICES_FICHA.map(a => a.id))}
            className="text-xs text-[#39A900] border border-[#39A900]/30 px-3 py-2 rounded-lg hover:bg-[#e8f5e2] transition-colors"
          >
            Seleccionar todos
          </button>
          <span className="text-sm text-gray-500">{selected.length} seleccionados</span>
        </div>

        <div className="divide-y divide-gray-50">
          {filtered.map(a => (
            <label key={a.id} className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={selected.includes(a.id)}
                onChange={() => toggleAprendiz(a.id)}
                className="w-4 h-4 accent-[#39A900] rounded"
              />
              <div className="w-9 h-9 bg-[#e8f5e2] rounded-full flex items-center justify-center text-[#39A900] text-sm font-semibold flex-shrink-0">
                {a.nombre.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-gray-800 font-medium text-sm">{a.nombre}</div>
                <div className="text-gray-500 text-xs">Ficha: {a.ficha} · {a.programa}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => selected.length > 0 && setSubmitted(true)}
          disabled={selected.length === 0}
          className="flex items-center gap-2 bg-[#39A900] hover:bg-[#2d8a00] disabled:bg-gray-200 disabled:text-gray-400 text-white px-6 py-3 rounded-xl font-medium text-sm transition-colors"
        >
          <PlusCircle size={18} /> Pre-registrar {selected.length > 0 ? `(${selected.length})` : ""} aprendices
        </button>
      </div>
    </div>
  );
}
