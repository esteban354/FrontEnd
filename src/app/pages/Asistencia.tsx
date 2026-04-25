import { useState } from "react";
import { EVENTOS, APRENDICES_FICHA, ASISTENCIA_MOCK } from "../data/mockData";
import { CheckCircle2, XCircle, QrCode, Search, Download, Users, Clock, Filter } from "lucide-react";

export default function Asistencia() {
  const [selectedEvento, setSelectedEvento] = useState(EVENTOS[0].id);
  const [mode, setMode] = useState<"lista" | "qr">("lista");
  const [search, setSearch] = useState("");
  const [attendance, setAttendance] = useState<Record<string, boolean>>(
    Object.fromEntries(ASISTENCIA_MOCK.map(a => [a.aprendizId, true]))
  );
  const [scanned, setScanned] = useState(false);
  const [scanName, setScanName] = useState("");

  const evento = EVENTOS.find(e => e.id === selectedEvento);
  const approvedEvents = EVENTOS.filter(e => e.estado === "aprobado" || e.estado === "finalizado");

  const filteredAprendices = APRENDICES_FICHA.filter(a =>
    a.nombre.toLowerCase().includes(search.toLowerCase()) ||
    a.ficha.includes(search) ||
    a.documento.includes(search)
  );

  const presentCount = Object.values(attendance).filter(Boolean).length;
  const totalAprendices = APRENDICES_FICHA.length;

  const toggleAttendance = (id: string) => {
    setAttendance(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleScan = () => {
    const aprendiz = APRENDICES_FICHA[Math.floor(Math.random() * APRENDICES_FICHA.length)];
    setScanName(aprendiz.nombre);
    setScanned(true);
    setAttendance(prev => ({ ...prev, [aprendiz.id]: true }));
    setTimeout(() => setScanned(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Event selector */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-48">
          <label className="text-gray-500 text-xs block mb-1">Evento seleccionado</label>
          <select
            value={selectedEvento}
            onChange={(e) => setSelectedEvento(e.target.value)}
            className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#39A900]/30 focus:border-[#39A900] text-gray-700"
          >
            {approvedEvents.map(ev => (
              <option key={ev.id} value={ev.id}>{ev.titulo} – {ev.fecha}</option>
            ))}
          </select>
        </div>

        {evento && (
          <div className="flex gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#39A900]">{presentCount}</div>
              <div className="text-xs text-gray-500">Presentes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-400">{totalAprendices - presentCount}</div>
              <div className="text-xs text-gray-500">Ausentes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{totalAprendices}</div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
          </div>
        )}

        {/* Mode toggle */}
        <div className="flex bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setMode("lista")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${mode === "lista" ? "bg-white text-[#39A900] shadow-sm font-medium" : "text-gray-500"}`}
          >
            <Users size={16} /> Lista
          </button>
          <button
            onClick={() => setMode("qr")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${mode === "qr" ? "bg-white text-[#39A900] shadow-sm font-medium" : "text-gray-500"}`}
          >
            <QrCode size={16} /> QR
          </button>
        </div>
      </div>

      {/* Progress bar */}
      {evento && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-700 text-sm font-medium">Progreso de asistencia</span>
            <span className="text-gray-500 text-sm">{Math.round((presentCount / totalAprendices) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-[#39A900] to-[#7dd956] transition-all duration-500"
              style={{ width: `${(presentCount / totalAprendices) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-[#39A900]">{presentCount} presentes</span>
            <span className="text-xs text-gray-400">{totalAprendices - presentCount} ausentes</span>
          </div>
        </div>
      )}

      {mode === "lista" ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          {/* Toolbar */}
          <div className="p-4 border-b border-gray-100 flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-48">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar aprendiz, ficha o documento..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39A900]/30"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setAttendance(Object.fromEntries(APRENDICES_FICHA.map(a => [a.id, true])))}
                className="text-xs bg-[#e8f5e2] text-[#39A900] px-3 py-2 rounded-lg hover:bg-[#d0edcc] transition-colors font-medium"
              >
                Marcar todos
              </button>
              <button
                onClick={() => setAttendance({})}
                className="text-xs bg-gray-100 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Limpiar
              </button>
              <button className="flex items-center gap-1.5 text-xs bg-[#007AC0] text-white px-3 py-2 rounded-lg hover:bg-[#006bb0] transition-colors">
                <Download size={13} /> Exportar
              </button>
            </div>
          </div>

          {/* List */}
          <div className="divide-y divide-gray-50">
            {filteredAprendices.map((aprendiz) => {
              const presente = !!attendance[aprendiz.id];
              return (
                <div
                  key={aprendiz.id}
                  className={`flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors ${presente ? "" : "opacity-70"}`}
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 ${presente ? "bg-[#39A900]" : "bg-gray-300"}`}>
                    {aprendiz.nombre.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-gray-800 font-medium text-sm">{aprendiz.nombre}</div>
                    <div className="text-gray-500 text-xs">Ficha: {aprendiz.ficha} · Doc: {aprendiz.documento}</div>
                  </div>

                  <div className="hidden sm:block text-gray-400 text-xs truncate max-w-32">{aprendiz.programa}</div>

                  {presente && (
                    <div className="flex items-center gap-1.5 text-[#39A900] text-xs">
                      <Clock size={12} />
                      <span>08:{Math.floor(Math.random() * 59).toString().padStart(2, "0")}</span>
                    </div>
                  )}

                  <button
                    onClick={() => toggleAttendance(aprendiz.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      presente
                        ? "bg-[#e8f5e2] text-[#39A900] hover:bg-red-50 hover:text-red-500"
                        : "bg-gray-100 text-gray-500 hover:bg-[#e8f5e2] hover:text-[#39A900]"
                    }`}
                  >
                    {presente ? (
                      <><CheckCircle2 size={14} /> Presente</>
                    ) : (
                      <><XCircle size={14} /> Ausente</>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="p-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-gray-500 text-sm">{filteredAprendices.length} aprendices</span>
            <button className="flex items-center gap-2 bg-[#39A900] hover:bg-[#2d8a00] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              <CheckCircle2 size={16} /> Guardar asistencia
            </button>
          </div>
        </div>
      ) : (
        /* QR Scanner Mode */
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col items-center gap-6">
          <div className="text-center">
            <h3 className="text-gray-800 font-semibold">Modo escáner QR</h3>
            <p className="text-gray-500 text-sm mt-1">Apunta la cámara al QR del carnet del aprendiz para registrar su asistencia</p>
          </div>

          {/* Scanner mock */}
          <div className="relative w-64 h-64 bg-gray-900 rounded-2xl overflow-hidden flex items-center justify-center">
            <div className="absolute inset-4 border-2 border-[#39A900] rounded-lg">
              <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-[#39A900] rounded-tl-lg -translate-x-0.5 -translate-y-0.5"></div>
              <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-[#39A900] rounded-tr-lg translate-x-0.5 -translate-y-0.5"></div>
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-[#39A900] rounded-bl-lg -translate-x-0.5 translate-y-0.5"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-[#39A900] rounded-br-lg translate-x-0.5 translate-y-0.5"></div>

              {/* Scanning line animation */}
              <div
                className="absolute left-0 right-0 h-0.5 bg-[#39A900] opacity-80"
                style={{
                  top: "50%",
                  boxShadow: "0 0 8px #39A900",
                  animation: "scan 2s ease-in-out infinite",
                }}
              ></div>
            </div>
            <QrCode size={40} className="text-white/20" />
          </div>

          <style>{`
            @keyframes scan {
              0% { top: 10%; }
              50% { top: 85%; }
              100% { top: 10%; }
            }
          `}</style>

          {scanned && (
            <div className="bg-[#e8f5e2] border border-[#39A900]/30 rounded-xl p-4 flex items-center gap-3 w-full max-w-sm">
              <CheckCircle2 size={24} className="text-[#39A900] flex-shrink-0" />
              <div>
                <div className="text-[#39A900] font-medium">¡Asistencia registrada!</div>
                <div className="text-gray-600 text-sm">{scanName}</div>
              </div>
            </div>
          )}

          <button
            onClick={handleScan}
            className="flex items-center gap-2 bg-[#39A900] hover:bg-[#2d8a00] text-white px-8 py-3 rounded-xl font-medium transition-colors"
          >
            <QrCode size={18} /> Simular escaneo QR
          </button>

          <p className="text-gray-400 text-xs text-center max-w-xs">
            En el dispositivo real, la cámara se activará automáticamente para escanear el código QR del carnet
          </p>
        </div>
      )}
    </div>
  );
}
